'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
  }

  // Redirect to home or login page after successful logout
  redirect('/auth/login')
}