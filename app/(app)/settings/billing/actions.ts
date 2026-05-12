'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe'

async function getWorkspaceOrRedirect() {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, plan, stripe_customer_id')
    .eq('id', workspaceId)
    .single()

  if (!workspace) redirect('/create-workspace')

  return { workspaceId, user, workspace }
}

export async function startCheckoutAction() {
  const { workspaceId, user, workspace } = await getWorkspaceOrRedirect()

  if (workspace.plan === 'pro') redirect('/settings/billing')

  const customerId = await getOrCreateStripeCustomer(
    workspaceId,
    user.email!,
    workspace.name
  )

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    metadata: { workspace_id: workspaceId },
    subscription_data: {
      metadata: { workspace_id: workspaceId },
    },
  })

  redirect(session.url!)
}

export async function openPortalAction() {
  const { workspace } = await getWorkspaceOrRedirect()

  if (!workspace.stripe_customer_id) redirect('/settings/billing')

  const session = await stripe.billingPortal.sessions.create({
    customer: workspace.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })

  redirect(session.url)
}
