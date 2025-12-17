'use client'

import { Clock, Bot, CheckCircle, Timer } from 'lucide-react'

interface StatsBarProps {
  stats: {
    pending: number
    inProgress: number
    resolved: number
  }
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-2 text-red-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Pendientes:</span>
          <span>{stats.pending}</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-600">
          <Bot className="w-4 h-4" />
          <span className="font-medium">En progreso:</span>
          <span>{stats.inProgress}</span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Resueltos:</span>
          <span>{stats.resolved}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Timer className="w-4 h-4" />
          <span className="font-medium">Tiempo prom:</span>
          <span>2.3m</span>
        </div>
      </div>
    </div>
  )
}
