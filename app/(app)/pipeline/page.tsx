import { KanbanBoard } from "@/components/pipeline/kanban-board"
import { Plus } from "lucide-react"

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8E8E8]">
            Pipeline
          </h1>
          <p className="mt-1 text-sm text-[#8A8A8F]">
            Acompanhe e mova seus negócios entre etapas.
          </p>
        </div>
      </div>

      {/* Board */}
      <KanbanBoard />
    </div>
  )
}
