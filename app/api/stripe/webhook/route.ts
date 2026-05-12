import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

// Webhook precisa do body raw para verificar a assinatura — único Route Handler do projeto.
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const workspaceId = session.metadata?.workspace_id
      if (!workspaceId) break

      const subscriptionId = session.subscription as string
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      await upsertSubscription(supabase, workspaceId, subscription)
      await supabase
        .from('workspaces')
        .update({ plan: 'pro', stripe_subscription_id: subscriptionId })
        .eq('id', workspaceId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const workspaceId = subscription.metadata?.workspace_id
      if (!workspaceId) break

      await upsertSubscription(supabase, workspaceId, subscription)

      const isActive = ['active', 'trialing'].includes(subscription.status)
      await supabase
        .from('workspaces')
        .update({ plan: isActive ? 'pro' : 'free' })
        .eq('id', workspaceId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const workspaceId = subscription.metadata?.workspace_id
      if (!workspaceId) break

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id)

      await supabase
        .from('workspaces')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', workspaceId)
      break
    }
  }

  return NextResponse.json({ received: true })
}

// Cria ou atualiza a linha na tabela subscriptions espelhando o estado do Stripe
async function upsertSubscription(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  workspaceId: string,
  sub: Stripe.Subscription
) {
  const priceId = sub.items.data[0]?.price.id ?? ''
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  // No Stripe v22, current_period_* foram movidos para o nível do SubscriptionItem
  const item = sub.items.data[0]
  const periodStart = item?.current_period_start
  const periodEnd = item?.current_period_end

  await supabase.from('subscriptions').upsert(
    {
      workspace_id: workspaceId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      stripe_price_id: priceId,
      status: sub.status,
      plan: 'pro',
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
    },
    { onConflict: 'stripe_subscription_id' }
  )
}
