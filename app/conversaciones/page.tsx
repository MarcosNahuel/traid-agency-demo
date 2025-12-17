import { createClient } from '@/lib/supabase/server'
import { ConversationPanel } from '../components/ConversationPanel'

export default async function ConversacionesPage() {
  const supabase = await createClient()

  // Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      *,
      buyer:buyers(*),
      messages(*)
    `)
    .order('last_message_at', { ascending: false })
    .limit(50)

  // Fetch stats
  const { count: pendingCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: inProgressCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')

  const { count: resolvedCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')

  const stats = {
    pending: pendingCount || 0,
    inProgress: inProgressCount || 0,
    resolved: resolvedCount || 0,
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Conversaciones</h1>
            <p className="text-sm text-gray-500">Gestiona las consultas de tus compradores</p>
          </div>
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Volver al inicio
          </a>
        </div>
      </header>

      <ConversationPanel
        initialConversations={conversations || []}
        stats={stats}
      />
    </div>
  )
}
