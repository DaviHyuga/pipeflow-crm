import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { getDashboardData } from '@/lib/metrics'
import { MetricCard } from '@/components/dashboard/metric-card'
import { SalesFunnel } from '@/components/dashboard/sales-funnel'
import { UpcomingDeals } from '@/components/dashboard/upcoming-deals'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const { metrics, funnelData, upcomingDeals } = await getDashboardData(workspaceId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <SalesFunnel data={funnelData} />

      <UpcomingDeals deals={upcomingDeals} />
    </div>
  )
}
