import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { getLeads } from '@/lib/leads'
import { createClient } from '@/lib/supabase/server'
import { canAddLead } from '@/lib/limits'
import { LeadsView } from '@/components/leads/leads-view'

interface LeadsPageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  const { q, status } = await searchParams
  const [leads, limitResult] = await Promise.all([
    getLeads(workspaceId, { q, status }),
    canAddLead(workspaceId),
  ])

  return (
    <LeadsView
      leads={leads}
      currentSearch={q ?? ''}
      currentStatus={status ?? 'all'}
      ownerDisplay={ownerDisplay}
      plan={limitResult.plan}
      totalLeadsCount={limitResult.used}
      leadsLimit={limitResult.limit}
    />
  )
}
