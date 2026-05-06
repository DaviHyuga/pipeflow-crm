import { LeadStatus } from "@/types/lead"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  novo: {
    label: "Novo",
    className:
      "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  },
  contactado: {
    label: "Contactado",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  },
  qualificado: {
    label: "Qualificado",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  },
  proposta: {
    label: "Proposta",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  },
  fechado: {
    label: "Fechado",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  perdido: {
    label: "Perdido",
    className:
      "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

export { statusConfig }
