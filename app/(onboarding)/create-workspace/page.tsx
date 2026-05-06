'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function CreateWorkspacePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [loading, setLoading] = useState(false)

  const slug = toSlug(name)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
    if (nameError) setNameError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      setNameError('Nome do workspace é obrigatório')
      return
    }
    if (name.trim().length < 3) {
      setNameError('O nome deve ter pelo menos 3 caracteres')
      return
    }

    setLoading(true)
    // Fake workspace creation — substitui pelo Supabase no Milestone 07
    await new Promise((res) => setTimeout(res, 1200))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          1
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
          2
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            Crie seu workspace
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O workspace é o espaço da sua empresa no PipeFlow. Você pode
            convidar membros depois.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium text-foreground"
            >
              Nome da empresa ou equipe
            </label>
            <Input
              id="workspace-name"
              type="text"
              placeholder="Ex: Acme Vendas"
              value={name}
              onChange={handleNameChange}
              aria-invalid={!!nameError}
              disabled={loading}
              className="h-9"
              autoFocus
            />
            {nameError && (
              <p className="text-xs text-destructive">{nameError}</p>
            )}
            {slug && !nameError && (
              <p className="text-xs text-muted-foreground">
                URL do workspace:{' '}
                <span className="font-mono text-foreground/70">
                  pipeflow.app/<span className="text-primary">{slug}</span>
                </span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-9 w-full"
            disabled={loading}
          >
            {loading ? 'Criando workspace...' : 'Criar workspace e começar'}
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Você poderá renomear e personalizar seu workspace depois nas configurações.
      </p>
    </div>
  )
}
