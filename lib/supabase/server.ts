import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://tu-proyecto.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL
    ? 'https://zaqpiuwacinvebfttygm.supabase.co'
    : process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'tu_anon_key_aqui' || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcXBpdXdhY2ludmViZnR0eWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTczMDYsImV4cCI6MjA2MTk3MzMwNn0.RFqwSfGOapP8hMjpUNSQMMf8tNcDEfjsj2oyJwv6GM0'
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
