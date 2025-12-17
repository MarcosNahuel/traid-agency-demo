'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EscalationList } from './EscalationList'
import { EscalationDetail } from './EscalationDetail'
import type { Escalation } from '@/types'

interface SupportPanelProps {
  initialEscalations: Escalation[]
  stats: {
    pending: number
    inProgress: number
    resolved: number
    dismissed: number
  }
}

export function SupportPanel({ initialEscalations, stats: initialStats }: SupportPanelProps) {
  const [escalations, setEscalations] = useState<Escalation[]>(initialEscalations)
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null)
  const [stats, setStats] = useState(initialStats)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'dismissed'>('pending')

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient()

    // Subscribe to escalation changes (support_escalations table)
    const escalationSubscription = supabase
      .channel('support_escalations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_escalations' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newEscalation = payload.new as Escalation
            setEscalations((prev) => [newEscalation, ...prev])

            // Update stats
            setStats((prev) => ({
              ...prev,
              pending: prev.pending + 1,
            }))
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Escalation
            setEscalations((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            )

            // Update selected if it's the same
            if (selectedEscalation?.id === updated.id) {
              setSelectedEscalation(updated)
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Escalation
            setEscalations((prev) => prev.filter((e) => e.id !== deleted.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(escalationSubscription)
    }
  }, [selectedEscalation?.id])

  const filteredEscalations = escalations.filter((esc) => {
    if (filter === 'all') return true
    return esc.status === filter
  })

  const handleUpdateEscalation = (updated: Escalation) => {
    setSelectedEscalation(updated)
    setEscalations((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.pending}</span> Pendientes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.inProgress}</span> En progreso
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.resolved}</span> Resueltos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{stats.dismissed}</span> Descartados
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total: {escalations.length} casos
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Escalation List */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          <EscalationList
            escalations={filteredEscalations}
            selectedId={selectedEscalation?.id}
            onSelect={setSelectedEscalation}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Detail Panel */}
        <div className="flex-1 bg-gray-50">
          {selectedEscalation ? (
            <EscalationDetail
              escalation={selectedEscalation}
              onUpdate={handleUpdateEscalation}
            />
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="text-lg">Selecciona un caso</p>
                <p className="text-sm mt-1">para ver los detalles y responder</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
