import Link from "next/link"
import { Check, Minus, Zap, Shield } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    description: "Para freelancers e quem está começando a organizar as vendas.",
    cta: "Começar grátis",
    ctaHref: "/signup",
    highlighted: false,
    features: [
      { label: "Até 2 colaboradores", included: true },
      { label: "Até 50 leads", included: true },
      { label: "Pipeline Kanban completo", included: true },
      { label: "Dashboard de métricas", included: true },
      { label: "Timeline de atividades", included: true },
      { label: "Colaboradores ilimitados", included: false },
      { label: "Leads ilimitados", included: false },
      { label: "Multi-workspace", included: false },
      { label: "Relatórios avançados", included: false },
      { label: "Suporte prioritário", included: false },
    ],
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para times que precisam de escala, visibilidade e mais poder de venda.",
    cta: "Assinar Pro",
    ctaHref: "/signup?plan=pro",
    highlighted: true,
    badge: "Mais popular",
    features: [
      { label: "Colaboradores ilimitados", included: true },
      { label: "Leads ilimitados", included: true },
      { label: "Pipeline Kanban completo", included: true },
      { label: "Dashboard de métricas", included: true },
      { label: "Timeline de atividades", included: true },
      { label: "Multi-workspace", included: true },
      { label: "Relatórios avançados", included: true },
      { label: "Exportação CSV/Excel", included: true },
      { label: "API de integração", included: true },
      { label: "Suporte prioritário", included: true },
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            Planos e Preços
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Preço justo para todo tamanho de time
          </h2>
          <p className="mt-4 text-muted-foreground">
            Comece grátis hoje. Faça upgrade quando precisar. Sem surpresas na fatura, sem fidelidade.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 transition-all duration-300",
                plan.highlighted
                  ? "border-primary/40 bg-primary/5 shadow-2xl shadow-primary/12"
                  : "border-white/8 bg-card hover:border-white/14"
              )}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/40">
                    <Zap className="size-3 fill-current" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan name + description */}
              <div className="mb-7">
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{plan.description}</p>

                {/* Price */}
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-5xl font-black tracking-tight text-foreground">{plan.price}</span>
                  <span className="mb-1.5 text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features list */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25">
                        <Check className="size-2.5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/4 border border-white/8">
                        <Minus className="size-2.5 text-white/20" />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feature.included ? "text-foreground" : "text-muted-foreground/40"
                      )}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={cn(
                  buttonVariants({
                    variant: plan.highlighted ? "default" : "outline",
                    size: "sm",
                  }),
                  "w-full justify-center py-3 text-sm font-semibold",
                  plan.highlighted && "shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust guarantee */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground/40" />
            Sem cartão de crédito
          </div>
          <div className="h-1 w-1 rounded-full bg-white/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground/40" />
            Cancele a qualquer momento
          </div>
          <div className="h-1 w-1 rounded-full bg-white/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground/40" />
            Dados protegidos com SSL
          </div>
        </div>
      </div>
    </section>
  )
}
