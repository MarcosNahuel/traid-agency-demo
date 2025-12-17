import { createClient } from '@/lib/supabase/server'
import { SupportPanel } from '../components/SupportPanel'

export default async function SoportePage() {
  const supabase = await createClient()

  // Fetch escalations from support_escalations table (real production data)
  const { data: escalations } = await supabase
    .from('support_escalations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch stats
  const { count: pendingCount } = await supabase
    .from('support_escalations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: inProgressCount } = await supabase
    .from('support_escalations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')

  const { count: resolvedCount } = await supabase
    .from('support_escalations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')

  const { count: dismissedCount } = await supabase
    .from('support_escalations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'dismissed')

  const stats = {
    pending: pendingCount || 0,
    inProgress: inProgressCount || 0,
    resolved: resolvedCount || 0,
    dismissed: dismissedCount || 0,
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Panel de Soporte</h1>
            <p className="text-sm text-gray-500">Gestiona los casos escalados por el agente de IA</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/conversaciones"
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Conversaciones
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

      <SupportPanel
        initialEscalations={escalations || []}
        stats={stats}
      />
    </div>
  )
}
