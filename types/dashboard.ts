export type MetricIcon = "users" | "briefcase" | "dollar-sign" | "trending-up"

export interface DashboardMetric {
  label: string
  value: string
  rawValue: number
  change: number // positive = up, negative = down
  icon: MetricIcon
}

export interface FunnelStageData {
  stageId: string
  label: string
  color: string
  count: number
  value: number
}

export interface UpcomingDeal {
  id: string
  title: string
  owner: string       // deal owner (shown below title)
  leadName: string    // lead full name
  company: string     // lead company
  dueDate: string     // ISO date string
  stageLabel: string
  stageColor: string
}
