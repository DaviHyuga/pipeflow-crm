import { createClient } from '@/lib/supabase/server'
import type { Deal, StageId } from '@/types/pipeline'
import type { DealRow, DealInsert, DealUpdate, DealStage } from '@/src/types/supabase'

function rowToDeal(
  row: DealRow,
  leadName: string,
  leadCompany: string,
  ownerDisplay: string,
): Deal {
  return {
    id: row.id,
    title: row.title,
    value: Number(row.value),
    leadId: row.lead_id ?? '',
    leadName,
    leadCompany,
    owner: ownerDisplay,
    dueDate: row.due_date ?? '',
    stageId: row.stage as StageId,
  }
}

export async function getDeals(workspaceId: string): Promise<Deal[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  const { data: dealsData } = await supabase
    .from('deals')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('position', { ascending: true })

  if (!dealsData || dealsData.length === 0) return []

  const leadIds = [...new Set(dealsData.filter((d) => d.lead_id).map((d) => d.lead_id!))]

  const { data: leadsData } =
    leadIds.length > 0
      ? await supabase.from('leads').select('id, name, company').in('id', leadIds)
      : { data: [] }

  const leadsMap = new Map((leadsData ?? []).map((l) => [l.id, l]))

  return dealsData.map((row) => {
    const lead = row.lead_id ? leadsMap.get(row.lead_id) : null
    return rowToDeal(row, lead?.name ?? '', lead?.company ?? '', ownerDisplay)
  })
}

export async function createDeal(
  workspaceId: string,
  userId: string,
  fields: {
    title: string
    value: number
    stage: string
    leadId?: string
    dueDate?: string
  },
): Promise<Deal | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const ownerDisplay = user?.email?.split('@')[0] ?? ''

  // Get max position for the target stage
  const { data: maxPos } = await supabase
    .from('deals')
    .select('position')
    .eq('workspace_id', workspaceId)
    .eq('stage', fields.stage as DealStage)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const position = maxPos ? maxPos.position + 1 : 0

  const insert: DealInsert = {
    workspace_id: workspaceId,
    owner_id: userId,
    title: fields.title,
    value: fields.value,
    stage: fields.stage as DealStage,
    lead_id: fields.leadId || null,
    due_date: fields.dueDate || null,
    notes: null,
    position,
  }

  const { data, error } = await supabase.from('deals').insert(insert).select().single()
  if (error || !data) return null

  let leadName = ''
  let leadCompany = ''
  if (data.lead_id) {
    const { data: lead } = await supabase
      .from('leads')
      .select('name, company')
      .eq('id', data.lead_id)
      .single()
    leadName = lead?.name ?? ''
    leadCompany = lead?.company ?? ''
  }

  return rowToDeal(data, leadName, leadCompany, ownerDisplay)
}

export async function updateDeal(
  workspaceId: string,
  dealId: string,
  fields: {
    title?: string
    value?: number
    stage?: string
    leadId?: string | null
    dueDate?: string
  },
): Promise<void> {
  const supabase = await createClient()

  const update: DealUpdate = {}
  if (fields.title !== undefined) update.title = fields.title
  if (fields.value !== undefined) update.value = fields.value
  if (fields.stage !== undefined) update.stage = fields.stage as DealStage
  if (fields.leadId !== undefined) update.lead_id = fields.leadId
  if (fields.dueDate !== undefined) update.due_date = fields.dueDate || null

  await supabase
    .from('deals')
    .update(update)
    .eq('workspace_id', workspaceId)
    .eq('id', dealId)
}

export async function updateDealStage(
  workspaceId: string,
  dealId: string,
  stage: string,
  position: number,
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('deals')
    .update({ stage: stage as DealStage, position })
    .eq('workspace_id', workspaceId)
    .eq('id', dealId)
}

export async function deleteDeal(workspaceId: string, dealId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('deals').delete().eq('workspace_id', workspaceId).eq('id', dealId)
}
