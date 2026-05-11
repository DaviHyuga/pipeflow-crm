import { Activity, ActivityType } from "@/types/lead"
import { Phone, Mail, Video, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const activityConfig: Record<
  ActivityType,
  { label: string; icon: React.ElementType; iconClass: string; dotClass: string }
> = {
  ligacao: {
    label: "Ligação",
    icon: Phone,
    iconClass: "text-sky-600 dark:text-sky-400",
    dotClass: "bg-sky-500",
  },
  email: {
    label: "E-mail",
    icon: Mail,
    iconClass: "text-violet-600 dark:text-violet-400",
    dotClass: "bg-violet-500",
  },
  reuniao: {
    label: "Reunião",
    icon: Video,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  nota: {
    label: "Nota",
    icon: FileText,
    iconClass: "text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada ainda.
      </div>
    )
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="relative space-y-0">
      {sorted.map((activity, index) => {
        const config = activityConfig[activity.type]
        const Icon = config.icon
        const isLast = index === sorted.length - 1

        return (
          <div key={activity.id} className="relative flex gap-4">
            {/* Linha vertical */}
            {!isLast && (
              <div className="absolute top-8 left-[15px] w-px h-full bg-border" />
            )}

            {/* Ícone */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-background mt-1">
              <Icon className={cn("h-3.5 w-3.5", config.iconClass)} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pb-6">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-medium">{activity.title}</span>
                <span className="text-xs text-muted-foreground">
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activity.description}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{activity.author}</span>
                <span>·</span>
                <span>Registrado em {formatDate(activity.date)}</span>
                {activity.scheduledDate && (
                  <>
                    <span>·</span>
                    <span className="text-primary font-medium">
                      Previsto para {formatDate(activity.scheduledDate)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
