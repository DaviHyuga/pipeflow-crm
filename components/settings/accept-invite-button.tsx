'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { acceptInviteAction } from '@/lib/workspace-actions'

type ActionState = { error: string } | null

export function AcceptInviteButton({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, _formData) => {
      const result = await acceptInviteAction(token)
      // Se redirect() foi chamado, o código abaixo não executa.
      // Só chegamos aqui se houve erro.
      return result && result.error ? { error: result.error } : null
    },
    null,
  )

  return (
    <form action={formAction} className="mt-6">
      {state?.error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      )}
      <Button type="submit" disabled={isPending} className="h-9 w-full">
        {isPending ? 'Processando...' : 'Aceitar convite e entrar'}
      </Button>
    </form>
  )
}
