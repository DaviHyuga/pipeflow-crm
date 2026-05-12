import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, CheckCircle2, Settings2 } from 'lucide-react'
import { startCheckoutAction, openPortalAction } from './actions'

const FREE_LIMITS = { leads: 50, members: 2 }

const PRO_FEATURES = [
  'Leads ilimitados',
  'Membros ilimitados',
  'Pipeline Kanban completo',
  'Dashboard com métricas avançadas',
  'Suporte prioritário',
]

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

  // Contagens para exibir uso do plano Free
  const [{ count: leadsCount }, { count: membersCount }] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('workspace_members').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
  ])

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
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Faturamento</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Gerencie seu plano e assinatura.</p>
      </div>

      {/* Toast de sucesso */}
      {params.success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Assinatura ativada com sucesso! Bem-vindo ao plano Pro.
        </div>
      )}

      {/* Card: plano atual */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Plano atual</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant={isPro ? 'default' : 'outline'} className="capitalize">
                {isPro ? 'Pro' : 'Free'}
              </Badge>
              {willCancel && (
                <span className="text-xs text-muted-foreground">
                  Cancela em {renewalDate}
                </span>
              )}
              {isPro && !willCancel && renewalDate && (
                <span className="text-xs text-muted-foreground">
                  Renova em {renewalDate}
                </span>
              )}
            </div>
          </div>

          {isPro ? (
            <form action={openPortalAction}>
              <Button size="sm" variant="outline" className="h-8 gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                Gerenciar assinatura
              </Button>
            </form>
          ) : (
            <form action={startCheckoutAction}>
              <Button size="sm" className="h-8 gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Assinar Pro — R$49/mês
              </Button>
            </form>
          )}
        </div>

        {/* Uso do plano Free */}
        {!isPro && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">Uso do plano Free</p>
            <UsageBar label="Leads" used={leadsCount ?? 0} limit={FREE_LIMITS.leads} />
            <UsageBar label="Membros" used={membersCount ?? 0} limit={FREE_LIMITS.members} />
          </div>
        )}

        {/* Features do Pro */}
        {!isPro && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Com o plano Pro você terá:</p>
            <ul className="space-y-1.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100)
  const isWarning = pct >= 80

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={isWarning ? 'text-orange-500 font-medium' : ''}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isWarning ? 'bg-orange-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
