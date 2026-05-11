'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { createDeal, updateDeal, updateDealStage, deleteDeal } from '@/lib/deals'
import type { Deal } from '@/types/pipeline'

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

export async function createDealAction(data: {
  title: string
  value: number
  stage: string
  leadId: string
  dueDate: string
}): Promise<Deal | null> {
  const { userId, workspaceId } = await getContext()
  const deal = await createDeal(workspaceId, userId, data)
  revalidatePath('/pipeline')
  return deal
}

export async function updateDealAction(data: {
  id: string
  title: string
  value: number
  stage: string
  leadId: string
  dueDate: string
}): Promise<void> {
  const { workspaceId } = await getContext()
  await updateDeal(workspaceId, data.id, {
    title: data.title,
    value: data.value,
    stage: data.stage,
    leadId: data.leadId || null,
    dueDate: data.dueDate,
  })
  revalidatePath('/pipeline')
}

export async function updateDealStageAction(
  dealId: string,
  stage: string,
  position: number,
): Promise<void> {
  const { workspaceId } = await getContext()
  await updateDealStage(workspaceId, dealId, stage, position)
}

export async function deleteDealAction(dealId: string): Promise<void> {
  const { workspaceId } = await getContext()
  await deleteDeal(workspaceId, dealId)
  revalidatePath('/pipeline')
}
