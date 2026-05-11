import { createServiceClient } from '@/lib/supabase/server'
import type { WorkspaceMemberRole } from '@/src/types/supabase'

export type MemberWithEmail = {
  id: string
  user_id: string
  email: string
  role: WorkspaceMemberRole
  invited_by: string | null
  joined_at: string
}

export async function getWorkspaceMembers(workspaceId: string): Promise<MemberWithEmail[]> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('workspace_members')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })

  if (error || !data) return []

  const members = await Promise.all(
    data.map(async (m) => {
      const {
        data: { user },
      } = await supabase.auth.admin.getUserById(m.user_id)
      return {
        id: m.id,
        user_id: m.user_id,
        email: user?.email ?? m.user_id,
        role: m.role as WorkspaceMemberRole,
        invited_by: m.invited_by,
        joined_at: m.created_at,
      }
    }),
  )

  return members
}
