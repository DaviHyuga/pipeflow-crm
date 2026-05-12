'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/settings/workspace', label: 'Workspace' },
  { href: '/settings/members', label: 'Membros' },
  { href: '/settings/billing', label: 'Assinatura' },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex border-b border-border">
      {links.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
