import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE } from '@/lib/workspaces'
import { WorkspaceForm } from '@/components/settings/workspace-form'

export default async function WorkspaceSettingsPage() {
  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (!workspaceId) redirect('/create-workspace')

  const supabase = await createClient()
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, slug, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) redirect('/create-workspace')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Workspace</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Informações gerais do seu workspace.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <WorkspaceForm
          name={workspace.name}
          slug={workspace.slug}
          plan={workspace.plan as 'free' | 'pro'}
        />
      </div>
    </div>
  )
}
