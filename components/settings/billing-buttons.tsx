'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Settings2 } from 'lucide-react'
import { startCheckoutAction, openPortalAction } from '@/app/(app)/settings/billing/actions'

export function CheckoutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleClick() {
    setError('')
    startTransition(async () => {
      const result = await startCheckoutAction()
      if ('error' in result) {
        setError(result.error)
        return
      }
      window.open(result.url, '_blank', 'noopener,noreferrer')
    })
  }

  return (
    <div className={className}>
      <Button type="button" onClick={handleClick} disabled={pending} className="gap-1.5">
        <Zap className="h-3.5 w-3.5" />
        {pending ? 'Aguarde...' : 'Assinar Pro — R$49/mês'}
      </Button>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function PortalButton() {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const result = await openPortalAction()
      if ('url' in result) {
        window.open(result.url, '_blank', 'noopener,noreferrer')
      }
    })
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleClick} disabled={pending} className="shrink-0 gap-1.5">
      <Settings2 className="h-3.5 w-3.5" />
      {pending ? 'Aguarde...' : 'Gerenciar assinatura'}
    </Button>
  )
}
