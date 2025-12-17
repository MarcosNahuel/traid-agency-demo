'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  User,
  Bot,
  Send,
  Sparkles,
  CheckCircle,
  Package,
  Truck,
  Clock,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Conversation, Message } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ChatPanelProps {
  conversation: Conversation
  onUpdate: (conversation: Conversation) => void
}

const senderIcons = {
  buyer: User,
  seller: User,
  ai: Bot,
}

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
}

const caseTypeLabels: Record<string, string> = {
  CONSULTA_ENVIO: 'Consulta de Envio',
  PEDIDO_FACTURA: 'Pedido de Factura',
  PROBLEMA_PRODUCTO: 'Problema con Producto',
  CONSULTA_GARANTIA: 'Consulta de Garantia',
  OTRO: 'Otro',
}

export function ChatPanel({ conversation, onUpdate }: ChatPanelProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = conversation.messages || []

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    const supabase = createClient()

    const { data, error } = await supabase.from('messages').insert({
      conversation_id: conversation.id,
      direction: 'outbound',
      sender_type: 'seller',
      content: message.trim(),
      responder_type: 'human',
      sent_at: new Date().toISOString(),
    }).select().single()

    if (!error && data) {
      // Update conversation status if pending
      if (conversation.status === 'pending') {
        await supabase
          .from('conversations')
          .update({ status: 'in_progress' })
          .eq('id', conversation.id)
      }
    }

    setMessage('')
    setSending(false)
  }

  const handleGenerateAI = async () => {
    setGeneratingAI(true)
    // Simular respuesta IA
    await new Promise((r) => setTimeout(r, 1500))

    const aiResponse = generateAIResponse(conversation)
    setMessage(aiResponse)
    setGeneratingAI(false)
  }

  const handleMarkResolved = async () => {
    const supabase = createClient()
    await supabase
      .from('conversations')
      .update({ status: 'resolved' })
      .eq('id', conversation.id)

    onUpdate({ ...conversation, status: 'resolved' })
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {conversation.buyer?.first_name} {conversation.buyer?.last_name}
              </span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                conversation.status === 'pending' && 'bg-red-100 text-red-700',
                conversation.status === 'in_progress' && 'bg-yellow-100 text-yellow-700',
                conversation.status === 'resolved' && 'bg-green-100 text-green-700'
              )}>
                {statusLabels[conversation.status]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                Pack #{conversation.pack_id}
              </span>
              {conversation.case_type && (
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  {caseTypeLabels[conversation.case_type] || conversation.case_type}
                </span>
              )}
            </div>
          </div>

          {conversation.status !== 'resolved' && (
            <button
              onClick={handleMarkResolved}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar resuelto
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay mensajes aun</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={conversation.status === 'resolved'}
          />
          <button
            onClick={handleGenerateAI}
            disabled={generatingAI || conversation.status === 'resolved'}
            className="px-3 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Generar respuesta con IA"
          >
            {generatingAI ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending || conversation.status === 'resolved'}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isInbound = message.direction === 'inbound'
  const Icon = senderIcons[message.sender_type]

  return (
    <div className={cn('flex gap-2', !isInbound && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isInbound ? 'bg-gray-200' : message.responder_type === 'ai' ? 'bg-purple-100' : 'bg-blue-100'
        )}
      >
        <Icon
          className={cn(
            'w-4 h-4',
            isInbound ? 'text-gray-600' : message.responder_type === 'ai' ? 'text-purple-600' : 'text-blue-600'
          )}
        />
      </div>
      <div className={cn('max-w-[70%]', !isInbound && 'text-right')}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-600">
            {isInbound ? 'Comprador' : message.responder_type === 'ai' ? 'IA' : 'Vendedor'}
          </span>
          <span className="text-xs text-gray-400">
            {format(new Date(message.sent_at), 'HH:mm', { locale: es })}
          </span>
        </div>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl inline-block text-left',
            isInbound
              ? 'bg-white border border-gray-200 rounded-tl-sm'
              : message.responder_type === 'ai'
              ? 'bg-purple-500 text-white rounded-tr-sm'
              : 'bg-blue-600 text-white rounded-tr-sm'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  )
}

function generateAIResponse(conversation: Conversation): string {
  const buyerName = conversation.buyer?.first_name || 'cliente'

  switch (conversation.case_type) {
    case 'CONSULTA_ENVIO':
      return `Hola ${buyerName}! Tu pedido #${conversation.pack_id} esta en camino. Segun el tracking de Mercado Envios, llegara en los proximos dias. Podes seguir el estado desde tu compra en MercadoLibre. Hay algo mas en lo que pueda ayudarte?`

    case 'PEDIDO_FACTURA':
      return `Hola ${buyerName}! Con gusto te envio la factura. Por favor, indicame los siguientes datos:\n- Razon social o nombre completo\n- CUIT/CUIL o DNI\n- Direccion fiscal\n\nUna vez que los tenga, te envio la factura por este medio.`

    case 'PROBLEMA_PRODUCTO':
      return `Hola ${buyerName}! Lamento que hayas tenido un inconveniente con el producto. Podrias contarme mas detalles sobre el problema? Si es posible, enviame fotos para poder ayudarte mejor y encontrar una solucion rapida.`

    case 'CONSULTA_GARANTIA':
      return `Hola ${buyerName}! El producto cuenta con garantia de 6 meses contra defectos de fabricacion. Si tenes algun problema, contactame y lo resolvemos. En que puedo ayudarte?`

    default:
      return `Hola ${buyerName}! Gracias por tu mensaje. En que puedo ayudarte?`
  }
}
