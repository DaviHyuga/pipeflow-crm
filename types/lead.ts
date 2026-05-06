export type LeadStatus =
  | "novo"
  | "contactado"
  | "qualificado"
  | "proposta"
  | "fechado"
  | "perdido"

export type ActivityType = "ligacao" | "email" | "reuniao" | "nota"

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  title: string
  description: string
  date: string
  author: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  owner: string
  createdAt: string
  activities: Activity[]
}
