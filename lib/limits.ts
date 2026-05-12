import { createServiceClient } from '@/lib/supabase/server'
import { FREE_LIMITS } from '@/lib/plan-config'
export { FREE_LIMITS }

export type LimitResult = {
  allowed: boolean
  used: number
  limit: number | null // null = unlimited (pro)
  plan: 'free' | 'pro'
}

export async function canAddLead(workspaceId: string): Promise<LimitResult> {
  const supabase = await createServiceClient()

  const [{ data: workspace }, { count }] = await Promise.all([
    supabase.from('workspaces').select('plan').eq('id', workspaceId).single(),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
  ])

  const plan = (workspace?.plan ?? 'free') as 'free' | 'pro'
  const used = count ?? 0

  if (plan === 'pro') return { allowed: true, used, limit: null, plan }
  return { allowed: used < FREE_LIMITS.leads, used, limit: FREE_LIMITS.leads, plan }
}

export async function canAddMember(workspaceId: string): Promise<LimitResult> {
  const supabase = await createServiceClient()

  const [{ data: workspace }, { count }] = await Promise.all([
    supabase.from('workspaces').select('plan').eq('id', workspaceId).single(),
    supabase
      .from('workspace_members')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
  ])

  const plan = (workspace?.plan ?? 'free') as 'free' | 'pro'
  const used = count ?? 0

  if (plan === 'pro') return { allowed: true, used, limit: null, plan }
  return { allowed: used < FREE_LIMITS.members, used, limit: FREE_LIMITS.members, plan }
}
