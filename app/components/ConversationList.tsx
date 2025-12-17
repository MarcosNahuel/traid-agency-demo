'use client'

import { useState } from 'react'
import { Search, Circle, Package, MessageSquare } from 'lucide-react'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { Conversation } from '@/types'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conversation: Conversation) => void
  filter: 'all' | 'pending' | 'in_progress' | 'resolved'
  onFilterChange: (filter: 'all' | 'pending' | 'in_progress' | 'resolved') => void
}

const statusColors = {
  pending: 'text-red-500',
  in_progress: 'text-yellow-500',
  resolved: 'text-green-500',
}

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
}

const caseTypeLabels: Record<string, string> = {
  CONSULTA_ENVIO: 'Envio',
  PEDIDO_FACTURA: 'Factura',
  PROBLEMA_PRODUCTO: 'Producto',
  CONSULTA_GARANTIA: 'Garantia',
  OTRO: 'Otro',
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
}: ConversationListProps) {
  const [search, setSearch] = useState('')

  const filteredConversations = conversations.filter((conv) => {
    if (!search) return true
    const buyerName = `${conv.buyer?.first_name || ''} ${conv.buyer?.last_name || ''}`.toLowerCase()
    const packId = conv.pack_id?.toString() || ''
    return buyerName.includes(search.toLowerCase()) || packId.includes(search)
  })

  const getLastMessage = (conv: Conversation) => {
    const messages = conv.messages || []
    const last = messages[messages.length - 1]
    return last?.content?.substring(0, 50) + (last?.content?.length > 50 ? '...' : '') || 'Sin mensajes'
  }

  return (
    <>
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 p-2 border-b border-gray-200">
        {(['all', 'pending', 'in_progress', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              filter === f
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {f === 'all' ? 'Todas' : statusLabels[f]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay conversaciones</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={cn(
                'p-3 border-b border-gray-100 cursor-pointer transition-colors',
                selectedId === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-start gap-3">
                <Circle
                  className={cn('w-3 h-3 mt-1.5 fill-current', statusColors[conv.status])}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {conv.buyer?.first_name} {conv.buyer?.last_name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {formatRelativeTime(conv.last_message_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{getLastMessage(conv)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Package className="w-3 h-3" />
                      #{conv.pack_id}
                    </span>
                    {conv.case_type && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {caseTypeLabels[conv.case_type] || conv.case_type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
