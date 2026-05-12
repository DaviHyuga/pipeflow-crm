import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * Retorna o stripe_customer_id do workspace.
 * Se não existir, cria um Customer no Stripe e salva no banco.
 */
export async function getOrCreateStripeCustomer(
  workspaceId: string,
  email: string,
  workspaceName: string
): Promise<string> {
  const supabase = await createServiceClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('stripe_customer_id')
    .eq('id', workspaceId)
    .single()

  if (workspace?.stripe_customer_id) {
    return workspace.stripe_customer_id
  }

  const customer = await stripe.customers.create({
    email,
    name: workspaceName,
    metadata: { workspace_id: workspaceId },
  })

  await supabase
    .from('workspaces')
    .update({ stripe_customer_id: customer.id })
    .eq('id', workspaceId)

  return customer.id
}
