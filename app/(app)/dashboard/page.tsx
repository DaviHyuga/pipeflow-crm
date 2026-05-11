import { mockMetrics, mockFunnelData, mockUpcomingDeals } from "@/lib/mock/dashboard"
import { MetricCard } from "@/components/dashboard/metric-card"
import { SalesFunnel } from "@/components/dashboard/sales-funnel"
import { UpcomingDeals } from "@/components/dashboard/upcoming-deals"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Metric cards — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Bar chart — full width */}
      <SalesFunnel data={mockFunnelData} />

      {/* Upcoming deals table — full width */}
      <UpcomingDeals deals={mockUpcomingDeals} />
    </div>
  )
}
