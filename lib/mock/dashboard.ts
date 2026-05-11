import { STAGES } from "@/types/pipeline"
import { mockBoard } from "@/lib/mock/pipeline"
import type {
  DashboardMetric,
  FunnelStageData,
  UpcomingDeal,
} from "@/types/dashboard"

const allDeals = Object.values(mockBoard).flat()
const activeDeals = allDeals.filter(
  (d) => d.stageId !== "fechado_ganho" && d.stageId !== "fechado_perdido"
)
const wonDeals = mockBoard["fechado_ganho"]
const lostDeals = mockBoard["fechado_perdido"]
const closedTotal = wonDeals.length + lostDeals.length
const conversionRate =
  closedTotal > 0 ? Math.round((wonDeals.length / closedTotal) * 100) : 0
const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0)

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) {
    const k = value / 1_000
    return `R$ ${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)} mil`
  }
  return `R$ ${value}`
}

const TOTAL_LEADS = 13

export const mockMetrics: DashboardMetric[] = [
  {
    label: "Total de Leads",
    value: String(TOTAL_LEADS),
    rawValue: TOTAL_LEADS,
    change: 18,
    icon: "users",
  },
  {
    label: "Negócios Abertos",
    value: String(activeDeals.length),
    rawValue: activeDeals.length,
    change: 6,
    icon: "briefcase",
  },
  {
    label: "Valor do Pipeline",
    value: formatCurrency(totalPipelineValue),
    rawValue: totalPipelineValue,
    change: 23,
    icon: "dollar-sign",
  },
  {
    label: "Taxa de Conversão",
    value: `${conversionRate}%`,
    rawValue: conversionRate,
    change: 4,
    icon: "trending-up",
  },
]

export const mockFunnelData: FunnelStageData[] = STAGES.map((stage) => {
  const deals = mockBoard[stage.id]
  return {
    stageId: stage.id,
    label: stage.label,
    color: stage.color,
    count: deals.length,
    value: deals.reduce((sum, d) => sum + d.value, 0),
  }
})

// Upcoming deals — mix of vencidos and próximos (base: 2026-05-06)
export const mockUpcomingDeals: UpcomingDeal[] = [
  {
    id: "ud-001",
    title: "Marketing Digital — Agência Click",
    owner: "Camila Sousa",
    leadName: "Diego Henrique Prado",
    company: "Agência Click Digital",
    dueDate: "2026-04-25",
    stageLabel: "Contato Realizado",
    stageColor: "#22D3EE",
  },
  {
    id: "ud-002",
    title: "Integração SAP — TechSolve Brasil",
    owner: "Camila Sousa",
    leadName: "Carlos Eduardo Lima",
    company: "TechSolve Brasil",
    dueDate: "2026-04-30",
    stageLabel: "Negociação",
    stageColor: "#F97316",
  },
  {
    id: "ud-003",
    title: "Licenças Enterprise — Clínica Vida & Saúde",
    owner: "Rafael Mendes",
    leadName: "Patricia Mendonça",
    company: "Clínica Vida & Saúde",
    dueDate: "2026-05-02",
    stageLabel: "Proposta Enviada",
    stageColor: "#A3E635",
  },
  {
    id: "ud-004",
    title: "Implementação CRM — Ambev",
    owner: "Rafael Torres",
    leadName: "Carlos Eduardo Silva",
    company: "Ambev",
    dueDate: "2026-05-10",
    stageLabel: "Proposta Enviada",
    stageColor: "#A3E635",
  },
  {
    id: "ud-005",
    title: "Pacote Enterprise — Localiza",
    owner: "Ana Lima",
    leadName: "Camila Ribeiro",
    company: "Localiza",
    dueDate: "2026-05-16",
    stageLabel: "Negociação",
    stageColor: "#F97316",
  },
  {
    id: "ud-006",
    title: "Dashboard Executivo — Embraer",
    owner: "Rafael Torres",
    leadName: "Diego Carvalho",
    company: "Embraer",
    dueDate: "2026-05-23",
    stageLabel: "Contato Realizado",
    stageColor: "#22D3EE",
  },
]
