import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UpcomingDeal } from "@/types/dashboard"

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  })
}

interface StageBadgeProps {
  label: string
  color: string
}

function StageBadge({ label, color }: StageBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{
        backgroundColor: `${color}25`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  )
}

interface UpcomingDealsProps {
  deals: UpcomingDeal[]
}

export function UpcomingDeals({ deals }: UpcomingDealsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Negócios com Prazo Próximo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-border px-6 pb-2">
          <span className="text-sm text-muted-foreground">Negócio</span>
          <span className="text-sm text-muted-foreground">Lead</span>
          <span className="text-sm text-muted-foreground">Etapa</span>
          <span className="text-sm text-muted-foreground">Prazo</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {deals.map((deal) => {
            const days = getDaysUntil(deal.dueDate)
            const isVencido = days < 0
            const isUrgente = days >= 0 && days <= 3

            return (
              <div
                key={deal.id}
                className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                {/* Negócio */}
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{deal.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{deal.owner}</p>
                </div>

                {/* Lead */}
                <div className="min-w-0">
                  <p className="truncate text-base font-medium">{deal.leadName}</p>
                  <p className="truncate text-sm text-muted-foreground">{deal.company}</p>
                </div>

                {/* Etapa */}
                <StageBadge label={deal.stageLabel} color={deal.stageColor} />

                {/* Prazo */}
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock
                    className={`size-3.5 shrink-0 ${
                      isVencido || isUrgente ? "text-red-500" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isVencido || isUrgente ? "text-red-400" : "text-muted-foreground"
                    }`}
                  >
                    {formatDate(deal.dueDate)}
                  </span>
                  {isVencido && (
                    <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                      Vencido
                    </span>
                  )}
                  {isUrgente && (
                    <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                      Urgente
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
