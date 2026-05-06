export type StageId =
  | "novo_lead"
  | "contato_realizado"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido"

export interface Stage {
  id: StageId
  label: string
  color: string
}

export interface Deal {
  id: string
  title: string
  value: number
  leadId: string
  leadName: string
  leadCompany: string
  owner: string
  dueDate: string
  stageId: StageId
}

export type KanbanBoard = Record<StageId, Deal[]>

export const STAGES: Stage[] = [
  { id: "novo_lead",          label: "Novo Lead",          color: "#5B7FFF" },
  { id: "contato_realizado",  label: "Contato Realizado",  color: "#CAFF33" },
  { id: "proposta_enviada",   label: "Proposta Enviada",   color: "#FF6B35" },
  { id: "negociacao",         label: "Negociação",         color: "#A78BFA" },
  { id: "fechado_ganho",      label: "Fechado Ganho",      color: "#2ED573" },
  { id: "fechado_perdido",    label: "Fechado Perdido",    color: "#FF4757" },
]

export const STAGE_IDS: StageId[] = STAGES.map((s) => s.id)
