'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signup } from '@/lib/supabase/actions'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) errors.name = 'Nome é obrigatório'
  if (!email) {
    errors.email = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'E-mail inválido'
  }
  if (!password) {
    errors.password = 'Senha é obrigatória'
  } else if (password.length < 8) {
    errors.password = 'Senha deve ter pelo menos 8 caracteres'
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Confirme sua senha'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
  }
  return errors
}

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  function clearFieldError(field: keyof FieldErrors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    const next = validate(name, email, password, confirmPassword)
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setLoading(true)
    const result = await signup(email, password, name)
    setLoading(false)
    if (result?.error) {
      setGlobalError(
        result.error.includes('already registered')
          ? 'Este e-mail já está cadastrado.'
          : result.error,
      )
    } else if (result?.needsConfirmation) {
      setConfirmationSent(true)
    }
  }

  if (confirmationSent) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              <path d="m16 19 2 2 4-4" />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Confirme seu e-mail</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviamos um link de confirmação para{' '}
          <span className="font-medium text-foreground">{email}</span>.
          Clique no link para ativar sua conta.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Criar sua conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comece a usar o PipeFlow gratuitamente
        </p>
      </div>

      {globalError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome completo
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => { setName(e.target.value); clearFieldError('name') }}
            aria-invalid={!!errors.name}
            disabled={loading}
            className="h-9"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
            aria-invalid={!!errors.email}
            disabled={loading}
            className="h-9"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
            aria-invalid={!!errors.password}
            disabled={loading}
            className="h-9"
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Confirmar senha
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword') }}
            aria-invalid={!!errors.confirmPassword}
            disabled={loading}
            className="h-9"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-2 h-9 w-full"
          disabled={loading}
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
