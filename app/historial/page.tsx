import { createClient } from '@/lib/supabase/server'
import { InteractionPanel } from '../components/InteractionPanel'

export default async function HistorialPage() {
  const supabase = await createClient()

  // Fetch agent interactions
  const { data: interactions } = await supabase
    .from('agent_interactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch stats
  const { count: totalCount } = await supabase
    .from('agent_interactions')
    .select('*', { count: 'exact', head: true })

  const { count: escalatedCount } = await supabase
    .from('agent_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('was_escalated', true)

  const { count: sentToMLCount } = await supabase
    .from('agent_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('was_sent_to_ml', true)

  const { count: postventaCount } = await supabase
    .from('agent_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'postventa')

  const { count: preventaCount } = await supabase
    .from('agent_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'preventa')

  const stats = {
    total: totalCount || 0,
    escalated: escalatedCount || 0,
    sentToML: sentToMLCount || 0,
    postventa: postventaCount || 0,
    preventa: preventaCount || 0,
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Historial de Interacciones IA</h1>
            <p className="text-sm text-gray-500">Todas las respuestas del agente Tomi</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/soporte"
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Panel de Soporte
            </a>
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </header>

      <InteractionPanel
        initialInteractions={interactions || []}
        stats={stats}
      />
    </div>
  )
}
