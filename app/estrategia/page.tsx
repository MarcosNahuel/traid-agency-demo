'use client'

import Link from 'next/link'
import StrategyCanvas from '../components/StrategyCanvas'

export default function EstrategiaPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Inicio</span>
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">🎨</span>
                Estrategia IA - Prompt Injection
              </h1>
              <p className="text-gray-400 text-sm">
                Configura los prompts y comportamiento de los agentes IA
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/soporte"
              className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-500 transition-colors"
            >
              Soporte
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Strategy Canvas */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <StrategyCanvas />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Estrategia IA - MarIA S.A. Demo | Prompts sincronizados con n8n via /api/system-prompt
        </div>
      </footer>
    </div>
  )
}
