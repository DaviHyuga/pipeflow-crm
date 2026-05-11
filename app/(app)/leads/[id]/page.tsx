import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { getLead } from '@/lib/leads'
import { LeadDetailView } from '@/components/leads/lead-detail-view'

interface LeadPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadPage({ params }: LeadPageProps) {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const { id } = await params
  const lead = await getLead(workspaceId, id)

  if (!lead) notFound()

  return <LeadDetailView lead={lead} />
}
