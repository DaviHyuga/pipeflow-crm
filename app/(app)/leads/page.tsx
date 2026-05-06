import { mockLeads } from "@/lib/mock/leads"
import { LeadsView } from "@/components/leads/leads-view"

export default function LeadsPage() {
  return <LeadsView initialLeads={mockLeads} />
}
