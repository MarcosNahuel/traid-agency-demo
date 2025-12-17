-- =====================================================
-- MIGRACION: MarIA S.A. - CRM Demo Gaming
-- Fecha: 2025-12-17
-- Descripcion: Tablas completas para demo CRM postventa
-- Supabase Cloud: zaqpiuwacinvebfttygm.supabase.co
-- =====================================================

-- Eliminar tablas existentes si existen (para recrear limpio)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS escalations CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS ai_agents CASCADE;
DROP TABLE IF EXISTS dashboard_metrics CASCADE;

-- =====================================================
-- 1. PRODUCTOS GAMING
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  cost NUMERIC,
  stock INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  image_url TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para productos
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_active ON products(is_active);

-- =====================================================
-- 2. ORDENES MULTI-CANAL
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('mercadolibre', 'shopify', 'tiendanube', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned')),

  -- Producto (JSONB para flexibilidad)
  product JSONB NOT NULL,
  -- Estructura: {id, sku, title, price, quantity, category}

  -- Comprador
  buyer JSONB NOT NULL,
  -- Estructura: {id, first_name, last_name, nickname, email, phone}

  -- Envio
  shipping JSONB NOT NULL,
  -- Estructura: {id, status, carrier, logistic_type, tracking_number, date_shipped, date_delivered, receiver_city, receiver_state}

  -- Facturacion
  billing JSONB NOT NULL,
  -- Estructura: {doc_type, doc_number, taxpayer_type, can_receive_factura_a}

  tags TEXT[],
  has_mediation BOOLEAN DEFAULT false,
  mediation_id TEXT,
  date_created TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para ordenes
CREATE INDEX idx_orders_channel ON orders(channel);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_external_id ON orders(external_id);
CREATE INDEX idx_orders_date ON orders(date_created DESC);
CREATE INDEX idx_orders_buyer_id ON orders((buyer->>'id'));

-- =====================================================
-- 3. CONVERSACIONES
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT,
  channel TEXT,
  buyer_id TEXT NOT NULL,
  buyer_name TEXT,
  buyer_nickname TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated')),
  case_type TEXT,
  ai_handled BOOLEAN DEFAULT false,
  escalated BOOLEAN DEFAULT false,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para conversaciones
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_order ON conversations(order_id);
CREATE INDEX idx_conversations_escalated ON conversations(escalated) WHERE escalated = true;

-- =====================================================
-- 4. MENSAJES
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('buyer', 'ai', 'seller', 'system')),
  content TEXT NOT NULL,
  tool_used TEXT,
  metadata JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para mensajes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_type);

-- =====================================================
-- 5. ESCALACIONES (SOPORTE HUMANO)
-- =====================================================
CREATE TABLE escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  order_id TEXT,
  channel TEXT,
  buyer_id TEXT,
  buyer_name TEXT,
  buyer_email TEXT,
  original_message TEXT,
  reason TEXT,
  case_type TEXT,
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),

  -- Contexto del producto/envio
  product JSONB,
  shipping_info JSONB,

  -- Respuestas
  ai_suggested_response TEXT,
  human_response TEXT,
  resolution_notes TEXT,

  -- Asignacion
  assigned_to TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para escalaciones
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);
CREATE INDEX idx_escalations_case_type ON escalations(case_type);
CREATE INDEX idx_escalations_created ON escalations(created_at DESC);

-- =====================================================
-- 6. AGENTES IA
-- =====================================================
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('preventa', 'postventa', 'soporte')),
  avatar TEXT,
  description TEXT,
  channels TEXT[],
  is_active BOOLEAN DEFAULT true,

  -- Configuracion del agente
  config JSONB,
  -- Estructura: {personality, greeting, escalation_triggers, tools, response_style, max_response_length}

  -- Metricas de performance
  metrics JSONB,
  -- Estructura: {total_conversations, resolved_without_escalation, resolution_rate, avg_response_time_ms, satisfaction_score}

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para agentes
CREATE INDEX idx_agents_type ON ai_agents(type);
CREATE INDEX idx_agents_active ON ai_agents(is_active);

-- =====================================================
-- 7. METRICAS DASHBOARD
-- =====================================================
CREATE TABLE dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  -- Tipos: summary, monthly_sales, category_breakdown, top_products, customer_segments, projections
  period TEXT,
  -- Formato: 2024-12, 2025-Q1, all-time, etc
  data JSONB NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para metricas
CREATE INDEX idx_metrics_type ON dashboard_metrics(metric_type);
CREATE INDEX idx_metrics_period ON dashboard_metrics(period);

-- =====================================================
-- 8. INTERACCIONES IA (LOG)
-- =====================================================
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  conversation_id UUID REFERENCES conversations(id),
  order_id TEXT,
  input_message TEXT NOT NULL,
  output_response TEXT,
  tools_used TEXT[],
  was_escalated BOOLEAN DEFAULT false,
  escalation_reason TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para interacciones
CREATE INDEX idx_interactions_agent ON ai_interactions(agent_id);
CREATE INDEX idx_interactions_conversation ON ai_interactions(conversation_id);
CREATE INDEX idx_interactions_escalated ON ai_interactions(was_escalated);
CREATE INDEX idx_interactions_created ON ai_interactions(created_at DESC);

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Funcion para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escalations_updated_at BEFORE UPDATE ON escalations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Deshabilitar RLS para permitir acceso con anon key (demo)

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Politicas permisivas para demo (acceso total con anon key)
CREATE POLICY "Allow all for products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for escalations" ON escalations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ai_agents" ON ai_agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for dashboard_metrics" ON dashboard_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ai_interactions" ON ai_interactions FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- HABILITAR REALTIME
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE escalations;

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON TABLE products IS 'Catalogo de productos gaming de MarIA S.A.';
COMMENT ON TABLE orders IS 'Ordenes multi-canal (MercadoLibre, Shopify, TiendaNube)';
COMMENT ON TABLE conversations IS 'Conversaciones de soporte con compradores';
COMMENT ON TABLE messages IS 'Mensajes dentro de cada conversacion';
COMMENT ON TABLE escalations IS 'Casos escalados a soporte humano';
COMMENT ON TABLE ai_agents IS 'Configuracion de agentes IA (Barbi, Tomi, Sofi)';
COMMENT ON TABLE dashboard_metrics IS 'Metricas pre-calculadas para dashboard';
COMMENT ON TABLE ai_interactions IS 'Log de todas las interacciones con IA';
