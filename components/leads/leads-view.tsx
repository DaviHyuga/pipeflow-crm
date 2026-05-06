"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Lead, LeadStatus } from "@/types/lead"
import { mockOwners } from "@/lib/mock/leads"
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
import { Plus, Search, MoreHorizontal, ExternalLink, Pencil, Trash2 } from "lucide-react"

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
  initialLeads: Lead[]
}

export function LeadsView({ initialLeads }: LeadsViewProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || lead.status === statusFilter
      const matchOwner = ownerFilter === "all" || lead.owner === ownerFilter
      return matchSearch && matchStatus && matchOwner
    })
  }, [leads, search, statusFilter, ownerFilter])

  function openCreate() {
    setSelectedLead(null)
    setFormOpen(true)
  }

  function openEdit(lead: Lead) {
    setSelectedLead(lead)
    setFormOpen(true)
  }

  function handleSave(saved: Lead) {
    setLeads((prev) => {
      const exists = prev.find((l) => l.id === saved.id)
      if (exists) return prev.map((l) => (l.id === saved.id ? saved : l))
      return [saved, ...prev]
    })
  }

  function handleDelete(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id))
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
            {leads.length} leads cadastrados
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

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
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
          className={selectClass}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">Todos os responsáveis</option>
          {mockOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
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
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Lead
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Empresa
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Cargo
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Responsável
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Criado em
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="bg-card hover:bg-muted/30 transition-colors"
                  >
                    {/* Lead */}
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

                    {/* Empresa */}
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {lead.company}
                    </td>

                    {/* Cargo */}
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {lead.role}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>

                    {/* Responsável */}
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {lead.owner}
                    </td>

                    {/* Data */}
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors outline-none"
                          aria-label="Ações"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                              href={`/leads/${lead.id}`}
                              className="flex items-center gap-2 w-full"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(lead)}>
                            <Pencil className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(lead.id)}
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

        {/* Rodapé da tabela */}
        {filtered.length > 0 && (
          <div className="border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            Exibindo {filtered.length} de {leads.length} leads
          </div>
        )}
      </div>

      {/* Form Sheet */}
      <LeadForm
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={selectedLead}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
