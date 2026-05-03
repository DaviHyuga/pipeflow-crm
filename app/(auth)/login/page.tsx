'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FieldErrors {
  email?: string
  password?: string
}

function validateEmail(value: string) {
  if (!value) return 'E-mail é obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido'
}

function validatePassword(value: string) {
  if (!value) return 'Senha é obrigatória'
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const next: FieldErrors = {}
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    if (emailErr) next.email = emailErr
    if (passwordErr) next.password = passwordErr
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return

    setLoading(true)
    // Fake auth — substitui pelo Supabase no Milestone 06
    await new Promise((res) => setTimeout(res, 1200))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Entrar na sua conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bem-vindo de volta ao PipeFlow
        </p>
      </div>

      {globalError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            aria-invalid={!!errors.email}
            disabled={loading}
            className="h-9"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            aria-invalid={!!errors.password}
            disabled={loading}
            className="h-9"
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-2 h-9 w-full"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Não tem uma conta?{' '}
        <Link href="/signup" className="text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
