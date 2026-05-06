"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Stage, Deal } from "@/types/pipeline"
import { DealCard } from "./deal-card"

interface KanbanColumnProps {
  stage: Stage
  deals: Deal[]
  staggerIndex: number
  onNewDeal: () => void
  onEditDeal: (deal: Deal) => void
}

function formatTotal(deals: Deal[]) {
  const total = deals.reduce((sum, d) => sum + d.value, 0)
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
    notation: total >= 1_000_000 ? "compact" : "standard",
  }).format(total)
}

export function KanbanColumn({
  stage,
  deals,
  staggerIndex,
  onNewDeal,
  onEditDeal,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      className="flex flex-col shrink-0 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{
        animationDelay: `${staggerIndex * 70}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          {/* Color dot */}
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: stage.color }}
          />
          <span className="text-sm font-semibold text-[#E8E8E8]">
            {stage.label}
          </span>
          {/* Count badge */}
          <span
            className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium"
            style={{
              background: `color-mix(in srgb, ${stage.color} 12%, transparent)`,
              color: stage.color,
            }}
          >
            {deals.length}
          </span>
        </div>

        {/* Total value */}
        {deals.length > 0 && (
          <span className="text-xs text-[#8A8A8F] font-mono tabular-nums">
            {formatTotal(deals)}
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2.5 flex-1 rounded-xl p-2.5 min-h-[120px] transition-all duration-200"
        style={{
          background: isOver ? "#1A1A1E" : "#0F0F11",
          outline: isOver
            ? `1px solid color-mix(in srgb, ${stage.color} 30%, transparent)`
            : "1px solid transparent",
        }}
      >
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              stageColor={stage.color}
              onEdit={onEditDeal}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {deals.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-[#555559] text-center select-none">
              Arraste um negócio<br />para cá
            </p>
          </div>
        )}

        {/* Drop indicator when empty + isOver */}
        {deals.length === 0 && isOver && (
          <div
            className="flex-1 rounded-lg border-2 border-dashed"
            style={{
              borderColor: `color-mix(in srgb, ${stage.color} 40%, transparent)`,
            }}
          />
        )}
      </div>

      {/* Add deal button */}
      <button
        onClick={onNewDeal}
        className={[
          "mt-2 flex items-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-medium",
          "text-[#555559] hover:text-[#E8E8E8] transition-colors duration-150",
          "hover:bg-[#1A1A1E]",
        ].join(" ")}
      >
        <Plus className="h-3.5 w-3.5" />
        Novo Negócio
      </button>
    </div>
  )
}
