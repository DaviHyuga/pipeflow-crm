import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import type { Lead, Activity, LeadStatus, ActivityType } from '@/types/lead'
import type { LeadRow, ActivityRow, LeadInsert, LeadUpdate, ActivityInsert } from '@/src/types/supabase'

export async function getWorkspaceId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(WORKSPACE_COOKIE)?.value ?? null
}

function rowToLead(row: LeadRow, ownerDisplay: string): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    phone: row.phone ?? '',
    company: row.company ?? '',
    role: row.role ?? '',
    status: row.status as LeadStatus,
    owner: ownerDisplay,
    notes: row.notes ?? '',
    estimatedValue: Number(row.estimated_value ?? 0),
    createdAt: row.created_at.split('T')[0],
    activities: [],
  }
}

function rowToActivity(row: ActivityRow, authorDisplay: string): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type as ActivityType,
    title: row.title,
    description: row.description ?? '',
    date: row.created_at.split('T')[0],
    scheduledDate: row.scheduled_date ?? '',
    author: authorDisplay,
  }
}

export async function getLeads(
  workspaceId: string,
  opts?: { q?: string; status?: string },
): Promise<Lead[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  let query = supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (opts?.status && opts.status !== 'all') {
    query = query.eq('status', opts.status as LeadStatus)
  }
  if (opts?.q) {
    // Sanitize: remove PostgREST filter-injection characters before interpolation
    const q = opts.q.trim().replace(/[%_,.()*[\]]/g, '')
    if (q) query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%` as string)
  }

  const { data } = await query
  return (data ?? []).map((row) => rowToLead(row, ownerDisplay))
}

export async function getLead(workspaceId: string, leadId: string): Promise<Lead | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', leadId)
    .single()

  if (error || !data) return null

  const { data: actData } = await supabase
    .from('activities')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  const activities = (actData ?? []).map((a) => rowToActivity(a, ownerDisplay))
  return { ...rowToLead(data, ownerDisplay), activities }
}

export async function createLead(
  workspaceId: string,
  userId: string,
  fields: {
    name: string
    email?: string
    phone?: string
    company?: string
    role?: string
    status?: string
    notes?: string
    estimatedValue?: number
  },
): Promise<Lead | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  const insert: LeadInsert = {
    workspace_id: workspaceId,
    owner_id: userId,
    name: fields.name,
    email: fields.email || null,
    phone: fields.phone || null,
    company: fields.company || null,
    role: fields.role || null,
    status: (fields.status as LeadStatus) ?? 'novo',
    notes: fields.notes || null,
    estimated_value: fields.estimatedValue ?? 0,
  }

  const { data, error } = await supabase.from('leads').insert(insert).select().single()
  if (error || !data) return null
  return rowToLead(data, ownerDisplay)
}

export async function updateLead(
  workspaceId: string,
  leadId: string,
  fields: {
    name?: string
    email?: string
    phone?: string
    company?: string
    role?: string
    status?: string
    notes?: string
    estimatedValue?: number
  },
): Promise<Lead | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  const update: LeadUpdate = {}
  if (fields.name !== undefined) update.name = fields.name
  if (fields.email !== undefined) update.email = fields.email || null
  if (fields.phone !== undefined) update.phone = fields.phone || null
  if (fields.company !== undefined) update.company = fields.company || null
  if (fields.role !== undefined) update.role = fields.role || null
  if (fields.status !== undefined) update.status = fields.status as LeadStatus
  if (fields.notes !== undefined) update.notes = fields.notes || null
  if (fields.estimatedValue !== undefined) update.estimated_value = fields.estimatedValue

  const { data, error } = await supabase
    .from('leads')
    .update(update)
    .eq('workspace_id', workspaceId)
    .eq('id', leadId)
    .select()
    .single()

  if (error || !data) return null
  return rowToLead(data, ownerDisplay)
}

export async function deleteLead(workspaceId: string, leadId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('leads').delete().eq('workspace_id', workspaceId).eq('id', leadId)
}

export async function createActivity(
  workspaceId: string,
  userId: string,
  fields: { leadId: string; type: string; title: string; description?: string; scheduledDate?: string },
): Promise<void> {
  const supabase = await createClient()

  const insert: ActivityInsert = {
    workspace_id: workspaceId,
    lead_id: fields.leadId,
    user_id: userId,
    type: fields.type as ActivityType,
    title: fields.title,
    description: fields.description || null,
    scheduled_date: fields.scheduledDate || null,
  }

  await supabase.from('activities').insert(insert)
}
