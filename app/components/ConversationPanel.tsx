'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ConversationList } from './ConversationList'
import { ChatPanel } from './ChatPanel'
import { StatsBar } from './StatsBar'
import type { Conversation, Message } from '@/types'

interface ConversationPanelProps {
  initialConversations: Conversation[]
  stats: {
    pending: number
    inProgress: number
    resolved: number
  }
}

export function ConversationPanel({ initialConversations, stats: initialStats }: ConversationPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [stats, setStats] = useState(initialStats)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient()

    // Subscribe to conversation changes
    const conversationSubscription = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Fetch the full conversation with buyer data
            const { data } = await supabase
              .from('conversations')
              .select(`*, buyer:buyers(*), messages(*)`)
              .eq('id', payload.new.id)
              .single()

            if (data) {
              setConversations((prev) => {
                const exists = prev.find((c) => c.id === data.id)
                if (exists) {
                  return prev.map((c) => (c.id === data.id ? data : c))
                }
                return [data, ...prev]
              })

              // Update selected if it's the same
              if (selectedConversation?.id === data.id) {
                setSelectedConversation(data)
              }
            }
          }
        }
      )
      .subscribe()

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new as Message

          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === newMessage.conversation_id) {
                return {
                  ...conv,
                  messages: [...(conv.messages || []), newMessage],
                  last_message_at: newMessage.sent_at,
                }
              }
              return conv
            })
          )

          // Update selected conversation messages
          if (selectedConversation?.id === newMessage.conversation_id) {
            setSelectedConversation((prev) =>
              prev
                ? {
                    ...prev,
                    messages: [...(prev.messages || []), newMessage],
                  }
                : null
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(conversationSubscription)
      supabase.removeChannel(messageSubscription)
    }
  }, [selectedConversation?.id])

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'all') return true
    return conv.status === filter
  })

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedConversation?.id}
            onSelect={setSelectedConversation}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Chat Panel */}
        <div className="flex-1 bg-gray-50">
          {selectedConversation ? (
            <ChatPanel
              conversation={selectedConversation}
              onUpdate={(updated) => {
                setSelectedConversation(updated)
                setConversations((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                )
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg">Selecciona una conversacion</p>
                <p className="text-sm mt-1">para ver los mensajes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar stats={stats} />
    </div>
  )
}
