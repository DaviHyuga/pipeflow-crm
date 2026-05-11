import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { getLeads } from '@/lib/leads'
import { LeadsView } from '@/components/leads/leads-view'

interface LeadsPageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const { q, status } = await searchParams
  const leads = await getLeads(workspaceId, { q, status })

  return <LeadsView leads={leads} currentSearch={q ?? ''} currentStatus={status ?? 'all'} />
}
