import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Triplicamos nossa taxa de fechamento em 90 dias. O PipeFlow transformou a forma como nosso time enxerga o pipeline — finalmente conseguimos prever receita com precisão.",
    name: "Rafael Menezes",
    role: "VP de Vendas",
    company: "TechFlow BR",
    initials: "RM",
    color: "from-blue-500 to-blue-600",
    metric: "+340%",
    metricLabel: "taxa de fechamento",
  },
  {
    quote:
      "Setup em 10 minutos e já estávamos movendo deals. Nosso time adorou — é o único CRM que as pessoas abrem por conta própria, sem precisar cobrar ninguém.",
    name: "Camila Torres",
    role: "Gerente Comercial",
    company: "GrowthLab",
    initials: "CT",
    color: "from-violet-500 to-violet-600",
    metric: "10 min",
    metricLabel: "para o time estar operando",
  },
  {
    quote:
      "ROI positivo já no primeiro mês. Deixamos de usar planilha e e-mail para gerenciar clientes. Agora temos visibilidade real do que está acontecendo no funil.",
    name: "Diego Carvalho",
    role: "CEO",
    company: "SalesEdge",
    initials: "DC",
    color: "from-emerald-500 to-emerald-600",
    metric: "1º mês",
    metricLabel: "ROI positivo",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      {/* Subtle section bg */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.62 0.22 265 / 0.06), transparent)" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-xl text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
              Depoimentos
            </p>
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Times que fecham mais com PipeFlow
            </h2>
            <p className="mt-4 text-muted-foreground">
              Mais de 1.200 times de vendas já trocaram planilha e confusão por clareza e resultado.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group relative flex flex-col rounded-2xl border border-white/8 bg-card p-7 transition-all duration-300 hover:border-white/16 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Metric highlight */}
                <div className="flex items-center gap-3 mb-6 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                  <div>
                    <div
                      className={`text-xl font-black tracking-tight bg-gradient-to-br ${t.color} bg-clip-text text-transparent`}
                    >
                      {t.metric}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60">{t.metricLabel}</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/8">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white shadow-lg`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
