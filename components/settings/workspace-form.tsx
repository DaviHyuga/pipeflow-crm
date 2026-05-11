'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { updateWorkspaceAction } from '@/lib/workspace-actions'

interface WorkspaceFormProps {
  name: string
  slug: string
  plan: 'free' | 'pro'
}

export function WorkspaceForm({ name: initialName, slug, plan }: WorkspaceFormProps) {
  const [name, setName] = useState(initialName)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!name.trim() || name.trim().length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres')
      return
    }
    startTransition(async () => {
      const result = await updateWorkspaceAction(name.trim())
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="ws-name" className="text-sm font-medium text-foreground">
          Nome do workspace
        </label>
        <Input
          id="ws-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
            setSuccess(false)
          }}
          disabled={isPending}
          className="h-9 max-w-sm"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        {success && <p className="text-xs text-emerald-600">Salvo com sucesso!</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Slug</label>
        <p className="font-mono text-sm text-muted-foreground">{slug}</p>
        <p className="text-xs text-muted-foreground">O slug não pode ser alterado após a criação.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Plano</label>
        <div>
          <Badge variant={plan === 'pro' ? 'default' : 'outline'} className="capitalize">
            {plan === 'pro' ? 'Pro' : 'Free'}
          </Badge>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="h-9">
        {isPending ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
