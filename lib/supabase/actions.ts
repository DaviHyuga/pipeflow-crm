'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(
  email: string,
  password: string,
): Promise<{ error: string } | never> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signup(
  email: string,
  password: string,
  name: string,
): Promise<{ error: string; needsConfirmation?: never } | { needsConfirmation: true; error?: never } | never> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
  if (error) return { error: error.message }
  // Email confirmation required — session not created yet
  if (!data.session) return { needsConfirmation: true }
  redirect('/create-workspace')
}

export async function logout(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(email: string): Promise<{ error: string } | null> {
  const supabase = await createClient()
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) return { error: error.message }
  return null
}
