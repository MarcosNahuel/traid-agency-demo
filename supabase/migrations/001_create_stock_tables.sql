-- Migration: Create Stock & Reposition Tables
-- Date: 2025-12-15
-- Description: Tables for ml_items catalog and ml_item_metrics calculations

-- ===========================================
-- TABLE 1: ml_items (Catálogo + Stock actual)
-- ===========================================
CREATE TABLE IF NOT EXISTS ml_items (
    item_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    permalink TEXT,
    thumbnail TEXT,
    price NUMERIC,
    available_quantity INT NOT NULL DEFAULT 0,
    status TEXT,
    sku TEXT,
    category_id TEXT,
    seller_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_ml_items_status ON ml_items(status);
CREATE INDEX IF NOT EXISTS idx_ml_items_sku ON ml_items(sku);
CREATE INDEX IF NOT EXISTS idx_ml_items_updated ON ml_items(updated_at DESC);

-- ===========================================
-- TABLE 2: ml_item_metrics (Métricas calculadas)
-- ===========================================
CREATE TABLE IF NOT EXISTS ml_item_metrics (
    item_id TEXT PRIMARY KEY REFERENCES ml_items(item_id) ON DELETE CASCADE,
    units_sold_30d INT NOT NULL DEFAULT 0,
    units_sold_90d INT NOT NULL DEFAULT 0,
    avg_daily_30d NUMERIC NOT NULL DEFAULT 0,
    days_cover NUMERIC,
    lead_time_days INT NOT NULL DEFAULT 7,
    safety_stock_units NUMERIC NOT NULL DEFAULT 0,
    reorder_point_units NUMERIC NOT NULL DEFAULT 0,
    reorder_in_days NUMERIC,
    reorder_date TIMESTAMPTZ,
    severity TEXT NOT NULL DEFAULT 'ok' CHECK (severity IN ('critical', 'warning', 'ok')),
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_ml_item_metrics_severity ON ml_item_metrics(severity);
CREATE INDEX IF NOT EXISTS idx_ml_item_metrics_reorder_date ON ml_item_metrics(reorder_date);
CREATE INDEX IF NOT EXISTS idx_ml_item_metrics_units_sold ON ml_item_metrics(units_sold_30d DESC);
CREATE INDEX IF NOT EXISTS idx_ml_item_metrics_avg_daily ON ml_item_metrics(avg_daily_30d DESC);

-- ===========================================
-- VIEW: Stock Dashboard View
-- ===========================================
CREATE OR REPLACE VIEW v_stock_dashboard AS
SELECT
    i.item_id,
    i.title,
    i.permalink,
    i.thumbnail,
    i.price,
    i.available_quantity,
    i.status,
    i.sku,
    i.updated_at,
    m.units_sold_30d,
    m.units_sold_90d,
    m.avg_daily_30d,
    m.days_cover,
    m.lead_time_days,
    m.safety_stock_units,
    m.reorder_point_units,
    m.reorder_in_days,
    m.reorder_date,
    m.severity,
    m.calculated_at
FROM ml_items i
LEFT JOIN ml_item_metrics m ON i.item_id = m.item_id
WHERE i.status = 'active';

-- ===========================================
-- FUNCTION: Calculate item metrics
-- ===========================================
CREATE OR REPLACE FUNCTION calculate_item_metrics(
    p_item_id TEXT,
    p_units_sold_30d INT,
    p_units_sold_90d INT,
    p_available_quantity INT,
    p_lead_time_days INT DEFAULT 7
)
RETURNS TABLE (
    avg_daily_30d NUMERIC,
    days_cover NUMERIC,
    safety_stock_units NUMERIC,
    reorder_point_units NUMERIC,
    reorder_in_days NUMERIC,
    reorder_date TIMESTAMPTZ,
    severity TEXT
) AS $$
DECLARE
    v_avg_daily NUMERIC;
    v_days_cover NUMERIC;
    v_safety_stock NUMERIC;
    v_reorder_point NUMERIC;
    v_reorder_in_days NUMERIC;
    v_reorder_date TIMESTAMPTZ;
    v_severity TEXT;
BEGIN
    -- Calculate average daily sales (30d)
    v_avg_daily := p_units_sold_30d::NUMERIC / 30;

    -- Calculate days cover
    IF v_avg_daily > 0 THEN
        v_days_cover := p_available_quantity::NUMERIC / v_avg_daily;
    ELSE
        v_days_cover := NULL;
    END IF;

    -- Safety stock (3 days buffer)
    v_safety_stock := v_avg_daily * 3;

    -- Reorder point
    v_reorder_point := (v_avg_daily * p_lead_time_days) + v_safety_stock;

    -- Reorder in days
    IF v_avg_daily > 0 THEN
        v_reorder_in_days := (p_available_quantity - v_reorder_point) / v_avg_daily;
    ELSE
        v_reorder_in_days := NULL;
    END IF;

    -- Reorder date
    IF v_reorder_in_days IS NOT NULL AND v_reorder_in_days > 0 THEN
        v_reorder_date := NOW() + (v_reorder_in_days || ' days')::INTERVAL;
    ELSIF v_reorder_in_days IS NOT NULL AND v_reorder_in_days <= 0 THEN
        v_reorder_date := NOW();
    ELSE
        v_reorder_date := NULL;
    END IF;

    -- Severity calculation
    IF p_available_quantity <= v_reorder_point THEN
        v_severity := 'critical';
    ELSIF v_days_cover IS NOT NULL AND v_days_cover <= (p_lead_time_days + 5) THEN
        v_severity := 'warning';
    ELSE
        v_severity := 'ok';
    END IF;

    RETURN QUERY SELECT
        ROUND(v_avg_daily, 2),
        ROUND(v_days_cover, 1),
        ROUND(v_safety_stock, 0),
        ROUND(v_reorder_point, 0),
        ROUND(v_reorder_in_days, 1),
        v_reorder_date,
        v_severity;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TRIGGER: Auto-update updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ml_items_updated_at ON ml_items;
CREATE TRIGGER trigger_ml_items_updated_at
    BEFORE UPDATE ON ml_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- GRANT Permissions
-- ===========================================
GRANT ALL ON ml_items TO authenticated;
GRANT ALL ON ml_items TO anon;
GRANT ALL ON ml_item_metrics TO authenticated;
GRANT ALL ON ml_item_metrics TO anon;
GRANT SELECT ON v_stock_dashboard TO authenticated;
GRANT SELECT ON v_stock_dashboard TO anon;
