-- =====================================================
-- CRM POSTVENTA DEMO - MarIA S.A.
-- Migracion 002: Funciones y Vistas
-- =====================================================

-- =====================================================
-- VISTA: v_dashboard_summary (Resumen para dashboard)
-- =====================================================
CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT
  -- Ordenes
  (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '24 hours') as orders_today,
  (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '7 days') as orders_week,
  (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as orders_month,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as revenue_month,

  -- Por canal
  (SELECT COUNT(*) FROM orders WHERE channel = 'mercadolibre' AND created_at >= NOW() - INTERVAL '30 days') as orders_ml_month,
  (SELECT COUNT(*) FROM orders WHERE channel = 'shopify' AND created_at >= NOW() - INTERVAL '30 days') as orders_shopify_month,
  (SELECT COUNT(*) FROM orders WHERE channel = 'tiendanube' AND created_at >= NOW() - INTERVAL '30 days') as orders_tn_month,

  -- Conversaciones
  (SELECT COUNT(*) FROM conversations WHERE status = 'pending') as conversations_pending,
  (SELECT COUNT(*) FROM conversations WHERE status = 'in_progress') as conversations_in_progress,
  (SELECT COUNT(*) FROM conversations WHERE resolved_at >= NOW() - INTERVAL '24 hours') as conversations_resolved_today,

  -- Escalaciones
  (SELECT COUNT(*) FROM escalations WHERE status = 'pending') as escalations_pending,
  (SELECT COUNT(*) FROM escalations WHERE status = 'in_progress') as escalations_in_progress,
  (SELECT COUNT(*) FROM escalations WHERE priority = 1 AND status IN ('pending', 'in_progress')) as escalations_urgent,

  -- Stock
  (SELECT COUNT(*) FROM product_metrics WHERE severity = 'critical') as stock_critical,
  (SELECT COUNT(*) FROM product_metrics WHERE severity = 'warning') as stock_warning,

  -- AI Performance
  (SELECT COUNT(*) FROM ai_interactions WHERE created_at >= NOW() - INTERVAL '24 hours') as ai_interactions_today,
  (SELECT COUNT(*) FROM ai_interactions WHERE escalated = FALSE AND created_at >= NOW() - INTERVAL '24 hours') as ai_resolved_today;

-- =====================================================
-- VISTA: v_stock_dashboard (Stock con metricas)
-- =====================================================
CREATE OR REPLACE VIEW v_stock_dashboard AS
SELECT
  p.id,
  p.sku,
  p.title,
  p.price,
  p.stock,
  p.category,
  p.brand,
  p.image_url,
  p.status,
  COALESCE(m.units_sold_7d, 0) as units_sold_7d,
  COALESCE(m.units_sold_30d, 0) as units_sold_30d,
  COALESCE(m.units_sold_90d, 0) as units_sold_90d,
  COALESCE(m.avg_daily_sales, 0) as avg_daily_sales,
  m.days_of_stock,
  COALESCE(m.lead_time_days, 7) as lead_time_days,
  COALESCE(m.safety_stock, 0) as safety_stock,
  COALESCE(m.reorder_point, 0) as reorder_point,
  m.reorder_in_days,
  m.reorder_date,
  COALESCE(m.severity, 'ok') as severity,
  COALESCE(m.calculated_at, NOW()) as calculated_at
FROM products p
LEFT JOIN product_metrics m ON p.id = m.product_id
WHERE p.status = 'active'
ORDER BY
  CASE m.severity
    WHEN 'critical' THEN 1
    WHEN 'warning' THEN 2
    ELSE 3
  END,
  m.avg_daily_sales DESC NULLS LAST;

-- =====================================================
-- VISTA: v_conversations_full (Conversaciones con contexto)
-- =====================================================
CREATE OR REPLACE VIEW v_conversations_full AS
SELECT
  c.*,
  o.external_id as order_external_id,
  o.product_title as order_product_title,
  o.product_sku as order_product_sku,
  o.total as order_total,
  o.shipping_status as order_shipping_status,
  (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count,
  (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message
FROM conversations c
LEFT JOIN orders o ON c.order_id = o.id
ORDER BY c.last_message_at DESC;

-- =====================================================
-- FUNCION: calculate_product_metrics
-- Calcula metricas de stock para un producto
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_product_metrics(p_product_id UUID)
RETURNS VOID AS $$
DECLARE
  v_stock INT;
  v_sold_7d INT;
  v_sold_30d INT;
  v_sold_90d INT;
  v_avg_daily DECIMAL(10,2);
  v_days_cover DECIMAL(10,2);
  v_lead_time INT := 7;
  v_safety_stock INT;
  v_reorder_point INT;
  v_reorder_in_days DECIMAL(10,2);
  v_reorder_date DATE;
  v_severity VARCHAR(10);
BEGIN
  -- Obtener stock actual
  SELECT stock INTO v_stock FROM products WHERE id = p_product_id;

  -- Calcular ventas por periodo (basado en ordenes)
  SELECT COALESCE(SUM(quantity), 0) INTO v_sold_7d
  FROM orders
  WHERE product_id = p_product_id
    AND status IN ('delivered', 'shipped', 'in_transit')
    AND created_at >= NOW() - INTERVAL '7 days';

  SELECT COALESCE(SUM(quantity), 0) INTO v_sold_30d
  FROM orders
  WHERE product_id = p_product_id
    AND status IN ('delivered', 'shipped', 'in_transit')
    AND created_at >= NOW() - INTERVAL '30 days';

  SELECT COALESCE(SUM(quantity), 0) INTO v_sold_90d
  FROM orders
  WHERE product_id = p_product_id
    AND status IN ('delivered', 'shipped', 'in_transit')
    AND created_at >= NOW() - INTERVAL '90 days';

  -- Calcular promedio diario (ultimos 30 dias)
  v_avg_daily := ROUND(v_sold_30d::DECIMAL / 30, 2);

  -- Calcular dias de cobertura
  IF v_avg_daily > 0 THEN
    v_days_cover := ROUND(v_stock / v_avg_daily, 1);
  ELSE
    v_days_cover := NULL;
  END IF;

  -- Stock de seguridad (3 dias de venta)
  v_safety_stock := CEIL(v_avg_daily * 3);

  -- Punto de reposicion
  v_reorder_point := CEIL((v_avg_daily * v_lead_time) + v_safety_stock);

  -- Dias hasta reposicion
  IF v_avg_daily > 0 AND v_stock > v_reorder_point THEN
    v_reorder_in_days := ROUND((v_stock - v_reorder_point) / v_avg_daily, 1);
    v_reorder_date := CURRENT_DATE + v_reorder_in_days::INT;
  ELSIF v_stock <= v_reorder_point THEN
    v_reorder_in_days := 0;
    v_reorder_date := CURRENT_DATE;
  ELSE
    v_reorder_in_days := NULL;
    v_reorder_date := NULL;
  END IF;

  -- Determinar severidad
  IF v_stock <= v_reorder_point THEN
    v_severity := 'critical';
  ELSIF v_days_cover IS NOT NULL AND v_days_cover <= (v_lead_time + 5) THEN
    v_severity := 'warning';
  ELSE
    v_severity := 'ok';
  END IF;

  -- Insertar o actualizar metricas
  INSERT INTO product_metrics (
    product_id, units_sold_7d, units_sold_30d, units_sold_90d,
    avg_daily_sales, days_of_stock, lead_time_days, safety_stock,
    reorder_point, reorder_in_days, reorder_date, severity, calculated_at
  ) VALUES (
    p_product_id, v_sold_7d, v_sold_30d, v_sold_90d,
    v_avg_daily, v_days_cover, v_lead_time, v_safety_stock,
    v_reorder_point, v_reorder_in_days, v_reorder_date, v_severity, NOW()
  )
  ON CONFLICT (product_id) DO UPDATE SET
    units_sold_7d = EXCLUDED.units_sold_7d,
    units_sold_30d = EXCLUDED.units_sold_30d,
    units_sold_90d = EXCLUDED.units_sold_90d,
    avg_daily_sales = EXCLUDED.avg_daily_sales,
    days_of_stock = EXCLUDED.days_of_stock,
    safety_stock = EXCLUDED.safety_stock,
    reorder_point = EXCLUDED.reorder_point,
    reorder_in_days = EXCLUDED.reorder_in_days,
    reorder_date = EXCLUDED.reorder_date,
    severity = EXCLUDED.severity,
    calculated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: recalculate_all_metrics
-- Recalcula metricas para todos los productos activos
-- =====================================================
CREATE OR REPLACE FUNCTION recalculate_all_metrics()
RETURNS TABLE (
  items_processed INT,
  execution_time_ms INT
) AS $$
DECLARE
  v_start TIMESTAMPTZ;
  v_product_id UUID;
  v_count INT := 0;
BEGIN
  v_start := clock_timestamp();

  FOR v_product_id IN SELECT id FROM products WHERE status = 'active'
  LOOP
    PERFORM calculate_product_metrics(v_product_id);
    v_count := v_count + 1;
  END LOOP;

  RETURN QUERY SELECT
    v_count,
    EXTRACT(MILLISECONDS FROM clock_timestamp() - v_start)::INT;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: refresh_stock_metrics (RPC para n8n)
-- =====================================================
CREATE OR REPLACE FUNCTION refresh_stock_metrics()
RETURNS JSON AS $$
DECLARE
  v_result RECORD;
BEGIN
  SELECT * INTO v_result FROM recalculate_all_metrics();

  RETURN json_build_object(
    'success', true,
    'items_processed', v_result.items_processed,
    'execution_time_ms', v_result.execution_time_ms,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: get_agent_metrics
-- Obtiene metricas de un agente para periodo especifico
-- =====================================================
CREATE OR REPLACE FUNCTION get_agent_metrics(
  p_agent_id UUID,
  p_days INT DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
  v_total INT;
  v_resolved INT;
  v_escalated INT;
  v_avg_response INT;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE escalated = FALSE),
    COUNT(*) FILTER (WHERE escalated = TRUE),
    COALESCE(AVG(response_time_ms), 0)::INT
  INTO v_total, v_resolved, v_escalated, v_avg_response
  FROM ai_interactions
  WHERE agent_id = p_agent_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;

  RETURN json_build_object(
    'period_days', p_days,
    'total_conversations', v_total,
    'resolved_by_ai', v_resolved,
    'escalated', v_escalated,
    'resolution_rate', CASE WHEN v_total > 0 THEN ROUND(v_resolved::DECIMAL / v_total, 2) ELSE 0 END,
    'avg_response_time_ms', v_avg_response
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: create_escalation_from_conversation
-- Crea escalacion desde una conversacion
-- =====================================================
CREATE OR REPLACE FUNCTION create_escalation_from_conversation(
  p_conversation_id UUID,
  p_reason TEXT,
  p_case_type VARCHAR(50),
  p_priority INT DEFAULT 3,
  p_ai_suggested_response TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_conv RECORD;
  v_order RECORD;
  v_escalation_id UUID;
BEGIN
  -- Obtener datos de la conversacion
  SELECT * INTO v_conv FROM conversations WHERE id = p_conversation_id;

  -- Obtener datos de la orden si existe
  IF v_conv.order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM orders WHERE id = v_conv.order_id;
  END IF;

  -- Crear escalacion
  INSERT INTO escalations (
    conversation_id, order_id, channel,
    buyer_id, buyer_name, buyer_email,
    original_message, reason, case_type, priority,
    product_sku, product_title, product_price,
    ai_suggested_response, status
  ) VALUES (
    p_conversation_id, v_conv.order_id, v_conv.channel,
    v_conv.buyer_id, v_conv.buyer_name, v_conv.buyer_email,
    (SELECT content FROM messages WHERE conversation_id = p_conversation_id ORDER BY sent_at ASC LIMIT 1),
    p_reason, p_case_type, p_priority,
    v_order.product_sku, v_order.product_title, v_order.unit_price,
    p_ai_suggested_response, 'pending'
  ) RETURNING id INTO v_escalation_id;

  -- Actualizar conversacion
  UPDATE conversations SET
    status = 'escalated',
    escalated = TRUE,
    updated_at = NOW()
  WHERE id = p_conversation_id;

  RETURN v_escalation_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- GRANTS para funciones
-- =====================================================
GRANT EXECUTE ON FUNCTION calculate_product_metrics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_all_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_stock_metrics() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_agent_metrics(UUID, INT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION create_escalation_from_conversation(UUID, TEXT, VARCHAR, INT, TEXT) TO authenticated, anon;
