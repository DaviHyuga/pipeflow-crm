import { notFound } from "next/navigation"
import { mockLeads } from "@/lib/mock/leads"
import { LeadDetailView } from "@/components/leads/lead-detail-view"

interface LeadPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadPage({ params }: LeadPageProps) {
  const { id } = await params
  const lead = mockLeads.find((l) => l.id === id)

  if (!lead) {
    notFound()
  }

  return <LeadDetailView lead={lead} />
}

export function generateStaticParams() {
  return mockLeads.map((lead) => ({ id: lead.id }))
}
