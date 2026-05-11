import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { getWorkspaceMembers } from '@/lib/members'
import { getWorkspaceInvites } from '@/lib/invites'
import { MembersView } from '@/components/settings/members-view'

export default async function MembersPage() {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) redirect('/create-workspace')

  // Role do usuário atual
  const { data: memberRow } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  const [members, invites] = await Promise.all([
    getWorkspaceMembers(workspaceId),
    getWorkspaceInvites(workspaceId),
  ])

  return (
    <MembersView
      members={members}
      invites={invites}
      currentUserId={user.id}
      currentUserRole={(memberRow?.role as 'admin' | 'member') ?? 'member'}
      plan={workspace.plan as 'free' | 'pro'}
      workspaceName={workspace.name}
    />
  )
}
