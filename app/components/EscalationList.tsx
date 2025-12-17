'use client'

import type { Escalation } from '@/types'

interface EscalationListProps {
  escalations: Escalation[]
  selectedId?: string
  onSelect: (escalation: Escalation) => void
  filter: 'all' | 'pending' | 'in_progress' | 'resolved' | 'dismissed'
  onFilterChange: (filter: 'all' | 'pending' | 'in_progress' | 'resolved' | 'dismissed') => void
}

const filterOptions = [
  { value: 'pending', label: 'Pendientes', color: 'yellow' },
  { value: 'in_progress', label: 'En progreso', color: 'blue' },
  { value: 'resolved', label: 'Resueltos', color: 'green' },
  { value: 'dismissed', label: 'Descartados', color: 'gray' },
  { value: 'all', label: 'Todos', color: 'purple' },
] as const

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  dismissed: 'bg-gray-100 text-gray-700 border-gray-200',
}

const priorityColors = {
  1: 'bg-red-500',
  2: 'bg-red-400',
  3: 'bg-orange-400',
  4: 'bg-yellow-400',
  5: 'bg-gray-300',
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

export function EscalationList({
  escalations,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
}: EscalationListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Filter Tabs */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filter === option.value
                  ? `bg-${option.color}-100 text-${option.color}-700 border border-${option.color}-200`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Escalation List */}
      <div className="flex-1 overflow-y-auto">
        {escalations.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <svg
              className="mx-auto h-10 w-10 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">No hay casos en esta categoria</p>
          </div>
        ) : (
          escalations.map((escalation) => (
            <button
              key={escalation.id}
              onClick={() => onSelect(escalation)}
              className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedId === escalation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Priority Indicator */}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      priorityColors[escalation.priority as keyof typeof priorityColors] ||
                      priorityColors[5]
                    }`}
                    title={`Prioridad ${escalation.priority}`}
                  />
                  <span className="font-medium text-gray-900 text-sm">
                    {escalation.buyer_nickname || escalation.buyer_id || 'Sin identificar'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(escalation.created_at)}
                </span>
              </div>

              {/* Product & Message Preview */}
              {escalation.product_title && (
                <p className="text-xs text-gray-500 truncate mb-1">
                  <span className="font-medium">{escalation.product_title}</span>
                </p>
              )}

              {/* Original Message */}
              <p className="text-sm text-gray-700 line-clamp-2 mb-1 bg-gray-50 p-2 rounded border-l-2 border-blue-300">
                {escalation.original_message || escalation.reason}
              </p>

              {/* Reason (IA) */}
              <p className="text-xs text-amber-700 line-clamp-1 mb-2">
                <span className="font-medium">IA:</span> {escalation.reason}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full border ${
                    statusColors[escalation.status]
                  }`}
                >
                  {escalation.status === 'pending' && 'Pendiente'}
                  {escalation.status === 'in_progress' && 'En progreso'}
                  {escalation.status === 'resolved' && 'Resuelto'}
                  {escalation.status === 'dismissed' && 'Descartado'}
                </span>

                {escalation.case_type && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                    {escalation.case_type}
                  </span>
                )}

                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    escalation.source === 'postventa'
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  {escalation.source}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
