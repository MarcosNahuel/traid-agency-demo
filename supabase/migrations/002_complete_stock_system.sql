-- ===========================================
-- COMPLETE STOCK SYSTEM SQL
-- Execute this in Supabase SQL Editor
-- URL: https://horsepower-supabase.e5l6dk.easypanel.host/project/default
-- ===========================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ml_items_status ON ml_items(status);
CREATE INDEX IF NOT EXISTS idx_ml_items_sku ON ml_items(sku);
CREATE INDEX IF NOT EXISTS idx_ml_items_updated ON ml_items(updated_at DESC);

-- ===========================================
-- TABLE 2: ml_orders_items (Ventas históricas)
-- ===========================================
CREATE TABLE IF NOT EXISTS ml_orders_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL,
    item_id TEXT NOT NULL REFERENCES ml_items(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC,
    order_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(order_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_ml_orders_items_item ON ml_orders_items(item_id);
CREATE INDEX IF NOT EXISTS idx_ml_orders_items_date ON ml_orders_items(order_date DESC);

-- ===========================================
-- TABLE 3: ml_item_metrics (Métricas calculadas)
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
    COALESCE(m.units_sold_30d, 0) as units_sold_30d,
    COALESCE(m.units_sold_90d, 0) as units_sold_90d,
    COALESCE(m.avg_daily_30d, 0) as avg_daily_30d,
    m.days_cover,
    COALESCE(m.lead_time_days, 7) as lead_time_days,
    COALESCE(m.safety_stock_units, 0) as safety_stock_units,
    COALESCE(m.reorder_point_units, 0) as reorder_point_units,
    m.reorder_in_days,
    m.reorder_date,
    COALESCE(m.severity, 'ok') as severity,
    COALESCE(m.calculated_at, now()) as calculated_at
FROM ml_items i
LEFT JOIN ml_item_metrics m ON i.item_id = m.item_id
WHERE i.status = 'active';

-- ===========================================
-- FUNCTION: Recalculate metrics for one item
-- ===========================================
CREATE OR REPLACE FUNCTION recalculate_item_metrics(p_item_id TEXT)
RETURNS VOID AS $$
DECLARE
    v_available_quantity INT;
    v_units_sold_30d INT;
    v_units_sold_90d INT;
    v_avg_daily NUMERIC;
    v_days_cover NUMERIC;
    v_lead_time INT := 7;
    v_safety_stock NUMERIC;
    v_reorder_point NUMERIC;
    v_reorder_in_days NUMERIC;
    v_reorder_date TIMESTAMPTZ;
    v_severity TEXT;
BEGIN
    -- Get current stock
    SELECT available_quantity INTO v_available_quantity
    FROM ml_items WHERE item_id = p_item_id;

    IF v_available_quantity IS NULL THEN
        RETURN;
    END IF;

    -- Calculate units sold in 30d
    SELECT COALESCE(SUM(quantity), 0) INTO v_units_sold_30d
    FROM ml_orders_items
    WHERE item_id = p_item_id
      AND order_date >= NOW() - INTERVAL '30 days';

    -- Calculate units sold in 90d
    SELECT COALESCE(SUM(quantity), 0) INTO v_units_sold_90d
    FROM ml_orders_items
    WHERE item_id = p_item_id
      AND order_date >= NOW() - INTERVAL '90 days';

    -- Average daily sales
    v_avg_daily := v_units_sold_30d::NUMERIC / 30;

    -- Days cover
    IF v_avg_daily > 0 THEN
        v_days_cover := v_available_quantity::NUMERIC / v_avg_daily;
    ELSE
        v_days_cover := NULL;
    END IF;

    -- Safety stock (3 days buffer)
    v_safety_stock := v_avg_daily * 3;

    -- Reorder point
    v_reorder_point := (v_avg_daily * v_lead_time) + v_safety_stock;

    -- Reorder in days
    IF v_avg_daily > 0 THEN
        v_reorder_in_days := (v_available_quantity - v_reorder_point) / v_avg_daily;
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

    -- Severity
    IF v_available_quantity <= v_reorder_point THEN
        v_severity := 'critical';
    ELSIF v_days_cover IS NOT NULL AND v_days_cover <= (v_lead_time + 5) THEN
        v_severity := 'warning';
    ELSE
        v_severity := 'ok';
    END IF;

    -- Upsert metrics
    INSERT INTO ml_item_metrics (
        item_id, units_sold_30d, units_sold_90d, avg_daily_30d,
        days_cover, lead_time_days, safety_stock_units, reorder_point_units,
        reorder_in_days, reorder_date, severity, calculated_at
    ) VALUES (
        p_item_id, v_units_sold_30d, v_units_sold_90d, ROUND(v_avg_daily, 2),
        ROUND(v_days_cover, 1), v_lead_time, ROUND(v_safety_stock, 0), ROUND(v_reorder_point, 0),
        ROUND(v_reorder_in_days, 1), v_reorder_date, v_severity, NOW()
    )
    ON CONFLICT (item_id) DO UPDATE SET
        units_sold_30d = EXCLUDED.units_sold_30d,
        units_sold_90d = EXCLUDED.units_sold_90d,
        avg_daily_30d = EXCLUDED.avg_daily_30d,
        days_cover = EXCLUDED.days_cover,
        lead_time_days = EXCLUDED.lead_time_days,
        safety_stock_units = EXCLUDED.safety_stock_units,
        reorder_point_units = EXCLUDED.reorder_point_units,
        reorder_in_days = EXCLUDED.reorder_in_days,
        reorder_date = EXCLUDED.reorder_date,
        severity = EXCLUDED.severity,
        calculated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- FUNCTION: Recalculate ALL metrics
-- ===========================================
CREATE OR REPLACE FUNCTION recalculate_all_metrics()
RETURNS TABLE (items_processed INT, execution_time INTERVAL) AS $$
DECLARE
    v_start TIMESTAMPTZ := NOW();
    v_count INT := 0;
    v_item RECORD;
BEGIN
    FOR v_item IN SELECT item_id FROM ml_items WHERE status = 'active'
    LOOP
        PERFORM recalculate_item_metrics(v_item.item_id);
        v_count := v_count + 1;
    END LOOP;

    RETURN QUERY SELECT v_count, NOW() - v_start;
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
-- RPC: Endpoint para recálculo desde API/n8n
-- ===========================================
-- Esto permite llamar: supabase.rpc('refresh_stock_metrics')
CREATE OR REPLACE FUNCTION refresh_stock_metrics()
RETURNS JSON AS $$
DECLARE
    v_result RECORD;
BEGIN
    SELECT * INTO v_result FROM recalculate_all_metrics();

    RETURN json_build_object(
        'success', true,
        'items_processed', v_result.items_processed,
        'execution_time_ms', EXTRACT(MILLISECONDS FROM v_result.execution_time),
        'timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- GRANT Permissions
-- ===========================================
GRANT ALL ON ml_items TO authenticated;
GRANT ALL ON ml_items TO anon;
GRANT ALL ON ml_orders_items TO authenticated;
GRANT ALL ON ml_orders_items TO anon;
GRANT ALL ON ml_item_metrics TO authenticated;
GRANT ALL ON ml_item_metrics TO anon;
GRANT SELECT ON v_stock_dashboard TO authenticated;
GRANT SELECT ON v_stock_dashboard TO anon;
GRANT USAGE ON SEQUENCE ml_orders_items_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE ml_orders_items_id_seq TO anon;

-- ===========================================
-- TEST: Insert sample data (optional)
-- ===========================================
-- Descomenta para probar con datos de ejemplo:
/*
INSERT INTO ml_items (item_id, title, price, available_quantity, status, sku) VALUES
('MLA1234567890', 'Kit Inyectores Chevrolet Corsa 1.6 x4', 85000, 12, 'active', 'INY-CORSA-X4'),
('MLA1234567891', 'Bomba de Combustible Universal 12V', 35000, 8, 'active', 'BOM-UNIV-12V'),
('MLA1234567892', 'Sensor MAP VW Gol/Voyage', 28000, 3, 'active', 'SEN-MAP-VW')
ON CONFLICT (item_id) DO NOTHING;

INSERT INTO ml_orders_items (order_id, item_id, quantity, order_date) VALUES
('ORD001', 'MLA1234567890', 2, NOW() - INTERVAL '5 days'),
('ORD002', 'MLA1234567890', 1, NOW() - INTERVAL '10 days'),
('ORD003', 'MLA1234567891', 3, NOW() - INTERVAL '3 days'),
('ORD004', 'MLA1234567892', 1, NOW() - INTERVAL '1 day')
ON CONFLICT (order_id, item_id) DO NOTHING;

-- Recalcular métricas después de insertar datos
SELECT * FROM recalculate_all_metrics();
*/
