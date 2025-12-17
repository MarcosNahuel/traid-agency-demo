-- Migration: Tabla para logging de interacciones de agentes IA
-- Para el demo de MarIA S.A.

CREATE TABLE IF NOT EXISTS agent_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL, -- 'preventa', 'postventa'
  input_message TEXT NOT NULL,
  output_message TEXT,
  tool_used TEXT,
  escalated BOOLEAN DEFAULT false,
  session_id TEXT,
  order_id TEXT,
  buyer_name TEXT,
  buyer_id TEXT,
  product_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_agent_interactions_agent_type ON agent_interactions(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_session ON agent_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_created ON agent_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_escalated ON agent_interactions(escalated) WHERE escalated = true;

-- RLS: Permitir todo para el demo
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for agent_interactions" ON agent_interactions
  FOR ALL USING (true) WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE agent_interactions IS 'Log de todas las interacciones con agentes IA';
COMMENT ON COLUMN agent_interactions.agent_type IS 'Tipo de agente: preventa o postventa';
COMMENT ON COLUMN agent_interactions.tool_used IS 'Herramienta usada por el agente (buscar_productos, soporte, etc)';
COMMENT ON COLUMN agent_interactions.escalated IS 'Si la conversacion fue derivada a soporte humano';
