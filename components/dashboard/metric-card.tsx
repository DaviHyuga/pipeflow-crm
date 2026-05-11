import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardMetric } from "@/types/dashboard"

const ICONS = {
  users: Users,
  briefcase: Briefcase,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
}

const ICON_STYLES: Record<DashboardMetric["icon"], { bg: string; text: string }> = {
  users:         { bg: "bg-blue-500/20",    text: "text-blue-400" },
  briefcase:     { bg: "bg-cyan-500/20",    text: "text-cyan-400" },
  "dollar-sign": { bg: "bg-yellow-500/20",  text: "text-yellow-400" },
  "trending-up": { bg: "bg-emerald-500/20", text: "text-emerald-400" },
}

interface MetricCardProps {
  metric: DashboardMetric
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = ICONS[metric.icon]
  const { bg, text } = ICON_STYLES[metric.icon]
  const isPositive = metric.change >= 0

  return (
    <Card className="gap-2">
      <CardContent className="px-5 py-4">
        {/* Label + icon row */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {metric.label}
          </p>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${bg} ${text}`}
          >
            <Icon className="size-4" />
          </div>
        </div>

        {/* Value */}
        <p className="mt-2 text-4xl font-bold tracking-tight">{metric.value}</p>

        {/* Trend */}
        <div className="mt-2 flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">
            +{metric.change}%
          </span>
          <span className="text-xs text-muted-foreground">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  )
}
