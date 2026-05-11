"use client"

import { useState } from "react"
import Link from "next/link"
import { Kanban, Users, BarChart3, ArrowRight, Check } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─── Mini mockups ───────────────────────────────────────────────── */

function KanbanPreview() {
  const cols = [
    { label: "Novo Lead", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20", deals: ["Contrato ABC", "Proposta XYZ"] },
    { label: "Negociação", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", deals: ["Enterprise Corp", "Startup BR"] },
    { label: "Fechado ✓", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", deals: ["Inovação Ltda"] },
  ]
  return (
    <div className="rounded-xl border border-white/10 bg-[oklch(0.15_0_0)] overflow-hidden h-full">
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[oklch(0.13_0_0)] border-b border-white/8">
        <div className="size-2 rounded-full bg-[#ff5f57]" />
        <div className="size-2 rounded-full bg-[#febc2e]" />
        <div className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-white/25">Pipeline Kanban</span>
      </div>
      <div className="flex gap-2.5 p-3">
        {cols.map((col) => (
          <div key={col.label} className="flex-1 min-w-0">
            <div className={`text-[9px] font-semibold uppercase tracking-wider mb-2 ${col.color}`}>{col.label}</div>
            {col.deals.map((deal) => (
              <div key={deal} className={`rounded-lg border p-2 mb-1.5 ${col.bg}`}>
                <div className="text-[10px] font-medium text-white/75">{deal}</div>
                <div className="text-[9px] text-white/35 mt-0.5">R$ {Math.floor(Math.random() * 40 + 8)}.000</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-white/6 bg-[oklch(0.13_0_0)] flex gap-4">
        <div><span className="text-[9px] text-white/30">Pipeline: </span><span className="text-[9px] font-semibold text-white/70">R$ 111k</span></div>
        <div><span className="text-[9px] text-white/30">Taxa: </span><span className="text-[9px] font-semibold text-emerald-400">34%</span></div>
      </div>
    </div>
  )
}

function LeadsPreview() {
  const leads = [
    { name: "Ana Oliveira", co: "TechBR", status: "Qualificado", statusColor: "text-blue-400 bg-blue-500/12 border-blue-500/20", val: "R$ 8.500" },
    { name: "Carlos Santos", co: "InnovaG", status: "Novo", statusColor: "text-muted-foreground bg-white/6 border-white/12", val: "R$ 12.000" },
    { name: "Maria Costa", co: "VendaMax", status: "Proposta", statusColor: "text-violet-400 bg-violet-500/12 border-violet-500/20", val: "R$ 25.000" },
    { name: "João Lima", co: "DigitalCo", status: "Fechado", statusColor: "text-emerald-400 bg-emerald-500/12 border-emerald-500/20", val: "R$ 4.200" },
  ]
  return (
    <div className="rounded-xl border border-white/10 bg-[oklch(0.15_0_0)] overflow-hidden h-full">
      <div className="flex items-center justify-between px-3 py-2.5 bg-[oklch(0.13_0_0)] border-b border-white/8">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-[#ff5f57]" />
          <div className="size-2 rounded-full bg-[#febc2e]" />
          <div className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[10px] text-white/25">Leads</span>
        </div>
        <div className="text-[9px] rounded-md bg-primary/20 border border-primary/30 px-2 py-0.5 text-primary">+ Novo Lead</div>
      </div>
      {/* Table header */}
      <div className="grid grid-cols-4 gap-2 px-3 py-1.5 border-b border-white/6">
        {["Nome", "Empresa", "Status", "Valor"].map((h) => (
          <div key={h} className="text-[9px] font-medium text-white/30 uppercase tracking-wider">{h}</div>
        ))}
      </div>
      {leads.map((lead) => (
        <div key={lead.name} className="grid grid-cols-4 gap-2 px-3 py-2 border-b border-white/5 hover:bg-white/3 transition-colors">
          <div className="text-[10px] font-medium text-white/80 truncate">{lead.name}</div>
          <div className="text-[10px] text-white/40 truncate">{lead.co}</div>
          <div>
            <span className={`text-[9px] rounded-md border px-1.5 py-0.5 ${lead.statusColor}`}>{lead.status}</span>
          </div>
          <div className="text-[10px] font-semibold text-emerald-400/80">{lead.val}</div>
        </div>
      ))}
    </div>
  )
}

function DashboardPreview() {
  const metrics = [
    { label: "Leads", value: "248", delta: "+12%", up: true },
    { label: "Pipeline", value: "R$ 387k", delta: "+8%", up: true },
    { label: "Conversão", value: "34%", delta: "+5pp", up: true },
    { label: "Ciclo médio", value: "18d", delta: "−4d", up: true },
  ]
  const bars = [45, 60, 52, 78, 65, 88, 72]
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
  return (
    <div className="rounded-xl border border-white/10 bg-[oklch(0.15_0_0)] overflow-hidden h-full">
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[oklch(0.13_0_0)] border-b border-white/8">
        <div className="size-2 rounded-full bg-[#ff5f57]" />
        <div className="size-2 rounded-full bg-[#febc2e]" />
        <div className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-white/25">Dashboard</span>
      </div>
      <div className="p-3 space-y-3">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-white/8 bg-white/3 p-2">
              <div className="text-[9px] text-white/35 mb-0.5">{m.label}</div>
              <div className="text-[11px] font-bold text-white/85">{m.value}</div>
              <div className="text-[9px] text-emerald-400/80">{m.delta}</div>
            </div>
          ))}
        </div>
        {/* Bar chart */}
        <div className="rounded-lg border border-white/8 bg-white/3 p-2.5">
          <div className="text-[9px] text-white/35 mb-2">Negócios por dia</div>
          <div className="flex items-end gap-1 h-12">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className="w-full rounded-sm bg-primary/60"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[7px] text-white/25">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Tab data ───────────────────────────────────────────────────── */

const tabs = [
  {
    id: "pipeline",
    icon: Kanban,
    label: "Pipeline Kanban",
    headline: "Visualize e controle todo o seu funil de vendas",
    description:
      "Arraste negócios entre etapas com drag-and-drop. Veja o valor acumulado por coluna e identifique gargalos em segundos — sem precisar abrir nenhum relatório.",
    benefits: [
      "Drag-and-drop entre etapas em tempo real",
      "Valor total e contagem por coluna",
      "Criação rápida de negócios em qualquer etapa",
    ],
    preview: <KanbanPreview />,
  },
  {
    id: "leads",
    icon: Users,
    label: "Gestão de Leads",
    headline: "Todos os seus contatos organizados, com histórico completo",
    description:
      "Cadastre leads, registre ligações, e-mails e reuniões. A timeline de atividades garante que seu time nunca perca o contexto de uma negociação — mesmo semanas depois.",
    benefits: [
      "Busca e filtros por status, responsável e data",
      "Timeline completa de interações por lead",
      "Formulário rápido para novos contatos",
    ],
    preview: <LeadsPreview />,
  },
  {
    id: "dashboard",
    icon: BarChart3,
    label: "Dashboard de Métricas",
    headline: "Decisões baseadas em dados, não em achismo",
    description:
      "Acompanhe taxa de conversão, valor do pipeline e ciclo de venda em um dashboard atualizado em tempo real. Identifique o que está funcionando — e o que precisa de atenção.",
    benefits: [
      "4 métricas-chave sempre à vista",
      "Gráfico de negócios por período",
      "Comparativo com o período anterior",
    ],
    preview: <DashboardPreview />,
  },
]

/* ─── Component ──────────────────────────────────────────────────── */

export function Features() {
  const [active, setActive] = useState("pipeline")
  const current = tabs.find((t) => t.id === active)!

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            Funcionalidades
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Uma plataforma, resultado em{" "}
            <span className="hero-gradient-text">
              todo o funil
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Do primeiro contato ao contrato assinado — tudo em um lugar. Sem exportar planilha, sem perder contexto.
          </p>
        </div>

        {/* Tab bar (mobile) */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 lg:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
                active === tab.id
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main layout: tabs left + mockup right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left: tab list */}
          <div className="hidden lg:flex flex-col gap-2 lg:col-span-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "group w-full text-left rounded-2xl border p-5 transition-all duration-300",
                  active === tab.id
                    ? "border-primary/30 bg-primary/6 shadow-lg shadow-primary/8"
                    : "border-border bg-card hover:border-primary/20 hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      active === tab.id
                        ? "border-primary/30 bg-primary/15 text-primary"
                        : "border-border bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <tab.icon className="size-4" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      active === tab.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </span>
                  {active === tab.id && (
                    <div className="ml-auto size-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs leading-relaxed transition-colors",
                    active === tab.id ? "text-muted-foreground" : "text-muted-foreground/50"
                  )}
                >
                  {tab.description.slice(0, 80)}…
                </p>
              </button>
            ))}
          </div>

          {/* Right: content + mockup */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Description */}
            <div key={active} className="animate-in fade-in slide-in-from-bottom-3 duration-400">
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {current.headline}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {current.description}
              </p>
              <ul className="mt-5 space-y-2.5">
                {current.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/25">
                      <Check className="size-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "sm" }), "mt-6 gap-1.5")}
              >
                Experimentar grátis
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Mockup */}
            <div className="relative min-h-72 sm:min-h-80">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-400",
                    active === tab.id
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-3 pointer-events-none"
                  )}
                >
                  <div className="relative">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-3 rounded-2xl opacity-30"
                      style={{ background: "radial-gradient(ellipse at 50% 100%, oklch(0.62 0.22 265 / 0.3), transparent 65%)" }}
                    />
                    {tab.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
