import { SettingsNav } from '@/components/settings/settings-nav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie o workspace e os membros da equipe.
        </p>
      </div>

      <SettingsNav />

      <div className="mt-6">{children}</div>
    </div>
  )
}
