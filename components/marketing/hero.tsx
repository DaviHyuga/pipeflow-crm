import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  { value: "+47%", label: "taxa de conversão", detail: "média dos clientes" },
  { value: "3.2x", label: "leads qualificados", detail: "no primeiro trimestre" },
  { value: "−62%", label: "ciclo de venda", detail: "tempo para fechar" },
  { value: "1.200+", label: "times ativos", detail: "em toda parte" },
]

function KanbanMockup() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[oklch(0.16_0_0)] shadow-2xl shadow-black/70 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[oklch(0.14_0_0)]">
        <div className="size-2.5 rounded-full bg-[#ff5f57]" />
        <div className="size-2.5 rounded-full bg-[#febc2e]" />
        <div className="size-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex items-center gap-2 flex-1">
          <div className="h-5 flex-1 max-w-40 rounded-md bg-white/5 flex items-center justify-center">
            <span className="text-[10px] text-white/30">PipeFlow CRM — Pipeline</span>
          </div>
        </div>
      </div>

      {/* Topbar with filters */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-[oklch(0.155_0_0)]">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-16 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-[9px] font-medium text-primary">Pipeline</span>
          </div>
          <div className="h-5 w-14 rounded-md bg-white/5 flex items-center justify-center">
            <span className="text-[9px] text-white/30">Leads</span>
          </div>
        </div>
        <div className="h-5 w-20 rounded-md bg-primary flex items-center justify-center">
          <span className="text-[9px] font-medium text-white">+ Novo negócio</span>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 p-4 overflow-hidden">
        {[
          {
            name: "Novo Lead", color: "text-blue-400", dot: "bg-blue-400", count: 3,
            cards: [
              { title: "Contrato Anual", co: "Empresa ABC", val: "R$ 12.000", hot: true },
              { title: "Setup Inicial", co: "Tech Solutions", val: "R$ 5.500", hot: false },
            ],
          },
          {
            name: "Proposta", color: "text-violet-400", dot: "bg-violet-400", count: 2,
            cards: [
              { title: "Licença Enterprise", co: "Global Corp", val: "R$ 48.000", hot: true },
              { title: "Consultoria", co: "StartupXYZ", val: "R$ 8.800", hot: false },
            ],
          },
          {
            name: "Fechado", color: "text-emerald-400", dot: "bg-emerald-400", count: 2,
            cards: [
              { title: "Plano Pro Anual", co: "Inovação Ltda", val: "R$ 22.000", hot: false },
              { title: "Integração API", co: "DevAgency", val: "R$ 15.000", hot: false },
            ],
          },
        ].map((col) => (
          <div key={col.name} className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-3">
              <div className={`size-1.5 rounded-full ${col.dot}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${col.color}`}>
                {col.name}
              </span>
              <span className="ml-auto text-[10px] text-white/30 bg-white/5 rounded-full w-4 h-4 flex items-center justify-center">
                {col.count}
              </span>
            </div>
            <div className="space-y-2">
              {col.cards.map((card) => (
                <div
                  key={card.title}
                  className={cn(
                    "rounded-lg border p-2.5 space-y-1.5 transition-colors",
                    card.hot
                      ? col.name === "Novo Lead"
                        ? "border-blue-500/25 bg-blue-500/6"
                        : "border-violet-500/25 bg-violet-500/6"
                      : "border-white/8 bg-white/3"
                  )}
                >
                  <div className="text-[11px] font-medium text-white/85">{card.title}</div>
                  <div className="text-[10px] text-white/40">{card.co}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold text-emerald-400/90">{card.val}</div>
                    <div className="size-3.5 rounded-full bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-5 px-4 py-3 border-t border-white/6 bg-[oklch(0.14_0_0)]">
        <div>
          <div className="text-[9px] text-white/30 mb-0.5">Pipeline total</div>
          <div className="text-[11px] font-semibold text-white/80">R$ 111.300</div>
        </div>
        <div className="h-5 w-px bg-white/8" />
        <div>
          <div className="text-[9px] text-white/30 mb-0.5">Negócios abertos</div>
          <div className="text-[11px] font-semibold text-white/80">7</div>
        </div>
        <div className="h-5 w-px bg-white/8" />
        <div>
          <div className="text-[9px] text-white/30 mb-0.5">Taxa de conversão</div>
          <div className="text-[11px] font-semibold text-emerald-400">34%</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-white/30">ao vivo</span>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <style>{`
        @keyframes mesh-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.05); }
          66% { transform: translate(-30px, 30px) scale(0.97); }
        }
        @keyframes mesh-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 50px) scale(1.03); }
          66% { transform: translate(40px, -20px) scale(0.98); }
        }
        @keyframes mockup-float {
          0%, 100% { transform: perspective(1200px) rotateX(2deg) translateY(0px); }
          50% { transform: perspective(1200px) rotateX(2deg) translateY(-12px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-el {
          opacity: 0;
          animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .mockup-wrapper {
          animation: mockup-float 8s ease-in-out infinite;
          transform-origin: center bottom;
        }
      `}</style>

      {/* Animated mesh background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/4 w-[900px] h-[900px] rounded-full opacity-[0.13] blur-[120px]"
          style={{ background: "oklch(0.62 0.22 265)", animation: "mesh-drift-1 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[100px]"
          style={{ background: "oklch(0.65 0.20 220)", animation: "mesh-drift-2 25s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full opacity-[0.06] blur-[80px]"
          style={{ background: "oklch(0.58 0.18 280)" }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Text content */}
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className="hero-el mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Mais de 1.200 times já fecham mais negócios com o PipeFlow
          </div>

          {/* Headline */}
          <h1
            className="hero-el max-w-4xl text-[2.6rem] font-black tracking-tighter text-foreground leading-[1.08] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            O CRM que seu time{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, oklch(0.72 0.22 265), oklch(0.78 0.18 230))" }}
            >
              vai realmente usar.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-el mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            Pipeline Kanban visual, gestão de leads integrada e métricas em tempo real.
            Sem curva de aprendizado. Sem planilha. Sem desculpa.
          </p>

          {/* CTAs */}
          <div
            className="hero-el mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 px-7 h-12 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              )}
            >
              Começar grátis agora
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 px-6 h-12 text-base border-white/15 hover:border-white/25 hover:bg-white/5"
              )}
            >
              <Play className="size-3.5 fill-current" />
              Ver como funciona
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p
            className="hero-el mt-4 text-xs text-muted-foreground/60"
            style={{ animationDelay: "320ms" }}
          >
            Grátis para sempre · Sem cartão de crédito · Setup em 2 minutos
          </p>
        </div>

        {/* Stats grid */}
        <div
          className="hero-el mx-auto mt-14 max-w-3xl"
          style={{ animationDelay: "400ms" }}
        >
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="flex flex-col items-center gap-1 bg-[oklch(0.17_0_0)] px-5 py-6 text-center"
              >
                <span
                  className="text-3xl font-black tracking-tighter bg-clip-text text-transparent sm:text-4xl"
                  style={{
                    backgroundImage: "linear-gradient(135deg, oklch(0.72 0.22 265), oklch(0.82 0.16 240))",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-foreground/80">{stat.label}</span>
                <span className="text-[10px] text-muted-foreground/60">{stat.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* App mockup */}
        <div
          className="hero-el relative mx-auto mt-16 max-w-4xl"
          style={{ animationDelay: "500ms" }}
        >
          {/* Glow halo behind mockup */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 rounded-3xl opacity-40"
            style={{
              background: "radial-gradient(ellipse at 50% 80%, oklch(0.62 0.22 265 / 0.35), transparent 65%)",
            }}
          />
          <div className="mockup-wrapper">
            <KanbanMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
