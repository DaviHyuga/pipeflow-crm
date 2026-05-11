"use client"

import { useState, useEffect } from "react"
import { Lead, LeadStatus } from "@/types/lead"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contactado", label: "Contactado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "proposta", label: "Proposta" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
]

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground " +
  "focus:outline-none focus:border-ring transition-colors placeholder:text-muted-foreground " +
  "disabled:opacity-60 disabled:cursor-default"

const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5"

function formatValueInput(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  return parseInt(digits, 10).toLocaleString("pt-BR")
}

function parseValueInput(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, "") || "0", 10)
}

interface LeadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  ownerDisplay: string
  onSave: (lead: Lead) => void
}

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  notes: string
  estimatedValueRaw: string
}

export function LeadForm({ open, onOpenChange, lead, ownerDisplay, onSave }: LeadFormProps) {
  const isEditing = !!lead

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    status: "novo",
    notes: "",
    estimatedValueRaw: "",
  })

  useEffect(() => {
    if (!open) return
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        role: lead.role,
        status: lead.status,
        notes: lead.notes,
        estimatedValueRaw:
          lead.estimatedValue > 0 ? lead.estimatedValue.toLocaleString("pt-BR") : "",
      })
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        status: "novo",
        notes: "",
        estimatedValueRaw: "",
      })
    }
  }, [open, lead])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const saved: Lead = {
      id: lead?.id ?? `lead-${Date.now()}`,
      name: form.name.trim(),
      email: form.email,
      phone: form.phone,
      company: form.company,
      role: form.role,
      status: form.status,
      owner: lead?.owner ?? ownerDisplay,
      notes: form.notes,
      estimatedValue: parseValueInput(form.estimatedValueRaw),
      createdAt: lead?.createdAt ?? new Date().toISOString().split("T")[0],
      activities: lead?.activities ?? [],
    }
    onSave(saved)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Lead" : "Novo Lead"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {/* Nome + E-mail */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Nome <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                E-mail <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
          </div>

          {/* Empresa + Telefone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Empresa</label>
              <Input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Cargo + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Cargo</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Ex: Diretor Comercial"
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Status <span className="text-destructive">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as LeadStatus)}
                className={fieldClass}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Responsável + Valor estimado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Responsável <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={lead?.owner ?? ownerDisplay}
                readOnly
                disabled
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Valor estimado (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.estimatedValueRaw}
                  onChange={(e) => set("estimatedValueRaw", formatValueInput(e.target.value))}
                  placeholder="0"
                  className={`${fieldClass} pl-8`}
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className={labelClass}>Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Observações sobre este lead..."
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!form.name.trim()}>
              {isEditing ? "Salvar alterações" : "Criar lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
