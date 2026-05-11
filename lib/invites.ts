import { createServiceClient } from '@/lib/supabase/server'
import type { WorkspaceInviteRow, WorkspaceMemberRole } from '@/src/types/supabase'

export type PendingInvite = {
  id: string
  email: string
  role: WorkspaceMemberRole
  expires_at: string
  created_at: string
}

export async function getWorkspaceInvites(workspaceId: string): Promise<PendingInvite[]> {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from('workspace_invites')
    .select('id, email, role, expires_at, created_at')
    .eq('workspace_id', workspaceId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  return (data ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    role: r.role as WorkspaceMemberRole,
    expires_at: r.expires_at,
    created_at: r.created_at,
  }))
}

export async function createInvite(
  workspaceId: string,
  email: string,
  role: WorkspaceMemberRole,
  invitedBy: string,
): Promise<{ invite: WorkspaceInviteRow | null; error?: string }> {
  const supabase = await createServiceClient()

  // Remove convite anterior (pendente ou aceito) para liberar a constraint unique(workspace_id, email)
  await supabase
    .from('workspace_invites')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('email', email)

  const { data, error } = await supabase
    .from('workspace_invites')
    .insert({ workspace_id: workspaceId, email, role, invited_by: invitedBy })
    .select()
    .single()

  if (error) return { invite: null, error: error.message }
  return { invite: data as WorkspaceInviteRow }
}

export async function getInviteByToken(token: string): Promise<WorkspaceInviteRow | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from('workspace_invites')
    .select('*')
    .eq('token', token)
    .single()

  return data ?? null
}

export async function acceptInvite(
  token: string,
  userId: string,
): Promise<{ workspaceId?: string; error?: string }> {
  const supabase = await createServiceClient()

  const invite = await getInviteByToken(token)
  if (!invite) return { error: 'Convite não encontrado' }
  if (invite.accepted_at) return { error: 'Este convite já foi aceito' }
  if (new Date(invite.expires_at) < new Date()) return { error: 'Este convite expirou' }

  const { error: memberError } = await supabase.from('workspace_members').insert({
    workspace_id: invite.workspace_id,
    user_id: userId,
    role: invite.role,
    invited_by: invite.invited_by,
  })

  if (memberError) {
    if (memberError.code === '23505') return { error: 'Você já é membro deste workspace' }
    return { error: memberError.message }
  }

  await supabase
    .from('workspace_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  return { workspaceId: invite.workspace_id }
}

export async function deleteInvite(
  inviteId: string,
  workspaceId: string,
): Promise<{ error?: string }> {
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('workspace_invites')
    .delete()
    .eq('id', inviteId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: error.message }
  return {}
}
