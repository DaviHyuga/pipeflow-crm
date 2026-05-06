import { Deal, KanbanBoard, STAGE_IDS, StageId } from "@/types/pipeline"

const deals: Deal[] = [
  // ── Novo Lead ──────────────────────────────────────────────────────────────
  {
    id: "deal-001",
    title: "Implementação CRM — Ambev",
    value: 48000,
    leadId: "lead-001",
    leadName: "Carlos Eduardo Silva",
    leadCompany: "Ambev",
    owner: "Rafael Torres",
    dueDate: "2025-06-15",
    stageId: "novo_lead",
  },
  {
    id: "deal-002",
    title: "Licença Pro — Nubank",
    value: 12000,
    leadId: "lead-002",
    leadName: "Fernanda Oliveira",
    leadCompany: "Nubank",
    owner: "Ana Lima",
    dueDate: "2025-06-20",
    stageId: "novo_lead",
  },
  {
    id: "deal-003",
    title: "Consultoria Comercial — iFood",
    value: 25000,
    leadId: "lead-003",
    leadName: "Bruno Martins",
    leadCompany: "iFood",
    owner: "Rafael Torres",
    dueDate: "2025-07-01",
    stageId: "novo_lead",
  },

  // ── Contato Realizado ───────────────────────────────────────────────────────
  {
    id: "deal-004",
    title: "Plano Anual — Mercado Livre",
    value: 84000,
    leadId: "lead-004",
    leadName: "Juliana Costa",
    leadCompany: "Mercado Livre",
    owner: "Paulo Mendes",
    dueDate: "2025-06-25",
    stageId: "contato_realizado",
  },
  {
    id: "deal-005",
    title: "Módulo Relatórios — Totvs",
    value: 32000,
    leadId: "lead-005",
    leadName: "Ricardo Alves",
    leadCompany: "Totvs",
    owner: "Ana Lima",
    dueDate: "2025-07-10",
    stageId: "contato_realizado",
  },
  {
    id: "deal-006",
    title: "Expansão Equipe — Grupo Boticário",
    value: 18500,
    leadId: "lead-006",
    leadName: "Mariana Santos",
    leadCompany: "Grupo Boticário",
    owner: "Rafael Torres",
    dueDate: "2025-06-30",
    stageId: "contato_realizado",
  },

  // ── Proposta Enviada ────────────────────────────────────────────────────────
  {
    id: "deal-007",
    title: "Integração API — Magazine Luiza",
    value: 65000,
    leadId: "lead-007",
    leadName: "Thiago Fernandes",
    leadCompany: "Magazine Luiza",
    owner: "Paulo Mendes",
    dueDate: "2025-06-18",
    stageId: "proposta_enviada",
  },
  {
    id: "deal-008",
    title: "Pacote Enterprise — Localiza",
    value: 120000,
    leadId: "lead-008",
    leadName: "Camila Ribeiro",
    leadCompany: "Localiza",
    owner: "Ana Lima",
    dueDate: "2025-06-22",
    stageId: "proposta_enviada",
  },
  {
    id: "deal-009",
    title: "Dashboard Executivo — Embraer",
    value: 55000,
    leadId: "lead-009",
    leadName: "Diego Carvalho",
    leadCompany: "Embraer",
    owner: "Rafael Torres",
    dueDate: "2025-07-05",
    stageId: "proposta_enviada",
  },

  // ── Negociação ──────────────────────────────────────────────────────────────
  {
    id: "deal-010",
    title: "Licenças 200 usuários — Itaú",
    value: 180000,
    leadId: "lead-010",
    leadName: "Patricia Lima",
    leadCompany: "Itaú",
    owner: "Paulo Mendes",
    dueDate: "2025-06-12",
    stageId: "negociacao",
  },
  {
    id: "deal-011",
    title: "CRM + Suporte — Vivo",
    value: 96000,
    leadId: "lead-011",
    leadName: "Leandro Moura",
    leadCompany: "Vivo",
    owner: "Ana Lima",
    dueDate: "2025-06-16",
    stageId: "negociacao",
  },
  {
    id: "deal-012",
    title: "Treinamento Equipe — Lojas Renner",
    value: 22000,
    leadId: "lead-012",
    leadName: "Vanessa Rocha",
    leadCompany: "Lojas Renner",
    owner: "Rafael Torres",
    dueDate: "2025-06-28",
    stageId: "negociacao",
  },

  // ── Fechado Ganho ───────────────────────────────────────────────────────────
  {
    id: "deal-013",
    title: "Plano Pro Anual — Rock Content",
    value: 36000,
    leadId: "lead-001",
    leadName: "Carlos Eduardo Silva",
    leadCompany: "Rock Content",
    owner: "Paulo Mendes",
    dueDate: "2025-04-30",
    stageId: "fechado_ganho",
  },
  {
    id: "deal-014",
    title: "Implementação Full — Conta Azul",
    value: 72000,
    leadId: "lead-002",
    leadName: "Fernanda Oliveira",
    leadCompany: "Conta Azul",
    owner: "Ana Lima",
    dueDate: "2025-04-15",
    stageId: "fechado_ganho",
  },

  // ── Fechado Perdido ─────────────────────────────────────────────────────────
  {
    id: "deal-015",
    title: "Proposta Recusada — Natura",
    value: 45000,
    leadId: "lead-003",
    leadName: "Bruno Martins",
    leadCompany: "Natura",
    owner: "Rafael Torres",
    dueDate: "2025-04-20",
    stageId: "fechado_perdido",
  },
  {
    id: "deal-016",
    title: "Orçamento Cancelado — TIM",
    value: 28000,
    leadId: "lead-004",
    leadName: "Juliana Costa",
    leadCompany: "TIM",
    owner: "Paulo Mendes",
    dueDate: "2025-04-25",
    stageId: "fechado_perdido",
  },
]

export const mockBoard: KanbanBoard = STAGE_IDS.reduce((acc, stageId) => {
  acc[stageId] = deals.filter((d) => d.stageId === stageId)
  return acc
}, {} as KanbanBoard)

export const mockOwners = ["Rafael Torres", "Ana Lima", "Paulo Mendes"]

export function generateDealId(): string {
  return `deal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
