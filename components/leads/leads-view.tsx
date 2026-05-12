"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lead, LeadStatus } from "@/types/lead"
import { LeadStatusBadge } from "@/components/leads/lead-status-badge"
import { LeadForm } from "@/components/leads/lead-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Search, MoreHorizontal, ExternalLink, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { createLeadAction, updateLeadAction, deleteLeadAction } from "@/app/(app)/leads/actions"

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "novo", label: "Novo" },
  { value: "contactado", label: "Contactado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "proposta", label: "Proposta" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface LeadsViewProps {
  leads: Lead[]
  currentSearch: string
  currentStatus: string
  ownerDisplay: string
  plan: 'free' | 'pro'
  totalLeadsCount: number
  leadsLimit: number | null
}

export function LeadsView({ leads, currentSearch, currentStatus, ownerDisplay, plan, totalLeadsCount, leadsLimit }: LeadsViewProps) {
  const atLimit = plan === 'free' && leadsLimit !== null && totalLeadsCount >= leadsLimit
  const nearLimit = plan === 'free' && leadsLimit !== null && !atLimit && totalLeadsCount >= leadsLimit * 0.8
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch)
  const [statusFilter, setStatusFilter] = useState(currentStatus)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [actionError, setActionError] = useState('')
  const statusFilterRef = useRef(statusFilter)
  statusFilterRef.current = statusFilter

  // Debounced search → URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set("q", search)
      if (statusFilterRef.current !== "all") params.set("status", statusFilterRef.current)
      router.push(`/leads?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleStatusChange(value: string) {
    setStatusFilter(value)
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (value !== "all") params.set("status", value)
    router.push(`/leads?${params.toString()}`)
  }

  function openCreate() {
    setSelectedLead(null)
    setFormOpen(true)
  }

  function openEdit(lead: Lead) {
    setSelectedLead(lead)
    setFormOpen(true)
  }

  async function handleSave(saved: Lead) {
    setFormOpen(false)
    setActionError('')
    setIsPending(true)
    try {
      if (selectedLead) {
        await updateLeadAction(saved.id, {
          name: saved.name,
          email: saved.email,
          phone: saved.phone,
          company: saved.company,
          role: saved.role,
          status: saved.status,
          notes: saved.notes,
          estimatedValue: saved.estimatedValue,
        })
      } else {
        const result = await createLeadAction({
          name: saved.name,
          email: saved.email,
          phone: saved.phone,
          company: saved.company,
          role: saved.role,
          status: saved.status,
          notes: saved.notes,
          estimatedValue: saved.estimatedValue,
        })
        if (result && 'error' in result) {
          setActionError(result.error)
          return
        }
      }
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    setIsPending(true)
    try {
      await deleteLeadAction(target.id)
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  const selectClass =
    "h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead encontrado" : "leads encontrados"}
          </p>
        </div>
        <Button onClick={openCreate} disabled={isPending || atLimit}>
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Erro de action */}
      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {/* Aviso de limite */}
      {atLimit && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Limite de {leadsLimit} leads do plano Free atingido.{' '}
            <a href="/settings/billing" className="font-medium underline underline-offset-2">
              Faça upgrade para Pro
            </a>{' '}
            para adicionar mais leads.
          </span>
        </div>
      )}
      {nearLimit && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Você usou {totalLeadsCount} de {leadsLimit} leads do plano Free.{' '}
            <a href="/settings/billing" className="font-medium underline underline-offset-2">
              Faça upgrade para Pro
            </a>{' '}
            para não ficar sem espaço.
          </span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={selectClass}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lead</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Empresa
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Cargo
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Criado em
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="font-medium hover:text-primary transition-colors truncate block"
                          >
                            {lead.name}
                          </Link>
                          <p className="text-xs text-muted-foreground truncate md:hidden">
                            {lead.company}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {lead.company}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {lead.role}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors outline-none"
                          aria-label="Ações"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/leads/${lead.id}`)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(lead)}>
                            <Pencil className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteTarget(lead)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {leads.length > 0 && (
          <div className="border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <LeadForm
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={selectedLead}
        ownerDisplay={ownerDisplay}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir lead</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{" "}
            <span className="font-medium text-foreground">{deleteTarget?.name}</span>? Esta ação
            não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isPending}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
