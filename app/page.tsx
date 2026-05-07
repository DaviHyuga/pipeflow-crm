import type { Metadata } from "next"
import { Navbar } from "@/components/marketing/navbar"
import { Hero } from "@/components/marketing/hero"
import { LogoStrip } from "@/components/marketing/logo-strip"
import { Features } from "@/components/marketing/features"
import { Testimonials } from "@/components/marketing/testimonials"
import { Pricing } from "@/components/marketing/pricing"
import { CTASection } from "@/components/marketing/cta-section"
import { Footer } from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "PipeFlow CRM — Feche mais negócios em menos tempo",
  description:
    "CRM visual com pipeline Kanban, gestão de leads e métricas em tempo real. Simples para freelancers, poderoso para equipes. Comece grátis hoje.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <Features />
        <Testimonials />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
