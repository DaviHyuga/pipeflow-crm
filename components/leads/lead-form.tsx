"use client"

import { useState, useEffect } from "react"
import { Lead, LeadStatus } from "@/types/lead"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockOwners } from "@/lib/mock/leads"

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contactado", label: "Contactado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "proposta", label: "Proposta" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
]

interface LeadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  onSave: (lead: Lead) => void
  onDelete?: (id: string) => void
}

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  owner: string
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  status: "novo",
  owner: mockOwners[0],
}

export function LeadForm({
  open,
  onOpenChange,
  lead,
  onSave,
  onDelete,
}: LeadFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const isEditing = !!lead

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        role: lead.role,
        status: lead.status,
        owner: lead.owner,
      })
    } else {
      setForm(emptyForm)
    }
  }, [lead, open])

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const saved: Lead = {
      id: lead?.id ?? `lead-${Date.now()}`,
      ...form,
      createdAt: lead?.createdAt ?? new Date().toISOString().split("T")[0],
      activities: lead?.activities ?? [],
    }
    onSave(saved)
    onOpenChange(false)
  }

  function handleDeleteConfirm() {
    if (lead && onDelete) {
      onDelete(lead.id)
      setDeleteOpen(false)
      onOpenChange(false)
    }
  }

  const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md w-full flex flex-col overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Editar Lead" : "Novo Lead"}</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 px-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              {/* Nome */}
              <div>
                <label htmlFor="lead-name" className="block text-sm font-medium mb-1.5">
                  Nome <span className="text-destructive">*</span>
                </label>
                <Input
                  id="lead-name"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="lead-email" className="block text-sm font-medium mb-1.5">
                  E-mail
                </label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="email@empresa.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="lead-phone" className="block text-sm font-medium mb-1.5">
                  Telefone
                </label>
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>

              {/* Empresa */}
              <div>
                <label htmlFor="lead-company" className="block text-sm font-medium mb-1.5">
                  Empresa
                </label>
                <Input
                  id="lead-company"
                  placeholder="Nome da empresa"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </div>

              {/* Cargo */}
              <div>
                <label htmlFor="lead-role" className="block text-sm font-medium mb-1.5">
                  Cargo
                </label>
                <Input
                  id="lead-role"
                  placeholder="Ex: Diretor Comercial"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="lead-status" className="block text-sm font-medium mb-1.5">
                  Status
                </label>
                <select
                  id="lead-status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as LeadStatus)}
                  className={selectClass}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Responsável */}
              <div>
                <label htmlFor="lead-owner" className="block text-sm font-medium mb-1.5">
                  Responsável
                </label>
                <select
                  id="lead-owner"
                  value={form.owner}
                  onChange={(e) => set("owner", e.target.value)}
                  className={selectClass}
                >
                  {mockOwners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <SheetFooter className="mt-auto">
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  className="mr-auto"
                  onClick={() => setDeleteOpen(true)}
                >
                  Excluir
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Salvar alterações" : "Criar lead"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Confirm delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir lead</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{" "}
            <span className="font-medium text-foreground">{lead?.name}</span>?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
