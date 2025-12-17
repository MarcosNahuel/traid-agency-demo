'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AgentInteraction } from '@/types'

interface InteractionPanelProps {
  initialInteractions: AgentInteraction[]
  stats: {
    total: number
    escalated: number
    sentToML: number
    postventa: number
    preventa: number
  }
}

export function InteractionPanel({ initialInteractions, stats: initialStats }: InteractionPanelProps) {
  const [interactions, setInteractions] = useState<AgentInteraction[]>(initialInteractions)
  const [selectedInteraction, setSelectedInteraction] = useState<AgentInteraction | null>(null)
  const [stats, setStats] = useState(initialStats)
  const [filter, setFilter] = useState<'all' | 'postventa' | 'preventa' | 'escalated'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient()

    const subscription = supabase
      .channel('agent_interactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_interactions' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newInteraction = payload.new as AgentInteraction
            setInteractions((prev) => [newInteraction, ...prev])
            setStats((prev) => ({
              ...prev,
              total: prev.total + 1,
              [newInteraction.source]: prev[newInteraction.source as keyof typeof prev] + 1,
              ...(newInteraction.was_escalated ? { escalated: prev.escalated + 1 } : {}),
              ...(newInteraction.was_sent_to_ml ? { sentToML: prev.sentToML + 1 } : {}),
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const filteredInteractions = interactions.filter((interaction) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'escalated' && interaction.was_escalated) ||
      interaction.source === filter

    const matchesSearch =
      !searchTerm ||
      interaction.buyer_nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.message_original?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.case_type?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `hace ${diffMins}m`
    if (diffHours < 24) return `hace ${diffHours}h`
    if (diffDays < 7) return `hace ${diffDays}d`
    return date.toLocaleDateString('es-AR')
  }

  const getCaseTypeColor = (caseType: string | null) => {
    const colors: Record<string, string> = {
      'CONSULTA_ENVIO': 'bg-blue-100 text-blue-700',
      'FACTURACION': 'bg-purple-100 text-purple-700',
      'GARANTIA': 'bg-orange-100 text-orange-700',
      'DEVOLUCION': 'bg-red-100 text-red-700',
      'COMPATIBILIDAD': 'bg-green-100 text-green-700',
    }
    return colors[caseType || ''] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.total}</span> Total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.sentToML}</span> Enviadas a ML
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.escalated}</span> Escaladas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.postventa}</span> Postventa
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.preventa}</span> Preventa
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Interaction List */}
        <div className="w-[450px] border-r border-gray-200 bg-white flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <input
              type="text"
              placeholder="Buscar por comprador, mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-2 flex-wrap">
              {(['all', 'postventa', 'preventa', 'escalated'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'Todas' : f === 'escalated' ? 'Escaladas' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredInteractions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No hay interacciones</p>
              </div>
            ) : (
              filteredInteractions.map((interaction) => (
                <button
                  key={interaction.id}
                  onClick={() => setSelectedInteraction(interaction)}
                  className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                    selectedInteraction?.id === interaction.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {interaction.buyer_nickname || interaction.buyer_id}
                        </span>
                        {interaction.was_escalated && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                            Escalado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {interaction.message_original}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getCaseTypeColor(interaction.case_type)}`}>
                          {interaction.case_type || 'Sin clasificar'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          interaction.source === 'postventa'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-cyan-100 text-cyan-700'
                        }`}>
                          {interaction.source}
                        </span>
                        {interaction.was_sent_to_ml && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Enviado ML
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(interaction.created_at)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedInteraction ? (
            <div className="p-6">
              {/* Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedInteraction.buyer_nickname || selectedInteraction.buyer_id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedInteraction.created_at).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedInteraction.was_escalated && (
                      <span className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
                        Escalado
                      </span>
                    )}
                    {selectedInteraction.was_sent_to_ml && (
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                        Enviado a ML
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos de la orden</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Pack ID:</span>
                    <span className="ml-2 font-medium">{selectedInteraction.pack_id || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <span className="ml-2 font-medium">{selectedInteraction.order_id || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Buyer ID:</span>
                    <span className="ml-2 font-medium">{selectedInteraction.buyer_id || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fuente:</span>
                    <span className={`ml-2 font-medium ${
                      selectedInteraction.source === 'postventa' ? 'text-purple-600' : 'text-cyan-600'
                    }`}>
                      {selectedInteraction.source}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tipo de caso:</span>
                    <span className="ml-2 font-medium">{selectedInteraction.case_type || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Workflow:</span>
                    <span className="ml-2 font-medium text-xs">{selectedInteraction.workflow_id || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mensaje del comprador</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {selectedInteraction.message_original}
                  </p>
                </div>
              </div>

              {/* AI Response */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Respuesta de Tomi (IA)</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {selectedInteraction.ai_response || 'Sin respuesta generada'}
                  </p>
                </div>
              </div>

              {/* Escalation Info */}
              {selectedInteraction.was_escalated && selectedInteraction.escalation_reason && (
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-4 mb-4">
                  <h3 className="text-sm font-semibold text-orange-800 mb-2">Razon de escalacion</h3>
                  <p className="text-sm text-orange-700 whitespace-pre-wrap">
                    {selectedInteraction.escalation_reason}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Metadata</h4>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>ID: {selectedInteraction.id}</p>
                  <p>Workflow: {selectedInteraction.workflow_id || '-'}</p>
                  <p>Execution: {selectedInteraction.n8n_execution_id || '-'}</p>
                  <p>ML Status: {selectedInteraction.ml_response_status || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-lg">Selecciona una interaccion</p>
                <p className="text-sm mt-1">para ver el detalle completo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
