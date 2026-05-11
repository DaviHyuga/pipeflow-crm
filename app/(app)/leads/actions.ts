'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { createLead, updateLead, deleteLead, createActivity } from '@/lib/leads'
import type { Lead } from '@/types/lead'

async function getContext(): Promise<{ userId: string; workspaceId: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  return { userId: user.id, workspaceId }
}

export async function createLeadAction(data: {
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: string
}): Promise<Lead | null> {
  const { userId, workspaceId } = await getContext()
  const lead = await createLead(workspaceId, userId, data)
  revalidatePath('/leads')
  return lead
}

export async function updateLeadAction(
  leadId: string,
  data: {
    name: string
    email: string
    phone: string
    company: string
    role: string
    status: string
  },
): Promise<Lead | null> {
  const { workspaceId } = await getContext()
  const lead = await updateLead(workspaceId, leadId, data)
  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  return lead
}

export async function deleteLeadAction(leadId: string): Promise<void> {
  const { workspaceId } = await getContext()
  await deleteLead(workspaceId, leadId)
  revalidatePath('/leads')
}

export async function createActivityAction(data: {
  leadId: string
  type: string
  title: string
  description: string
}): Promise<void> {
  const { userId, workspaceId } = await getContext()
  await createActivity(workspaceId, userId, data)
  revalidatePath(`/leads/${data.leadId}`)
}
