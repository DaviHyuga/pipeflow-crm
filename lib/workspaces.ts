/**
 * Funções de consulta de workspaces — chamadas apenas em Server Components.
 * NÃO importar em Client Components (usa next/headers indiretamente via createClient).
 */
import { createClient } from '@/lib/supabase/server'
import type { WorkspaceRow, WorkspaceMemberRole } from '@/src/types/supabase'

export const WORKSPACE_COOKIE = 'pipeflow_ws'

export type WorkspaceWithRole = WorkspaceRow & { role: WorkspaceMemberRole }

export async function getUserWorkspaces(): Promise<WorkspaceWithRole[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('workspace_members')
    .select('role, workspaces(*)')
    .eq('user_id', user.id)

  if (error || !data) return []

  return data
    .filter((m) => m.workspaces !== null)
    .map((m) => ({
      ...(m.workspaces as WorkspaceRow),
      role: m.role as WorkspaceMemberRole,
    }))
}
