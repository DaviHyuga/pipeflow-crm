'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import type { WorkspaceRow } from '@/src/types/supabase'

/** Cria um workspace e insere o usuário como admin. Redireciona para /dashboard.
 *
 *  Usa createServiceClient para as inserções porque a autenticação do usuário
 *  já é verificada com getUser() antes. As policies RLS de INSERT requerem
 *  que as migrations estejam aplicadas com o SUPABASE_ACCESS_TOKEN.
 */
export async function createWorkspace(
  name: string,
  slug: string,
): Promise<{ error: string } | never> {
  // Verificar autenticação com o cliente do usuário
  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  // Usar service client para bypassar RLS nas inserções do onboarding
  const supabase = await createServiceClient()

  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name, slug })
    .select()
    .single()

  if (wsError) return { error: wsError.message }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: (workspace as WorkspaceRow).id, user_id: user.id, role: 'admin' })

  if (memberError) return { error: memberError.message }

  const cookieStore = await cookies()
  cookieStore.set(WORKSPACE_COOKIE, (workspace as WorkspaceRow).id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  redirect('/dashboard')
}

/** Troca o workspace ativo via cookie. */
export async function switchWorkspace(workspaceId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(WORKSPACE_COOKIE, workspaceId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
}
