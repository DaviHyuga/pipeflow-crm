import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export default async function BillingPage() {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const supabase = await createClient()
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  const plan = (workspace?.plan ?? 'free') as 'free' | 'pro'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Faturamento</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Gerencie seu plano e assinatura.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Plano atual</p>
            <div className="mt-1">
              <Badge variant={plan === 'pro' ? 'default' : 'outline'}>
                {plan === 'pro' ? 'Pro' : 'Free'}
              </Badge>
            </div>
          </div>
          {plan === 'free' && (
            <Button size="sm" className="h-8 gap-1.5" disabled>
              <Zap className="h-3.5 w-3.5" />
              Upgrade para Pro
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          O checkout Stripe será implementado no Milestone 11. Fique atento!
        </div>

        {plan === 'free' && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Limites do plano Free</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Até 2 membros por workspace</li>
              <li>Até 50 leads</li>
              <li>Pipeline Kanban completo</li>
              <li>Dashboard com métricas</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
