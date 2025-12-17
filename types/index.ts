export interface Buyer {
  id: number
  nickname: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  buyer_id: number
  status: string
  total_amount: number
  shipping_status: string | null
  shipping_id: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  meli_message_id: string | null
  direction: 'inbound' | 'outbound'
  sender_type: 'buyer' | 'seller' | 'ai'
  content: string
  responder_type: 'ai' | 'human' | null
  sent_at: string
  created_at: string
}

export interface Conversation {
  id: string
  pack_id: number
  buyer_id: number
  status: 'pending' | 'in_progress' | 'resolved'
  case_type: string | null
  assigned_to: string | null
  first_message_at: string
  last_message_at: string
  created_at: string
  updated_at: string
  buyer?: Buyer
  messages?: Message[]
}

export interface Escalation {
  id: string
  buyer_id: string | null
  buyer_nickname: string | null
  buyer_name: string | null
  pack_id: string | null
  order_id: string | null
  message_original: string | null
  original_message: string | null
  reason: string
  case_type: string | null
  source: 'postventa' | 'preventa'
  status: 'pending' | 'in_progress' | 'resolved' | 'dismissed'
  priority: number
  is_urgent: boolean
  assigned_to: string | null
  human_response: string | null
  ai_response: string | null
  resolved_at: string | null
  resolution_notes: string | null
  n8n_execution_id: string | null
  workflow_id: string | null
  created_at: string
  updated_at: string
  // Product info
  product_title: string | null
  product_sku: string | null
  product_price: number | null
  // Shipping info
  envio_status: string | null
  envio_fecha_entrega: string | null
  envio_dias_desde_entrega: number | null
  // ML response tracking
  ml_response_sent: boolean
  ml_response_sent_at: string | null
  // Summary
  resumen_caso: string | null
}

export interface AgentInteraction {
  id: string
  buyer_id: string | null
  buyer_nickname: string | null
  buyer_name: string | null
  pack_id: string | null
  order_id: string | null
  message_original: string
  ai_response: string | null
  case_type: string | null
  was_escalated: boolean
  escalation_reason: string | null
  source: 'postventa' | 'preventa'
  was_sent_to_ml: boolean
  ml_response_status: string | null
  n8n_execution_id: string | null
  workflow_id: string | null
  created_at: string
}

export interface PreventaQuery {
  id: string
  question_id: string | null
  item_id: string | null
  buyer_id: string | null
  buyer_nickname: string | null
  question_text: string
  ai_response: string | null
  status: 'respondida_por_ia' | 'no_encontrada' | 'escalada' | 'pending'
  was_answered: boolean
  product_title: string | null
  product_sku: string | null
  product_price: number | null
  n8n_execution_id: string | null
  workflow_id: string | null
  question_date: string | null
  answered_at: string | null
  created_at: string
}
