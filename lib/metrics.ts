import { createClient } from '@/lib/supabase/server'
import { STAGES } from '@/types/pipeline'
import type { DashboardMetric, FunnelStageData, UpcomingDeal } from '@/types/dashboard'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) {
    const k = value / 1_000
    return `R$ ${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)} mil`
  }
  return `R$ ${value}`
}

export async function getDashboardData(workspaceId: string): Promise<{
  metrics: DashboardMetric[]
  funnelData: FunnelStageData[]
  upcomingDeals: UpcomingDeal[]
}> {
  const supabase = await createClient()

  const [leadsResult, dealsResult] = await Promise.all([
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
    supabase
      .from('deals')
      .select('id, title, stage, value, due_date, lead_id')
      .eq('workspace_id', workspaceId),
  ])

  const totalLeads = leadsResult.count ?? 0
  const allDeals = dealsResult.data ?? []

  const activeDeals = allDeals.filter(
    (d) => d.stage !== 'fechado_ganho' && d.stage !== 'fechado_perdido',
  )
  const wonDeals = allDeals.filter((d) => d.stage === 'fechado_ganho')
  const lostDeals = allDeals.filter((d) => d.stage === 'fechado_perdido')
  const closedTotal = wonDeals.length + lostDeals.length
  const conversionRate =
    closedTotal > 0 ? Math.round((wonDeals.length / closedTotal) * 100) : 0
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + Number(d.value ?? 0), 0)

  const metrics: DashboardMetric[] = [
    {
      label: 'Total de Leads',
      value: String(totalLeads),
      rawValue: totalLeads,
      change: 0,
      icon: 'users',
    },
    {
      label: 'Negócios Abertos',
      value: String(activeDeals.length),
      rawValue: activeDeals.length,
      change: 0,
      icon: 'briefcase',
    },
    {
      label: 'Valor do Pipeline',
      value: formatCurrency(totalPipelineValue),
      rawValue: totalPipelineValue,
      change: 0,
      icon: 'dollar-sign',
    },
    {
      label: 'Taxa de Conversão',
      value: `${conversionRate}%`,
      rawValue: conversionRate,
      change: 0,
      icon: 'trending-up',
    },
  ]

  const funnelData: FunnelStageData[] = STAGES.map((stage) => {
    const stageDeals = allDeals.filter((d) => d.stage === stage.id)
    return {
      stageId: stage.id,
      label: stage.label,
      color: stage.color,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + Number(d.value ?? 0), 0),
    }
  })

  // Upcoming deals: active + due_date defined, sorted asc, limit 6
  const dealsWithDue = activeDeals
    .filter((d) => d.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 6)

  // Fetch lead info for upcoming deals
  const leadIds = [...new Set(dealsWithDue.filter((d) => d.lead_id).map((d) => d.lead_id!))]
  const { data: leadsData } =
    leadIds.length > 0
      ? await supabase.from('leads').select('id, name, company').in('id', leadIds)
      : { data: [] }
  const leadsMap = new Map((leadsData ?? []).map((l) => [l.id, l]))

  const upcomingDeals: UpcomingDeal[] = dealsWithDue.map((d) => {
    const stage = STAGES.find((s) => s.id === d.stage)
    const lead = d.lead_id ? leadsMap.get(d.lead_id) : null
    return {
      id: d.id,
      title: d.title,
      owner: '',
      leadName: lead?.name ?? '—',
      company: lead?.company ?? '—',
      dueDate: d.due_date!,
      stageLabel: stage?.label ?? '',
      stageColor: stage?.color ?? '',
    }
  })

  return { metrics, funnelData, upcomingDeals }
}
