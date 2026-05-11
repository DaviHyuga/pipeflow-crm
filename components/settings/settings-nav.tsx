'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Building2, Users, CreditCard } from 'lucide-react'

const links = [
  { href: '/settings/workspace', label: 'Workspace', icon: Building2 },
  { href: '/settings/members', label: 'Membros', icon: Users },
  { href: '/settings/billing', label: 'Faturamento', icon: CreditCard },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-0.5">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
