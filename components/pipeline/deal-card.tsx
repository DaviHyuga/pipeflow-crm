"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, User, Building2, GripVertical, Pencil } from "lucide-react"
import { Deal } from "@/types/pipeline"
import { cn } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
  stageColor: string
  isOverlay?: boolean
  onEdit?: (deal: Deal) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

function isOverdue(dateStr: string) {
  return new Date(dateStr + "T00:00:00") < new Date()
}

export function DealCard({ deal, stageColor, isOverlay, onEdit }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    "--stage-color": stageColor,
  } as React.CSSProperties

  const overdue = isOverdue(deal.dueDate)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        // bg-card + border-border adaptam automaticamente a light/dark
        "group relative bg-card border border-border rounded-xl p-3.5 select-none",
        "transition-all duration-200",
        "hover:border-[color:var(--stage-color)] hover:-translate-y-0.5",
        "hover:shadow-[0_4px_20px_-4px_color-mix(in_srgb,var(--stage-color)_25%,transparent)]",
        isOverlay
          ? "shadow-2xl border-[color:var(--stage-color)] rotate-1 scale-[1.03] cursor-grabbing"
          : isDragging
          ? "cursor-grabbing"
          : "cursor-grab"
      )}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-card-foreground pr-6 leading-snug mb-2.5">
        {deal.title}
      </p>

      {/* Value — usa a cor da stage (vivid, legível em ambos os modos) */}
      <p
        className="text-base font-bold mb-3 tabular-nums font-mono"
        style={{ color: stageColor }}
      >
        {formatCurrency(deal.value)}
      </p>

      {/* Meta info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate font-medium text-foreground/75">
            {deal.leadCompany}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="truncate">{deal.leadName}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3 shrink-0" />
            <span>{deal.owner}</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              overdue ? "text-destructive" : "text-muted-foreground"
            )}
          >
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formatDate(deal.dueDate)}</span>
          </div>
        </div>
      </div>

      {/* Edit button */}
      {onEdit && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onEdit(deal)
          }}
          className="absolute top-3 right-7 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-0.5 rounded"
          aria-label="Editar negócio"
        >
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
