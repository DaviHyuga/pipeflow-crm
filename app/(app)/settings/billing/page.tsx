import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { Badge } from '@/components/ui/badge'
import { CheckoutButton, PortalButton } from '@/components/settings/billing-buttons'
import {
  CheckCircle2,
  Users,
  BookMarked,
  Kanban,
  BarChart3,
  Mail,
  Star,
  Zap,
} from 'lucide-react'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const supabase = await createClient()

  const [{ data: workspace }, { data: subscription }, params] = await Promise.all([
    supabase
      .from('workspaces')
      .select('name, plan, stripe_customer_id')
      .eq('id', workspaceId)
      .single(),
    supabase
      .from('subscriptions')
      .select('status, current_period_end, cancel_at_period_end')
      .eq('workspace_id', workspaceId)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    searchParams,
  ])

  if (!workspace) redirect('/create-workspace')

  const plan = workspace.plan as 'free' | 'pro'
  const isPro = plan === 'pro'
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null
  const willCancel = subscription?.cancel_at_period_end === true

  return (
    <div className="space-y-6">
      {/* Toast de sucesso */}
      {params.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Assinatura ativada com sucesso! Bem-vindo ao plano Pro.
        </div>
      )}

      {/* Card: plano atual */}
      <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Plano atual</span>
            <Badge variant={isPro ? 'default' : 'outline'} className="capitalize">
              {isPro ? 'Pro' : 'Free'}
            </Badge>
            {willCancel && renewalDate && (
              <span className="text-xs text-muted-foreground">· Cancela em {renewalDate}</span>
            )}
            {isPro && !willCancel && renewalDate && (
              <span className="text-xs text-muted-foreground">· Renova em {renewalDate}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {isPro
              ? 'Leads e membros ilimitados. Suporte prioritário.'
              : 'Até 2 membros e 50 leads. Ideal para começar.'}
          </p>
        </div>

        {isPro ? (
          <PortalButton />
        ) : (
          <CheckoutButton />
        )}
      </div>

      {/* Comparação de planos */}
      {!isPro && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-foreground">Compare os planos</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm font-semibold text-foreground">Free</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-black text-foreground">R$0</span>
                <span className="mb-1 text-sm text-muted-foreground">/mês</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Para freelancers começando</p>

              <ul className="mt-5 space-y-3">
                <FeatureRow icon={Users} label="Membros da equipe:" value="Até 2" />
                <FeatureRow icon={BookMarked} label="Leads:" value="Até 50" />
                <FeatureRow icon={Kanban} label="Pipeline Kanban:" check />
                <FeatureRow icon={BarChart3} label="Dashboard de métricas:" check />
                <FeatureRow icon={Mail} label="Convites por e-mail:" check />
                <FeatureRow icon={Zap} label="Suporte prioritário:" dash />
              </ul>
            </div>

            {/* Pro */}
            <div className="relative rounded-xl border border-primary/40 bg-card p-6 shadow-lg shadow-primary/5">
              {/* Badge recomendado */}
              <div className="absolute -top-3 right-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Star className="h-3 w-3" />
                  Recomendado
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground">Pro</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-black text-foreground">R$49</span>
                <span className="mb-1 text-sm text-muted-foreground">/mês</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Para equipes em crescimento</p>

              <ul className="mt-5 space-y-3">
                <FeatureRow icon={Users} label="Membros da equipe:" unlimited />
                <FeatureRow icon={BookMarked} label="Leads:" unlimited />
                <FeatureRow icon={Kanban} label="Pipeline Kanban:" check />
                <FeatureRow icon={BarChart3} label="Dashboard de métricas:" check />
                <FeatureRow icon={Mail} label="Convites por e-mail:" check />
                <FeatureRow icon={Zap} label="Suporte prioritário:" check />
              </ul>

              <CheckoutButton className="mt-6" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureRow({
  icon: Icon,
  label,
  value,
  check,
  dash,
  unlimited,
}: {
  icon: React.ElementType
  label: string
  value?: string
  check?: boolean
  dash?: boolean
  unlimited?: boolean
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <span className="text-sm">
        {unlimited ? (
          <span className="font-semibold text-primary">Ilimitados</span>
        ) : value ? (
          <span className="font-medium text-foreground">{value}</span>
        ) : check ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : dash ? (
          <span className="text-muted-foreground/50">—</span>
        ) : null}
      </span>
    </li>
  )
}
