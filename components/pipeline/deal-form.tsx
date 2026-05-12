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

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground " +
  "focus:outline-none focus:border-ring transition-colors placeholder:text-muted-foreground"

const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5"

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

  // Form reset when the modal opens — intentional setState in effect
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Negócio" : "Novo Negócio"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Título */}
          <div>
            <label className={labelClass}>
              Título <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Implementação CRM — Empresa"
            />
          </div>

          {/* Valor */}
          <div>
            <label className={labelClass}>Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={valueRaw}
                onChange={(e) => setValueRaw(formatValueInput(e.target.value))}
                placeholder="0"
                className={`${fieldClass} pl-8`}
              />
            </div>
          </div>

          {/* Lead vinculado */}
          <div>
            <label className={labelClass}>Lead vinculado</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className={fieldClass}
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

          {/* Etapa + Prazo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Etapa</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value as StageId)}
                className={fieldClass}
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
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 pt-2">
          {isEditing && onDelete ? (
            deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive">Confirmar exclusão?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 px-2 text-xs"
                  onClick={onDelete}
                >
                  Excluir
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {isEditing ? "Salvar" : "Criar Negócio"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
