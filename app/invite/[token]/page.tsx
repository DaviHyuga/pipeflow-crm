import Link from 'next/link'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getInviteByToken } from '@/lib/invites'
import { Button } from '@/components/ui/button'
import { AcceptInviteButton } from '@/components/settings/accept-invite-button'

interface InvitePageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params

  const [invite, authResult] = await Promise.all([
    getInviteByToken(token),
    createClient().then((c) => c.auth.getUser()),
  ])

  // Buscar nome do workspace
  let workspaceName = 'PipeFlow'
  if (invite) {
    const supabase = await createServiceClient()
    const { data } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', invite.workspace_id)
      .single()
    if (data) workspaceName = data.name
  }

  const user = authResult.data.user
  const isExpired = invite ? new Date(invite.expires_at) < new Date() : false
  const isAccepted = !!invite?.accepted_at

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">PipeFlow</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {!invite || isExpired || isAccepted ? (
            // Convite inválido / expirado / já aceito
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <span className="text-xl">!</span>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                {isAccepted ? 'Convite já utilizado' : 'Convite inválido'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isAccepted
                  ? 'Este convite já foi aceito anteriormente.'
                  : isExpired
                    ? 'Este convite expirou. Peça ao admin um novo convite.'
                    : 'Este link de convite não é válido.'}
              </p>
              <Link href="/login">
                <Button variant="outline" className="mt-6 h-9 w-full">
                  Ir para o login
                </Button>
              </Link>
            </div>
          ) : user ? (
            // Usuário autenticado — mostrar botão de aceite
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">
                  {workspaceName[0].toUpperCase()}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Você foi convidado para{' '}
                <span className="text-primary">{workspaceName}</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Papel:{' '}
                <span className="font-medium text-foreground capitalize">
                  {invite.role === 'admin' ? 'Admin' : 'Membro'}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Entrando como <strong>{user.email}</strong>
              </p>
              <AcceptInviteButton token={token} />
            </div>
          ) : (
            // Não autenticado — mostrar login/signup
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">
                  {workspaceName[0].toUpperCase()}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Convite para{' '}
                <span className="text-primary">{workspaceName}</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Entre na sua conta ou crie uma para aceitar este convite.
              </p>
              <div className="mt-6 space-y-2">
                <Link href={`/login?next=/invite/${token}`}>
                  <Button className="h-9 w-full">Entrar na conta</Button>
                </Link>
                <Link href={`/signup?next=/invite/${token}`}>
                  <Button variant="outline" className="h-9 w-full">
                    Criar conta grátis
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
