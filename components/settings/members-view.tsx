'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InviteMemberModal } from '@/components/settings/invite-member-modal'
import { removeMemberAction, cancelInviteAction } from '@/lib/workspace-actions'
import { UserPlus, UserMinus, X, AlertTriangle } from 'lucide-react'
import type { MemberWithEmail } from '@/lib/members'
import type { PendingInvite } from '@/lib/invites'

const FREE_MEMBER_LIMIT = 2

interface MembersViewProps {
  members: MemberWithEmail[]
  invites: PendingInvite[]
  currentUserId: string
  currentUserRole: 'admin' | 'member'
  plan: 'free' | 'pro'
  workspaceName: string
}

export function MembersView({
  members,
  invites,
  currentUserId,
  currentUserRole,
  plan,
  workspaceName,
}: MembersViewProps) {
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [, startTransition] = useTransition()

  const isAdmin = currentUserRole === 'admin'
  const atFreeLimitWarning = plan === 'free' && members.length >= FREE_MEMBER_LIMIT

  function handleRemove(memberId: string) {
    setRemovingId(memberId)
    setActionError('')
    startTransition(async () => {
      const result = await removeMemberAction(memberId)
      setRemovingId(null)
      if (result?.error) {
        setActionError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  function handleCancelInvite(inviteId: string) {
    setCancelingId(inviteId)
    setActionError('')
    startTransition(async () => {
      const result = await cancelInviteAction(inviteId)
      setCancelingId(null)
      if (result?.error) {
        setActionError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Membros</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {members.length} membro{members.length !== 1 ? 's' : ''}
            {plan === 'free' && (
              <span className="ml-1 text-muted-foreground/70">
                · {FREE_MEMBER_LIMIT - members.length > 0
                  ? `${FREE_MEMBER_LIMIT - members.length} vaga${FREE_MEMBER_LIMIT - members.length !== 1 ? 's' : ''} restante${FREE_MEMBER_LIMIT - members.length !== 1 ? 's' : ''} no plano Free`
                  : 'limite do plano Free atingido'}
              </span>
            )}
          </p>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setInviteOpen(true)}
            disabled={atFreeLimitWarning}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Convidar membro
          </Button>
        )}
      </div>

      {/* Erro de ação */}
      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {/* Aviso limite Free */}
      {atFreeLimitWarning && isAdmin && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            O plano Free permite até {FREE_MEMBER_LIMIT} membros.{' '}
            <a href="/settings/billing" className="font-medium underline underline-offset-2">
              Faça upgrade para Pro
            </a>{' '}
            para convidar mais pessoas.
          </span>
        </div>
      )}

      {/* Tabela de membros */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                Membro
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                Papel
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
                Entrou em
              </th>
              {isAdmin && <th className="px-4 py-2.5 w-10" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {m.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground leading-none">
                        {m.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.email}</p>
                    </div>
                    {m.user_id === currentUserId && (
                      <Badge variant="outline" className="text-xs">
                        você
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={m.role === 'admin' ? 'default' : 'secondary'}>
                    {m.role === 'admin' ? 'Admin' : 'Membro'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {new Date(m.joined_at).toLocaleDateString('pt-BR')}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    {m.user_id !== currentUserId && (
                      <button
                        onClick={() => handleRemove(m.id)}
                        disabled={removingId === m.id}
                        title="Remover membro"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Convites pendentes */}
      {invites.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Convites pendentes ({invites.length})
          </h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                    E-mail
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                    Papel
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
                    Expira em
                  </th>
                  {isAdmin && <th className="px-4 py-2.5 w-10" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invites.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground">{inv.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={inv.role === 'admin' ? 'default' : 'secondary'}>
                        {inv.role === 'admin' ? 'Admin' : 'Membro'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(inv.expires_at).toLocaleDateString('pt-BR')}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleCancelInvite(inv.id)}
                          disabled={cancelingId === inv.id}
                          title="Cancelar convite"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  )
}
