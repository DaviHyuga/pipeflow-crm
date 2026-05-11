"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Deal, STAGES, StageId } from "@/types/pipeline"
import { Trash2 } from "lucide-react"

interface DealFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal: Deal | null
  defaultStageId: StageId
  workspaceLeads: { id: string; name: string; company: string }[]
  onSave: (deal: Deal) => void
  onDelete?: () => void
}

const inputClass =
  "w-full bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#E8E8E8] " +
  "focus:outline-none focus:border-[#5B7FFF] transition-colors placeholder:text-[#555559]"

const selectClass =
  "w-full bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#E8E8E8] " +
  "focus:outline-none focus:border-[#5B7FFF] transition-colors appearance-none cursor-pointer"

const labelClass = "block text-xs font-medium text-[#8A8A8F] mb-1.5"

function formatValueInput(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  return parseInt(digits, 10).toLocaleString("pt-BR")
}

function parseValueInput(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, "") || "0", 10)
}

const today = new Date().toISOString().split("T")[0]

export function DealForm({
  open,
  onOpenChange,
  deal,
  defaultStageId,
  workspaceLeads,
  onSave,
  onDelete,
}: DealFormProps) {
  const [title, setTitle] = useState("")
  const [valueRaw, setValueRaw] = useState("")
  const [leadId, setLeadId] = useState("")
  const [dueDate, setDueDate] = useState(today)
  const [stageId, setStageId] = useState<StageId>(defaultStageId)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open) {
      setDeleteConfirm(false)
      if (deal) {
        setTitle(deal.title)
        setValueRaw(deal.value.toLocaleString("pt-BR"))
        setLeadId(deal.leadId)
        setDueDate(deal.dueDate || today)
        setStageId(deal.stageId)
      } else {
        setTitle("")
        setValueRaw("")
        setLeadId("")
        setDueDate(today)
        setStageId(defaultStageId)
      }
    }
  }, [open, deal, defaultStageId])

  function handleSave() {
    if (!title.trim()) return
    const selectedLead = workspaceLeads.find((l) => l.id === leadId)
    const saved: Deal = {
      id: deal?.id ?? `deal-${Date.now()}`,
      title: title.trim(),
      value: parseValueInput(valueRaw),
      leadId,
      leadName: selectedLead?.name ?? "",
      leadCompany: selectedLead?.company ?? "",
      owner: deal?.owner ?? "",
      dueDate: dueDate || today,
      stageId,
    }
    onSave(saved)
  }

  const isEditing = !!deal

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#141416] border-[#2A2A2E] text-[#E8E8E8]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {isEditing ? "Editar Negócio" : "Novo Negócio"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Title */}
          <div>
            <label className={labelClass}>Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Implementação CRM — Empresa"
              className="bg-[#1A1A1E] border-[#2A2A2E] focus-visible:border-[#5B7FFF] focus-visible:ring-0 text-[#E8E8E8] placeholder:text-[#555559]"
            />
          </div>

          {/* Value */}
          <div>
            <label className={labelClass}>Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8A8A8F] pointer-events-none">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={valueRaw}
                onChange={(e) => setValueRaw(formatValueInput(e.target.value))}
                placeholder="0"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          {/* Lead picker */}
          <div>
            <label className={labelClass}>Lead vinculado</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className={selectClass}
            >
              <option value="">— Sem lead vinculado —</option>
              {workspaceLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.company ? ` · ${l.company}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Stage + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Etapa</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value as StageId)}
                className={selectClass}
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prazo</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 pt-2">
          {isEditing && onDelete ? (
            deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FF4757]">Confirmar exclusão?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-[#8A8A8F] hover:text-[#E8E8E8]"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2 text-xs bg-[#FF4757] hover:bg-[#FF4757]/80 text-white"
                  onClick={onDelete}
                >
                  Excluir
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-[#8A8A8F] hover:text-[#FF4757] hover:bg-[#FF4757]/10"
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Excluir
              </Button>
            )
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-[#8A8A8F] hover:text-[#E8E8E8]"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              className="bg-[#5B7FFF] hover:bg-[#5B7FFF]/85 text-white"
            >
              {isEditing ? "Salvar" : "Criar Negócio"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
