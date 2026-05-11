import type { Metadata } from "next"
import { Pricing } from "@/components/marketing/pricing"
import { CTASection } from "@/components/marketing/cta-section"

export const metadata: Metadata = {
  title: "Preços — PipeFlow CRM",
  description: "Planos Free e Pro para times de todos os tamanhos. Comece gratuitamente.",
}

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <CTASection />
    </>
  )
}
