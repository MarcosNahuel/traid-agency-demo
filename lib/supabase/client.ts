import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://tu-proyecto.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL
    ? 'https://zaqpiuwacinvebfttygm.supabase.co'
    : process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'tu_anon_key_aqui' || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcXBpdXdhY2ludmViZnR0eWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTczMDYsImV4cCI6MjA2MTk3MzMwNn0.RFqwSfGOapP8hMjpUNSQMMf8tNcDEfjsj2oyJwv6GM0'
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient(url, key)
}

