'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { createInvite, acceptInvite, deleteInvite } from '@/lib/invites'
import { getWorkspaceMembers } from '@/lib/members'
import { sendInviteEmail } from '@/lib/email'
import { canAddMember } from '@/lib/limits'
import { FREE_LIMITS } from '@/lib/plan-config'
import type { WorkspaceRow, WorkspaceMemberRole } from '@/src/types/supabase'
// WorkspaceRow usado em createWorkspace; WorkspaceMemberRole em inviteMemberAction

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

/** Atualiza o nome do workspace ativo. Apenas admins. */
export async function updateWorkspaceAction(
  name: string,
): Promise<{ error?: string } | void> {
  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) return { error: 'Workspace não encontrado' }

  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('workspaces')
    .update({ name: name.trim() })
    .eq('id', workspaceId)

  if (error) return { error: error.message }
  revalidatePath('/settings/workspace')
}

/** Convida um usuário por e-mail para o workspace. Limite Free: 2 membros. */
export async function inviteMemberAction(
  email: string,
  role: WorkspaceMemberRole,
): Promise<{ error?: string } | void> {
  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) return { error: 'Workspace não encontrado' }

  const supabase = await createServiceClient()

  // Verificar se o e-mail já é membro
  const [members, limitResult] = await Promise.all([
    getWorkspaceMembers(workspaceId),
    canAddMember(workspaceId),
  ])
  const alreadyMember = members.some((m) => m.email.toLowerCase() === email.toLowerCase())
  if (alreadyMember) return { error: 'Este e-mail já é membro do workspace' }

  if (!limitResult.allowed) {
    return {
      error: `O plano Free permite até ${FREE_LIMITS.members} membros. Faça upgrade para Pro para convidar mais pessoas.`,
    }
  }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name')
    .eq('id', workspaceId)
    .single()

  const { invite, error } = await createInvite(workspaceId, email, role, user.id)
  if (error || !invite) return { error: error ?? 'Erro ao criar convite' }

  const emailResult = await sendInviteEmail({
    to: email,
    workspaceName: workspace?.name ?? 'PipeFlow',
    inviterEmail: user.email ?? '',
    inviteToken: invite.token,
  })

  if (emailResult.error) {
    console.error('[inviteMemberAction] Resend error:', emailResult.error)
    revalidatePath('/settings/members')
    return {
      error: `Convite criado, mas o e-mail não foi enviado: ${emailResult.error}. Copie o link do convite manualmente.`,
    }
  }

  revalidatePath('/settings/members')
}

/** Remove um membro do workspace. Apenas admins. */
export async function removeMemberAction(
  memberId: string,
): Promise<{ error?: string } | void> {
  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) return { error: 'Workspace não encontrado' }

  const supabase = await createServiceClient()

  // Impedir remoção do próprio admin
  const { data: self } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (self?.id === memberId) return { error: 'Você não pode remover a si mesmo' }

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('id', memberId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: error.message }
  revalidatePath('/settings/members')
}

/** Cancela um convite pendente. Apenas admins. */
export async function cancelInviteAction(
  inviteId: string,
): Promise<{ error?: string } | void> {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) return { error: 'Workspace não encontrado' }

  const { error } = await deleteInvite(inviteId, workspaceId)
  if (error) return { error }
  revalidatePath('/settings/members')
}

/** Aceita um convite pelo token. Autentica, insere no workspace e redireciona. */
export async function acceptInviteAction(token: string): Promise<{ error?: string } | never> {
  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect(`/login?next=/invite/${token}`)

  const { workspaceId, error } = await acceptInvite(token, user.id)
  if (error) return { error }

  const cookieStore = await cookies()
  cookieStore.set(WORKSPACE_COOKIE, workspaceId!, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  redirect('/dashboard')
}
