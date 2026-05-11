import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { getDeals } from '@/lib/deals'
import { getLeads } from '@/lib/leads'
import { KanbanBoardClient } from '@/components/pipeline/kanban-board-client'

export default async function PipelinePage() {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const [deals, allLeads] = await Promise.all([getDeals(workspaceId), getLeads(workspaceId)])

  const workspaceLeads = allLeads.map((l) => ({
    id: l.id,
    name: l.name,
    company: l.company,
  }))

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe e mova seus negócios entre etapas.
          </p>
        </div>
      </div>

      <KanbanBoardClient initialDeals={deals} workspaceLeads={workspaceLeads} />
    </div>
  )
}
