/**
 * Supabase Database Types — PipeFlow CRM
 *
 * Gerado manualmente com base nas migrations em supabase/migrations/.
 * Para regenerar automaticamente após mudanças no schema:
 *   npx supabase gen types typescript --project-id rqrqpfnwxuutzjfyeisi > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type WorkspacePlan = 'free' | 'pro'

export type WorkspaceMemberRole = 'admin' | 'member'

export type LeadStatus =
  | 'novo'
  | 'contactado'
  | 'qualificado'
  | 'proposta'
  | 'fechado'
  | 'perdido'

export type ActivityType = 'ligacao' | 'email' | 'reuniao' | 'nota'

export type DealStage =
  | 'novo_lead'
  | 'contato_realizado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido'

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused'

// ---------------------------------------------------------------------------
// Row types (espelham as colunas das tabelas)
// Nota: devem ser `type` (não `interface`) para satisfazer Record<string, unknown>
// na verificação de genéricos do Supabase com TypeScript 5.9+
// ---------------------------------------------------------------------------

export type WorkspaceRow = {
  id: string
  name: string
  slug: string
  plan: WorkspacePlan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export type WorkspaceMemberRow = {
  id: string
  workspace_id: string
  user_id: string
  role: WorkspaceMemberRole
  invited_by: string | null
  created_at: string
}

export type WorkspaceInviteRow = {
  id: string
  workspace_id: string
  email: string
  role: WorkspaceMemberRole
  token: string
  invited_by: string
  accepted_at: string | null
  expires_at: string
  created_at: string
}

export type LeadRow = {
  id: string
  workspace_id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  role: string | null
  status: LeadStatus
  owner_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ActivityRow = {
  id: string
  workspace_id: string
  lead_id: string
  user_id: string
  type: ActivityType
  title: string
  description: string | null
  created_at: string
}

export type DealRow = {
  id: string
  workspace_id: string
  title: string
  value: number
  stage: DealStage
  lead_id: string | null
  owner_id: string | null
  due_date: string | null
  notes: string | null
  position: number
  created_at: string
  updated_at: string
}

export type SubscriptionRow = {
  id: string
  workspace_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  stripe_price_id: string
  status: SubscriptionStatus
  plan: WorkspacePlan
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Insert types (campos com DEFAULT no banco são opcionais)
// ---------------------------------------------------------------------------

export type WorkspaceInsert = {
  id?: string
  name: string
  slug: string
  plan?: WorkspacePlan
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  trial_ends_at?: string | null
  created_at?: string
  updated_at?: string
}

export type WorkspaceMemberInsert = {
  id?: string
  workspace_id: string
  user_id: string
  role?: WorkspaceMemberRole
  invited_by?: string | null
  created_at?: string
}

export type LeadInsert = Omit<LeadRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<LeadRow, 'id' | 'created_at' | 'updated_at'>>

export type ActivityInsert = Omit<ActivityRow, 'id' | 'created_at'> &
  Partial<Pick<ActivityRow, 'id' | 'created_at'>>

export type DealInsert = Omit<DealRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<DealRow, 'id' | 'created_at' | 'updated_at'>>

export type SubscriptionInsert = Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<SubscriptionRow, 'id' | 'created_at' | 'updated_at'>>

// ---------------------------------------------------------------------------
// Update types (todos os campos opcionais exceto id)
// ---------------------------------------------------------------------------

export type WorkspaceUpdate = Partial<Omit<WorkspaceRow, 'id'>>
export type WorkspaceMemberUpdate = Partial<Omit<WorkspaceMemberRow, 'id'>>
export type LeadUpdate = Partial<Omit<LeadRow, 'id'>>
export type ActivityUpdate = Partial<Omit<ActivityRow, 'id'>>
export type DealUpdate = Partial<Omit<DealRow, 'id'>>
export type SubscriptionUpdate = Partial<Omit<SubscriptionRow, 'id'>>

// ---------------------------------------------------------------------------
// Database type (compatível com createClient<Database>())
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: WorkspaceRow
        Insert: WorkspaceInsert
        Update: WorkspaceUpdate
        Relationships: []
      }
      workspace_members: {
        Row: WorkspaceMemberRow
        Insert: WorkspaceMemberInsert
        Update: WorkspaceMemberUpdate
        Relationships: [
          {
            foreignKeyName: 'workspace_members_workspace_id_fkey'
            columns: ['workspace_id']
            isOneToOne: false
            referencedRelation: 'workspaces'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'workspace_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      workspace_invites: {
        Row: WorkspaceInviteRow
        Insert: Omit<WorkspaceInviteRow, 'id' | 'created_at' | 'token'> &
          Partial<Pick<WorkspaceInviteRow, 'id' | 'created_at' | 'token'>>
        Update: Partial<Omit<WorkspaceInviteRow, 'id'>>
        Relationships: []
      }
      leads: {
        Row: LeadRow
        Insert: LeadInsert
        Update: LeadUpdate
        Relationships: []
      }
      activities: {
        Row: ActivityRow
        Insert: ActivityInsert
        Update: ActivityUpdate
        Relationships: []
      }
      deals: {
        Row: DealRow
        Insert: DealInsert
        Update: DealUpdate
        Relationships: []
      }
      subscriptions: {
        Row: SubscriptionRow
        Insert: SubscriptionInsert
        Update: SubscriptionUpdate
        Relationships: []
      }
    }
    Views: {
      workspace_plan: {
        Row: {
          workspace_id: string
          workspace_name: string
          plan: WorkspacePlan
          subscription_status: SubscriptionStatus | null
          current_period_end: string | null
          cancel_at_period_end: boolean | null
          leads_count: number
          members_count: number
        }
        Relationships: []
      }
    }
    Functions: {
      is_workspace_member: {
        Args: { p_workspace_id: string }
        Returns: boolean
      }
      workspace_member_role: {
        Args: { p_workspace_id: string }
        Returns: WorkspaceMemberRole | null
      }
    }
    Enums: Record<string, never>
  }
}

// ---------------------------------------------------------------------------
// Alias conveniente para tipagem dos clientes
// ---------------------------------------------------------------------------

/** Tipo do cliente Supabase tipado para o PipeFlow CRM */
export type TypedSupabaseClient = import('@supabase/supabase-js').SupabaseClient<Database>
