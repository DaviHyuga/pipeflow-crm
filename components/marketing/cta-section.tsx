import Link from "next/link"
import { ArrowRight, Clock, CreditCard, Users } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const trustItems = [
  { icon: Clock, label: "Setup em 2 minutos", detail: "Sem instalação, sem onboarding" },
  { icon: CreditCard, label: "Sem cartão de crédito", detail: "Plano grátis para sempre" },
  { icon: Users, label: "+1.200 times", detail: "Já fecham mais com PipeFlow" },
]

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 px-8 py-20 text-center sm:px-16">
          {/* Animated glow layers */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.62 0.22 265 / 0.4), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background: "radial-gradient(ellipse 50% 40% at 50% 100%, oklch(0.62 0.22 265 / 0.3), transparent 65%)",
            }}
          />
          {/* Grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Comece grátis hoje — sem compromisso
            </div>

            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl max-w-2xl mx-auto leading-tight">
              Pronto para fechar{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, oklch(0.72 0.22 265), oklch(0.82 0.16 240))" }}
              >
                mais negócios?
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
              Junte-se a mais de 1.200 times de vendas que já trocaram planilha por clareza, velocidade e resultado com o PipeFlow.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 px-7 h-12 text-base font-semibold shadow-xl shadow-primary/35 hover:shadow-primary/55 transition-shadow"
                )}
              >
                Criar conta grátis
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "h-12 px-6 text-base text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 hover:bg-white/5"
                )}
              >
                Já tenho conta
              </Link>
            </div>

            {/* Trust items */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <item.icon className="size-3.5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-foreground">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground/60">{item.detail}</div>
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
