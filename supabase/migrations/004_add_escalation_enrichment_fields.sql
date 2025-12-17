-- Migration: Add enrichment fields to support_escalations
-- These fields allow storing product, shipping, and AI response data

-- Add new columns for enriched escalation data
ALTER TABLE support_escalations
ADD COLUMN IF NOT EXISTS original_message TEXT,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_response TEXT,
ADD COLUMN IF NOT EXISTS product_title TEXT,
ADD COLUMN IF NOT EXISTS product_sku TEXT,
ADD COLUMN IF NOT EXISTS product_price NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS envio_status TEXT,
ADD COLUMN IF NOT EXISTS envio_fecha_entrega TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS envio_dias_desde_entrega INTEGER,
ADD COLUMN IF NOT EXISTS ml_response_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ml_response_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS resumen_caso TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN support_escalations.original_message IS 'The original message from the buyer';
COMMENT ON COLUMN support_escalations.is_urgent IS 'Flag for urgent cases requiring immediate attention';
COMMENT ON COLUMN support_escalations.ai_response IS 'AI-suggested response for the human to review/edit';
COMMENT ON COLUMN support_escalations.product_title IS 'Title of the product from the order';
COMMENT ON COLUMN support_escalations.product_sku IS 'SKU of the product';
COMMENT ON COLUMN support_escalations.product_price IS 'Price of the product';
COMMENT ON COLUMN support_escalations.envio_status IS 'Shipping status (delivered, shipped, pending, etc)';
COMMENT ON COLUMN support_escalations.envio_fecha_entrega IS 'Date when the order was delivered';
COMMENT ON COLUMN support_escalations.envio_dias_desde_entrega IS 'Days since delivery';
COMMENT ON COLUMN support_escalations.ml_response_sent IS 'Whether the response was sent to MercadoLibre';
COMMENT ON COLUMN support_escalations.ml_response_sent_at IS 'Timestamp when response was sent to ML';
COMMENT ON COLUMN support_escalations.resumen_caso IS 'AI-generated summary of the case';

-- Create index on is_urgent for quick filtering
CREATE INDEX IF NOT EXISTS idx_escalations_urgent ON support_escalations(is_urgent) WHERE is_urgent = TRUE;

-- Create index on ml_response_sent for tracking
CREATE INDEX IF NOT EXISTS idx_escalations_ml_sent ON support_escalations(ml_response_sent) WHERE ml_response_sent = FALSE;
