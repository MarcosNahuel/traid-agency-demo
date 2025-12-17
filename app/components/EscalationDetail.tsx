'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Escalation } from '@/types'

interface EscalationDetailProps {
  escalation: Escalation
  onUpdate: (escalation: Escalation) => void
}

interface ConversationMessage {
  id: string
  from: 'buyer' | 'seller'
  text: string
  date: string
  read: boolean
}

interface ConversationData {
  messages: ConversationMessage[]
  product: {
    id: string
    title: string
    sku: string | null
    price: number
    quantity: number
    thumbnail: string | null
  } | null
  shipping: {
    status: string
    delivered_at: string | null
    days_since_delivery: number | null
  } | null
  buyer: {
    id: number
    nickname: string
    name: string
  } | null
  order: {
    id: number
    total: number
    date: string
  } | null
}

export function EscalationDetail({ escalation, onUpdate }: EscalationDetailProps) {
  const [response, setResponse] = useState(escalation.human_response || '')
  const [notes, setNotes] = useState(escalation.resolution_notes || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingToML, setIsSendingToML] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Conversation data from API
  const [conversationData, setConversationData] = useState<ConversationData | null>(null)
  const [loadingConversation, setLoadingConversation] = useState(false)

  // Fetch conversation data when escalation changes
  useEffect(() => {
    const fetchConversation = async () => {
      if (!escalation.pack_id && !escalation.order_id) return

      setLoadingConversation(true)
      try {
        const params = new URLSearchParams()
        if (escalation.pack_id) params.set('packId', escalation.pack_id)
        if (escalation.order_id) params.set('orderId', escalation.order_id)

        const res = await fetch(`/api/support/get-conversation?${params}`)
        if (res.ok) {
          const data = await res.json()
          setConversationData(data)
        }
      } catch (err) {
        console.error('Error fetching conversation:', err)
      }
      setLoadingConversation(false)
    }

    fetchConversation()
  }, [escalation.id, escalation.pack_id, escalation.order_id])

  const handleStatusChange = async (newStatus: Escalation['status']) => {
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    const supabase = createClient()

    const updateData: Partial<Escalation> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    }

    if (newStatus === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
      updateData.human_response = response || null
      updateData.resolution_notes = notes || null
    }

    const { data, error: updateError } = await supabase
      .from('support_escalations')
      .update(updateData)
      .eq('id', escalation.id)
      .select()
      .single()

    if (updateError) {
      setError('Error al actualizar el caso')
      console.error('Update error:', updateError)
    } else if (data) {
      onUpdate(data as Escalation)
      setSuccessMessage(newStatus === 'in_progress' ? 'Caso tomado' : 'Estado actualizado')
      setTimeout(() => setSuccessMessage(null), 3000)
    }

    setIsSubmitting(false)
  }

  const handleSaveResponse = async () => {
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    const supabase = createClient()

    const { data, error: updateError } = await supabase
      .from('support_escalations')
      .update({
        human_response: response,
        resolution_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', escalation.id)
      .select()
      .single()

    if (updateError) {
      setError('Error al guardar la respuesta')
      console.error('Save error:', updateError)
    } else if (data) {
      onUpdate(data as Escalation)
      setSuccessMessage('Borrador guardado')
      setTimeout(() => setSuccessMessage(null), 3000)
    }

    setIsSubmitting(false)
  }

  const handleSendToML = async () => {
    if (!response.trim()) {
      setError('Escribe una respuesta antes de enviar')
      return
    }

    setIsSendingToML(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/support/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          escalationId: escalation.id,
          message: response,
          packId: escalation.pack_id,
          buyerId: escalation.buyer_id,
        }),
      })

      const data = await res.json()

      if (data.success) {
        if (data.mlSent) {
          setSuccessMessage('Respuesta enviada a MercadoLibre')
        } else {
          setSuccessMessage(data.message || 'Respuesta guardada (Demo)')
        }

        // Refresh escalation data
        const supabase = createClient()
        const { data: updated } = await supabase
          .from('support_escalations')
          .select()
          .eq('id', escalation.id)
          .single()

        if (updated) {
          onUpdate(updated as Escalation)
        }

        // Refresh conversation
        if (escalation.pack_id) {
          const convRes = await fetch(`/api/support/get-conversation?packId=${escalation.pack_id}`)
          if (convRes.ok) {
            const convData = await convRes.json()
            setConversationData(convData)
          }
        }
      } else {
        setError(data.error || 'Error al enviar')
      }
    } catch (err) {
      setError('Error de conexion')
      console.error('Send to ML error:', err)
    }

    setIsSendingToML(false)
  }

  const handleAIResponse = async (mode: 'generate' | 'improve') => {
    if (mode === 'improve' && !response.trim()) {
      setError('Primero escribe una respuesta para mejorar')
      return
    }

    if (mode === 'generate') {
      setIsGenerating(true)
    } else {
      setIsImproving(true)
    }
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/support/improve-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalMessage: escalation.original_message || escalation.reason,
          currentResponse: response,
          caseType: escalation.case_type,
          buyerName: escalation.buyer_name || escalation.buyer_nickname,
          productTitle: escalation.product_title,
          mode,
        }),
      })

      const data = await res.json()

      if (data.success && data.improvedResponse) {
        setResponse(data.improvedResponse)
        setSuccessMessage(
          mode === 'generate'
            ? 'Respuesta generada con IA'
            : 'Redaccion mejorada con IA'
        )
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(data.error || 'Error al procesar con IA')
      }
    } catch (err) {
      setError('Error de conexion con IA')
      console.error('AI response error:', err)
    }

    if (mode === 'generate') {
      setIsGenerating(false)
    } else {
      setIsImproving(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeSinceCreation = () => {
    const created = new Date(escalation.created_at)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`
    if (diffHours > 0) return `${diffHours}h`
    return 'Reciente'
  }

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50'
      case 'shipped': return 'text-blue-600 bg-blue-50'
      case 'ready_to_ship': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getShippingStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado'
      case 'shipped': return 'En camino'
      case 'ready_to_ship': return 'Listo para enviar'
      case 'pending': return 'Pendiente'
      default: return status
    }
  }

  // Use data from API or fallback to escalation data
  const product = conversationData?.product || (escalation.product_title ? {
    id: '',
    title: escalation.product_title,
    sku: escalation.product_sku,
    price: escalation.product_price || 0,
    quantity: 1,
    thumbnail: null
  } : null)

  const shipping = conversationData?.shipping || (escalation.envio_status ? {
    status: escalation.envio_status,
    delivered_at: escalation.envio_fecha_entrega,
    days_since_delivery: escalation.envio_dias_desde_entrega
  } : null)

  const buyer = conversationData?.buyer || {
    id: parseInt(escalation.buyer_id || '0'),
    nickname: escalation.buyer_nickname || '',
    name: escalation.buyer_name || ''
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Caso #{escalation.id.slice(0, 8)}
              </h2>
              {escalation.is_urgent && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full animate-pulse">
                  URGENTE
                </span>
              )}
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {getTimeSinceCreation()}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Creado: {formatDate(escalation.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {escalation.status === 'pending' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Tomando...' : 'Tomar caso'}
              </button>
            )}
            {escalation.status === 'in_progress' && (
              <>
                <button
                  onClick={handleSendToML}
                  disabled={isSendingToML || !response.trim() || !escalation.pack_id}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                  title={!escalation.pack_id ? 'Sin pack_id para enviar a ML' : ''}
                >
                  {isSendingToML ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Enviar a ML
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStatusChange('resolved')}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Marcar resuelto
                </button>
                <button
                  onClick={() => handleStatusChange('dismissed')}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  Descartar
                </button>
              </>
            )}
            {(escalation.status === 'resolved' || escalation.status === 'dismissed') && (
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Reabrir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* RESUMEN DEL CASO - Prominente */}
        {escalation.resumen_caso && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resumen del Caso
            </h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-white p-4 rounded-lg border border-blue-100">
              {escalation.resumen_caso}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Context Info */}
          <div className="space-y-4">
            {/* Product Info Card */}
            {(product || loadingConversation) && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Producto
                </h3>
                {loadingConversation ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : product ? (
                  <div className="flex gap-4">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        {product.sku && (
                          <p>SKU: <span className="font-mono text-xs bg-gray-100 px-1 rounded">{product.sku}</span></p>
                        )}
                        <p>Precio: <span className="font-medium text-gray-700">${product.price.toLocaleString()}</span></p>
                        {product.quantity > 1 && <p>Cantidad: {product.quantity}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Sin informacion de producto</p>
                )}
              </div>
            )}

            {/* Shipping Info Card */}
            {(shipping || loadingConversation) && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l-3-3m0 0l3-3m-3 3h12m-3 3v1a3 3 0 003 3h6a3 3 0 003-3V9a3 3 0 00-3-3h-6a3 3 0 00-3 3v1" />
                  </svg>
                  Envio
                </h3>
                {loadingConversation ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : shipping ? (
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getShippingStatusColor(shipping.status)}`}>
                      {getShippingStatusText(shipping.status)}
                    </span>
                    {shipping.delivered_at && (
                      <span className="text-sm text-gray-500">
                        {formatDate(shipping.delivered_at)}
                      </span>
                    )}
                    {shipping.days_since_delivery !== null && (
                      <span className="text-sm text-gray-500">
                        ({shipping.days_since_delivery}d desde entrega)
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Sin informacion de envio</p>
                )}
              </div>
            )}

            {/* Buyer Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Comprador
              </h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-500">Nickname:</span> <span className="font-medium">{buyer.nickname || '-'}</span></p>
                {buyer.name && <p><span className="text-gray-500">Nombre:</span> <span className="font-medium">{buyer.name}</span></p>}
                <p><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{buyer.id || escalation.buyer_id || '-'}</span></p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 text-sm space-y-1">
                <p><span className="text-gray-500">Pack ID:</span> <span className="font-mono text-xs">{escalation.pack_id || '-'}</span></p>
                <p><span className="text-gray-500">Order ID:</span> <span className="font-mono text-xs">{escalation.order_id || '-'}</span></p>
              </div>
            </div>

            {/* Escalation Reason Card */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Razon de escalacion (IA)
              </h3>
              <p className="text-sm text-yellow-700 whitespace-pre-wrap">{escalation.reason}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {escalation.case_type && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                    {escalation.case_type}
                  </span>
                )}
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  Prioridad: {escalation.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${escalation.source === 'postventa' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {escalation.source}
                </span>
              </div>
            </div>

            {/* AI Response Suggestion */}
            {escalation.ai_response && (
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Respuesta sugerida por IA
                </h3>
                <p className="text-sm text-purple-700 whitespace-pre-wrap bg-white p-3 rounded border border-purple-100">
                  {escalation.ai_response}
                </p>
                <button
                  onClick={() => setResponse(escalation.ai_response || '')}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
                  disabled={escalation.status === 'resolved' || escalation.status === 'dismissed'}
                >
                  Usar esta respuesta
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Conversation & Response */}
          <div className="space-y-4">
            {/* Conversation Thread */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Conversacion
              </h3>

              {loadingConversation ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                  <div className="h-16 bg-blue-50 rounded-lg ml-8"></div>
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>
              ) : conversationData?.messages && conversationData.messages.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversationData.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === 'seller' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          msg.from === 'seller'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.from === 'seller' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {formatShortDate(msg.date)}
                          {msg.from === 'seller' && msg.read && ' ✓✓'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : escalation.original_message ? (
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{escalation.original_message}</p>
                  <p className="text-xs text-gray-400 mt-1">Mensaje original</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-4">
                  {escalation.pack_id ? 'No se pudo cargar la conversacion' : 'Sin pack_id - conversacion no disponible'}
                </p>
              )}
            </div>

            {/* Response Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Tu respuesta</h3>
                {escalation.status !== 'resolved' && escalation.status !== 'dismissed' && (
                  <div className="flex items-center gap-2">
                    {/* Boton Generar respuesta completa */}
                    <button
                      onClick={() => handleAIResponse('generate')}
                      disabled={isGenerating || isImproving}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 disabled:opacity-50 transition-colors border border-yellow-200"
                      title="Generar respuesta completa con IA"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>Generar</span>
                        </>
                      )}
                    </button>
                    {/* Boton Mejorar redaccion */}
                    <button
                      onClick={() => handleAIResponse('improve')}
                      disabled={isGenerating || isImproving || !response.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors border border-purple-200"
                      title="Mejorar redaccion sin cambiar el sentido"
                    >
                      {isImproving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Mejorando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Mejorar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Escribe tu respuesta al comprador..."
                className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={escalation.status === 'resolved' || escalation.status === 'dismissed'}
              />
              {escalation.pack_id && escalation.status === 'in_progress' && (
                <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Esta respuesta se guardara localmente (Demo)
                </p>
              )}
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notas internas</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas internas sobre la resolucion..."
                className="w-full h-20 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={escalation.status === 'resolved' || escalation.status === 'dismissed'}
              />
            </div>

            {/* Save Button */}
            {escalation.status === 'in_progress' && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveResponse}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  Guardar borrador
                </button>
              </div>
            )}

            {/* Resolution Info */}
            {escalation.status === 'resolved' && (
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Caso resuelto
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Resuelto:</strong> {formatDate(escalation.resolved_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer hover:text-gray-600">Metadata</summary>
            <div className="mt-2 space-y-1 pl-4">
              <p>Workflow: {escalation.workflow_id || '-'}</p>
              <p>Execution: {escalation.n8n_execution_id || '-'}</p>
              <p>Actualizado: {formatDate(escalation.updated_at)}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
