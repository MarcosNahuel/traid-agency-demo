-- TiendaLubbi CRM - Database Schema
-- Version: 1.0
-- Date: 2024-12

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================
-- Conversations Table
-- ==================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id BIGINT,
  buyer_id BIGINT NOT NULL,
  buyer_nickname VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated')),
  case_type VARCHAR(50),
  assigned_to UUID,
  first_message_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_pack_id ON conversations(pack_id);

-- ==================================
-- Messages Table
-- ==================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  sender_type VARCHAR(20) CHECK (sender_type IN ('buyer', 'seller', 'ai', 'system')),
  content TEXT NOT NULL,
  responder_type VARCHAR(20),
  tool_used VARCHAR(50),
  ml_message_id VARCHAR(100),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);

-- ==================================
-- Escalations Table
-- ==================================
CREATE TABLE IF NOT EXISTS escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  order_id VARCHAR(50),
  pack_id VARCHAR(50),
  buyer_id VARCHAR(50),
  buyer_nickname VARCHAR(100),
  buyer_message TEXT,
  reason TEXT,
  case_type VARCHAR(50),
  source VARCHAR(20) DEFAULT 'postventa' CHECK (source IN ('postventa', 'preventa', 'manual')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),
  priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  human_response TEXT,
  resolution_notes TEXT,
  n8n_execution_id VARCHAR(100),
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for escalations
CREATE INDEX IF NOT EXISTS idx_escalations_status ON escalations(status);
CREATE INDEX IF NOT EXISTS idx_escalations_priority ON escalations(priority);
CREATE INDEX IF NOT EXISTS idx_escalations_source ON escalations(source);
CREATE INDEX IF NOT EXISTS idx_escalations_created_at ON escalations(created_at DESC);

-- ==================================
-- Row Level Security (RLS)
-- ==================================
-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;

-- Policies - Allow all operations for authenticated users
-- In production, you'd want more restrictive policies

CREATE POLICY "Allow all for authenticated users" ON conversations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON escalations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anonymous access for testing (remove in production)
CREATE POLICY "Allow read for anon" ON conversations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow read for anon" ON messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow read for anon" ON escalations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anon" ON escalations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ==================================
-- Realtime subscriptions
-- ==================================
-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE escalations;

-- ==================================
-- Updated_at trigger
-- ==================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escalations_updated_at
  BEFORE UPDATE ON escalations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
