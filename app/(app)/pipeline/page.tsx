import { KanbanBoardClient } from "@/components/pipeline/kanban-board-client"

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Pipeline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe e mova seus negócios entre etapas.
          </p>
        </div>
      </div>

      <KanbanBoardClient />
    </div>
  )
}
