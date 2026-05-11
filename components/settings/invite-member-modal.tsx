'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { inviteMemberAction } from '@/lib/workspace-actions'
import type { WorkspaceMemberRole } from '@/src/types/supabase'

interface InviteMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<WorkspaceMemberRole>('member')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function reset() {
    setEmail('')
    setRole('member')
    setError('')
    setSuccess(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Informe um e-mail válido')
      return
    }

    startTransition(async () => {
      const result = await inviteMemberAction(trimmed, role)
      if (result?.error) {
        // "Convite criado, mas e-mail não enviado" — sucesso parcial
        if (result.error.startsWith('Convite criado')) {
          setSuccess(true)
          setError(result.error)
          router.refresh()
        } else {
          setError(result.error)
        }
      } else {
        setSuccess(true)
        router.refresh()
        setTimeout(() => {
          handleOpenChange(false)
        }, 1200)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Convidar membro</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              Convite criado para <strong>{email}</strong>!
            </div>
            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                {error}
              </div>
            )}
            <button
              onClick={() => handleOpenChange(false)}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="invite-email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colega@empresa.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                disabled={isPending}
                className="h-9"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-role" className="text-sm font-medium">
                Papel
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as WorkspaceMemberRole)}
                disabled={isPending}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:border-ring transition-colors"
              >
                <option value="member">Membro — pode ver e editar dados</option>
                <option value="admin">Admin — acesso total ao workspace</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Enviar convite'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
