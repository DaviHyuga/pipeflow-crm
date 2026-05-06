"use client"

import { useState } from "react"
import Link from "next/link"
import { Lead, Activity } from "@/types/lead"
import { LeadStatusBadge } from "@/components/leads/lead-status-badge"
import { LeadForm } from "@/components/leads/lead-form"
import { ActivityTimeline } from "@/components/leads/activity-timeline"
import { AddActivityModal } from "@/components/leads/add-activity-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Pencil,
  Plus,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  User,
} from "lucide-react"

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  )
}

interface LeadDetailViewProps {
  lead: Lead
}

export function LeadDetailView({ lead: initialLead }: LeadDetailViewProps) {
  const [lead, setLead] = useState<Lead>(initialLead)
  const [editOpen, setEditOpen] = useState(false)
  const [addActivityOpen, setAddActivityOpen] = useState(false)

  function handleSave(updated: Lead) {
    setLead(updated)
  }

  function handleAddActivity(activity: Activity) {
    setLead((prev) => ({
      ...prev,
      activities: [activity, ...prev.activities],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Leads
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
            {lead.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {lead.role}
              {lead.company ? ` · ${lead.company}` : ""}
            </p>
            <div className="mt-2">
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Info cards */}
        <div className="space-y-4 lg:col-span-1">
          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Mail} label="E-mail" value={lead.email} />
              <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
            </CardContent>
          </Card>

          {/* Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Building2} label="Empresa" value={lead.company} />
              <InfoRow icon={Briefcase} label="Cargo" value={lead.role} />
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={User} label="Responsável" value={lead.owner} />
              <InfoRow
                icon={Calendar}
                label="Criado em"
                value={formatDate(lead.createdAt)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  Atividades ({lead.activities.length})
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddActivityOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Registrar atividade
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={lead.activities} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Sheet */}
      <LeadForm
        open={editOpen}
        onOpenChange={setEditOpen}
        lead={lead}
        onSave={handleSave}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        open={addActivityOpen}
        onOpenChange={setAddActivityOpen}
        leadId={lead.id}
        onAdd={handleAddActivity}
      />
    </div>
  )
}
