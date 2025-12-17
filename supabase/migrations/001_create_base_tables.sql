-- =====================================================
-- CRM POSTVENTA DEMO - MarIA S.A.
-- Migracion 001: Tablas Base
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: products (Catalogo de Productos)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  mla_id VARCHAR(20),
  shopify_id VARCHAR(50),
  tiendanube_id VARCHAR(50),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  cost DECIMAL(12,2),
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT,
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'out_of_stock', 'discontinued')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para products
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_mla_id ON products(mla_id) WHERE mla_id IS NOT NULL;

-- =====================================================
-- TABLA: orders (Ordenes unificadas multi-canal)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id VARCHAR(100) NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('mercadolibre', 'shopify', 'tiendanube', 'manual')),
  status VARCHAR(30) NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned')),

  -- Buyer info
  buyer_id VARCHAR(100),
  buyer_name VARCHAR(200),
  buyer_email VARCHAR(200),
  buyer_phone VARCHAR(50),
  buyer_nickname VARCHAR(100),

  -- Product info
  product_id UUID REFERENCES products(id),
  product_sku VARCHAR(50),
  product_title VARCHAR(500),
  quantity INT DEFAULT 1,
  unit_price DECIMAL(12,2),
  total DECIMAL(12,2),

  -- Shipping info
  shipping_id VARCHAR(100),
  shipping_status VARCHAR(30),
  shipping_carrier VARCHAR(50),
  shipping_logistic_type VARCHAR(50),
  tracking_number VARCHAR(100),
  date_shipped TIMESTAMPTZ,
  date_delivered TIMESTAMPTZ,
  receiver_city VARCHAR(100),
  receiver_state VARCHAR(100),

  -- Billing info
  billing_doc_type VARCHAR(10),
  billing_doc_number VARCHAR(20),
  billing_taxpayer_type VARCHAR(50),
  can_receive_factura_a BOOLEAN DEFAULT FALSE,

  -- Metadata
  tags TEXT[],
  cancellation_reason VARCHAR(100),
  has_mediation BOOLEAN DEFAULT FALSE,
  mediation_id VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(channel, external_id)
);

-- Indices para orders
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_external_id ON orders(external_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON orders(shipping_status);

-- =====================================================
-- TABLA: conversations (Conversaciones CRM)
-- =====================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('mercadolibre', 'shopify', 'tiendanube', 'manual', 'whatsapp')),

  -- Buyer info
  buyer_id VARCHAR(100),
  buyer_name VARCHAR(200),
  buyer_email VARCHAR(200),

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated')),
  case_type VARCHAR(50),

  -- Agent info
  assigned_agent_id UUID,
  assigned_human_id UUID,
  ai_handled BOOLEAN DEFAULT FALSE,
  escalated BOOLEAN DEFAULT FALSE,

  -- Timestamps
  first_message_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para conversations
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON conversations(order_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_escalated ON conversations(escalated) WHERE escalated = TRUE;

-- =====================================================
-- TABLA: messages (Mensajes de conversaciones)
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Message info
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('buyer', 'seller', 'ai', 'system')),
  content TEXT NOT NULL,

  -- AI metadata
  tool_used VARCHAR(50),
  confidence DECIMAL(3,2),
  response_time_ms INT,

  -- External reference
  external_message_id VARCHAR(100),

  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages(sender_type);

-- =====================================================
-- TABLA: escalations (Casos escalados a humanos)
-- =====================================================
CREATE TABLE IF NOT EXISTS escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  order_id UUID REFERENCES orders(id),

  -- Channel & Buyer
  channel VARCHAR(20),
  buyer_id VARCHAR(100),
  buyer_name VARCHAR(200),
  buyer_email VARCHAR(200),

  -- Case info
  original_message TEXT,
  reason TEXT NOT NULL,
  case_type VARCHAR(50),
  priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),

  -- Product context
  product_sku VARCHAR(50),
  product_title VARCHAR(500),
  product_price DECIMAL(12,2),

  -- AI response
  ai_suggested_response TEXT,

  -- Human response
  human_response TEXT,
  resolution_notes TEXT,
  assigned_to VARCHAR(200),

  -- Timestamps
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para escalations
CREATE INDEX IF NOT EXISTS idx_escalations_status ON escalations(status);
CREATE INDEX IF NOT EXISTS idx_escalations_priority ON escalations(priority);
CREATE INDEX IF NOT EXISTS idx_escalations_channel ON escalations(channel);
CREATE INDEX IF NOT EXISTS idx_escalations_created_at ON escalations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_escalations_case_type ON escalations(case_type);

-- =====================================================
-- TABLA: ai_agents (Agentes IA configurados)
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('preventa', 'postventa', 'soporte')),
  avatar TEXT,
  description TEXT,
  channels TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB,
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: ai_interactions (Log de interacciones IA)
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES ai_agents(id),
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID REFERENCES messages(id),

  -- Interaction details
  input_message TEXT NOT NULL,
  output_message TEXT NOT NULL,
  tool_used VARCHAR(50),
  confidence DECIMAL(3,2),
  response_time_ms INT,
  escalated BOOLEAN DEFAULT FALSE,
  escalation_reason TEXT,

  -- Metadata
  channel VARCHAR(20),
  buyer_id VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para ai_interactions
CREATE INDEX IF NOT EXISTS idx_ai_interactions_agent_id ON ai_interactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_escalated ON ai_interactions(escalated) WHERE escalated = TRUE;

-- =====================================================
-- TABLA: product_metrics (Metricas de stock)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_metrics (
  product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,

  -- Sales metrics
  units_sold_7d INT DEFAULT 0,
  units_sold_30d INT DEFAULT 0,
  units_sold_90d INT DEFAULT 0,
  avg_daily_sales DECIMAL(10,2) DEFAULT 0,

  -- Stock metrics
  days_of_stock DECIMAL(10,2),
  lead_time_days INT DEFAULT 7,
  safety_stock INT DEFAULT 0,
  reorder_point INT DEFAULT 0,
  reorder_in_days DECIMAL(10,2),
  reorder_date DATE,

  -- Severity
  severity VARCHAR(10) DEFAULT 'ok' CHECK (severity IN ('critical', 'warning', 'ok')),

  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para product_metrics
CREATE INDEX IF NOT EXISTS idx_product_metrics_severity ON product_metrics(severity);
CREATE INDEX IF NOT EXISTS idx_product_metrics_reorder_date ON product_metrics(reorder_date);

-- =====================================================
-- TRIGGERS: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['products', 'orders', 'conversations', 'escalations', 'ai_agents'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
      CREATE TRIGGER update_%s_updated_at
      BEFORE UPDATE ON %s
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;

-- =====================================================
-- RLS: Row Level Security
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_metrics ENABLE ROW LEVEL SECURITY;

-- Politicas permisivas para demo (en produccion, restringir)
CREATE POLICY "Allow all for authenticated" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow read for anon" ON products FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow read for anon" ON orders FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON conversations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON conversations FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON messages FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON escalations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON escalations FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON ai_agents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow read for anon" ON ai_agents FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON ai_interactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow read for anon" ON ai_interactions FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON product_metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow read for anon" ON product_metrics FOR SELECT TO anon USING (true);

-- =====================================================
-- REALTIME: Habilitar subscripciones
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE escalations;

-- =====================================================
-- GRANTS
-- =====================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT, UPDATE ON conversations TO anon;
GRANT INSERT ON messages TO anon;
GRANT INSERT, UPDATE ON escalations TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
