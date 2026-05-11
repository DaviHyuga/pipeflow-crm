"use client"

import { useState, useRef } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { STAGES, STAGE_IDS, StageId, Deal, KanbanBoard as KanbanBoardType } from "@/types/pipeline"
import { KanbanColumn } from "./kanban-column"
import { DealCard } from "./deal-card"
import { DealForm } from "./deal-form"
import {
  createDealAction,
  updateDealAction,
  updateDealStageAction,
  deleteDealAction,
} from "@/app/(app)/pipeline/actions"

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildBoard(deals: Deal[]): KanbanBoardType {
  const board = STAGE_IDS.reduce(
    (acc, id) => ({ ...acc, [id]: [] }),
    {} as KanbanBoardType,
  )
  for (const deal of deals) {
    board[deal.stageId].push(deal)
  }
  return board
}

function findDealStage(boards: KanbanBoardType, dealId: string): StageId | null {
  for (const stageId of STAGE_IDS) {
    if (boards[stageId].some((d) => d.id === dealId)) return stageId
  }
  return null
}

function findDeal(boards: KanbanBoardType, dealId: string): Deal | null {
  for (const stageId of STAGE_IDS) {
    const deal = boards[stageId].find((d) => d.id === dealId)
    if (deal) return deal
  }
  return null
}

// ─── Component ──────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  initialDeals: Deal[]
  workspaceLeads: { id: string; name: string; company: string }[]
}

export function KanbanBoard({ initialDeals, workspaceLeads }: KanbanBoardProps) {
  const [boards, setBoards] = useState<KanbanBoardType>(() => buildBoard(initialDeals))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [defaultStage, setDefaultStage] = useState<StageId>("novo_lead")

  // Always-current ref to avoid stale closures in drag handlers
  const latestBoards = useRef(boards)
  latestBoards.current = boards

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const activeDeal = activeId ? findDeal(boards, activeId) : null
  const activeStageId = activeId ? findDealStage(boards, activeId) : null
  const activeStageColor = STAGES.find((s) => s.id === activeStageId)?.color ?? "#5B7FFF"

  // ── Drag handlers ──────────────────────────────────────────────────────────

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    const isOverColumn = (STAGE_IDS as string[]).includes(overId)

    setBoards((prev) => {
      const sourceStage = findDealStage(prev, activeId)
      if (!sourceStage) return prev

      const targetStage: StageId = isOverColumn
        ? (overId as StageId)
        : (findDealStage(prev, overId) as StageId)
      if (!targetStage) return prev

      if (sourceStage === targetStage) {
        if (isOverColumn) return prev
        const oldIndex = prev[sourceStage].findIndex((d) => d.id === activeId)
        const newIndex = prev[sourceStage].findIndex((d) => d.id === overId)
        if (oldIndex === newIndex) return prev
        return { ...prev, [sourceStage]: arrayMove(prev[sourceStage], oldIndex, newIndex) }
      }

      const deal = prev[sourceStage].find((d) => d.id === activeId)!
      const updatedDeal: Deal = { ...deal, stageId: targetStage }
      let targetDeals = prev[targetStage].filter((d) => d.id !== activeId)

      if (!isOverColumn) {
        const overIndex = targetDeals.findIndex((d) => d.id === overId)
        const isBelowMidpoint =
          active.rect.current.translated != null &&
          active.rect.current.translated.top > over.rect.top + over.rect.height / 2
        const insertIndex = isBelowMidpoint ? overIndex + 1 : overIndex
        targetDeals = [
          ...targetDeals.slice(0, insertIndex),
          updatedDeal,
          ...targetDeals.slice(insertIndex),
        ]
      } else {
        targetDeals = [...targetDeals, updatedDeal]
      }

      return {
        ...prev,
        [sourceStage]: prev[sourceStage].filter((d) => d.id !== activeId),
        [targetStage]: targetDeals,
      }
    })
  }

  function onDragEnd({ active }: DragEndEvent) {
    setActiveId(null)
    const dealId = active.id as string

    // Persist new stage + position using the always-current ref
    const currentBoards = latestBoards.current
    const stage = findDealStage(currentBoards, dealId)
    if (stage) {
      const position = currentBoards[stage].findIndex((d) => d.id === dealId)
      updateDealStageAction(dealId, stage, position) // fire & forget
    }
  }

  // ── Form handlers ──────────────────────────────────────────────────────────

  function openNewDeal(stageId: StageId) {
    setEditingDeal(null)
    setDefaultStage(stageId)
    setFormOpen(true)
  }

  function openEditDeal(deal: Deal) {
    setEditingDeal(deal)
    setDefaultStage(deal.stageId)
    setFormOpen(true)
  }

  async function handleSave(deal: Deal) {
    if (editingDeal) {
      // Optimistic update for edit
      setBoards((prev) => {
        const oldStage = findDealStage(prev, editingDeal.id)!
        const next = {
          ...prev,
          [oldStage]: prev[oldStage].filter((d) => d.id !== editingDeal.id),
        }
        return { ...next, [deal.stageId]: [...next[deal.stageId], deal] }
      })
      setFormOpen(false)
      await updateDealAction({
        id: deal.id,
        title: deal.title,
        value: deal.value,
        stage: deal.stageId,
        leadId: deal.leadId,
        dueDate: deal.dueDate,
      })
    } else {
      // For new deals: call Server Action first to get real UUID
      setFormOpen(false)
      const created = await createDealAction({
        title: deal.title,
        value: deal.value,
        stage: deal.stageId,
        leadId: deal.leadId,
        dueDate: deal.dueDate,
      })
      if (created) {
        setBoards((prev) => ({
          ...prev,
          [created.stageId]: [...prev[created.stageId], created],
        }))
      }
    }
  }

  async function handleDelete() {
    if (!editingDeal) return
    const target = editingDeal
    setBoards((prev) => {
      const stage = findDealStage(prev, target.id)
      if (!stage) return prev
      return { ...prev, [stage]: prev[stage].filter((d) => d.id !== target.id) }
    })
    setFormOpen(false)
    await deleteDealAction(target.id)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 -mx-1 px-1">
          {STAGES.map((stage, index) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={boards[stage.id]}
              staggerIndex={index}
              onNewDeal={() => openNewDeal(stage.id)}
              onEditDeal={openEditDeal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
          {activeDeal && (
            <DealCard deal={activeDeal} stageColor={activeStageColor} isOverlay />
          )}
        </DragOverlay>
      </DndContext>

      <DealForm
        open={formOpen}
        onOpenChange={setFormOpen}
        deal={editingDeal}
        defaultStageId={defaultStage}
        workspaceLeads={workspaceLeads}
        onSave={handleSave}
        onDelete={editingDeal ? handleDelete : undefined}
      />
    </>
  )
}
