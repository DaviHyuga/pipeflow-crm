-- =============================================================================
-- Migration 0001: Workspaces & Workspace Members
-- =============================================================================

-- Função auxiliar para atualizar updated_at automaticamente
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Tabela: workspaces  (deve vir antes de workspace_members)
-- -----------------------------------------------------------------------------
create table if not exists workspaces (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  slug                   text not null unique,
  plan                   text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  trial_ends_at          timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists workspaces_slug_idx on workspaces(slug);

drop trigger if exists workspaces_updated_at on workspaces;
create trigger workspaces_updated_at
  before update on workspaces
  for each row execute function set_updated_at();

-- -----------------------------------------------------------------------------
-- Tabela: workspace_members  (referenciada pelas funções RLS abaixo)
-- -----------------------------------------------------------------------------
create table if not exists workspace_members (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null default 'member' check (role in ('admin', 'member')),
  invited_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),

  unique(workspace_id, user_id)
);

create index if not exists workspace_members_workspace_idx on workspace_members(workspace_id);
create index if not exists workspace_members_user_idx      on workspace_members(user_id);

-- -----------------------------------------------------------------------------
-- Tabela: workspace_invites
-- -----------------------------------------------------------------------------
create table if not exists workspace_invites (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  email         text not null,
  role          text not null default 'member' check (role in ('admin', 'member')),
  token         text not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by    uuid not null references auth.users(id),
  accepted_at   timestamptz,
  expires_at    timestamptz not null default now() + interval '7 days',
  created_at    timestamptz not null default now(),

  unique(workspace_id, email)
);

create index if not exists workspace_invites_token_idx     on workspace_invites(token);
create index if not exists workspace_invites_workspace_idx on workspace_invites(workspace_id);

-- -----------------------------------------------------------------------------
-- Funções helper para RLS  (criadas APÓS as tabelas existirem)
-- -----------------------------------------------------------------------------

create or replace function is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from workspace_members
    where workspace_id = p_workspace_id
      and user_id = auth.uid()
  );
$$;

create or replace function workspace_member_role(p_workspace_id uuid)
returns text
language sql
security definer
stable
as $$
  select role
  from workspace_members
  where workspace_id = p_workspace_id
    and user_id = auth.uid()
  limit 1;
$$;

-- -----------------------------------------------------------------------------
-- RLS — workspaces
-- -----------------------------------------------------------------------------
alter table workspaces enable row level security;

drop policy if exists "workspace_select" on workspaces;
create policy "workspace_select"
  on workspaces for select
  using (is_workspace_member(id));

drop policy if exists "workspace_insert" on workspaces;
create policy "workspace_insert"
  on workspaces for insert
  with check (auth.uid() is not null);

drop policy if exists "workspace_update" on workspaces;
create policy "workspace_update"
  on workspaces for update
  using (workspace_member_role(id) = 'admin');

drop policy if exists "workspace_delete" on workspaces;
create policy "workspace_delete"
  on workspaces for delete
  using (workspace_member_role(id) = 'admin');

-- -----------------------------------------------------------------------------
-- RLS — workspace_members
-- -----------------------------------------------------------------------------
alter table workspace_members enable row level security;

drop policy if exists "workspace_members_select" on workspace_members;
create policy "workspace_members_select"
  on workspace_members for select
  using (is_workspace_member(workspace_id));

drop policy if exists "workspace_members_insert" on workspace_members;
create policy "workspace_members_insert"
  on workspace_members for insert
  with check (
    workspace_member_role(workspace_id) = 'admin'
    or (
      -- Bootstrap: permite inserir a si mesmo como admin ao criar um workspace vazio
      user_id = auth.uid()
      and role = 'admin'
      and not exists (
        select 1 from workspace_members wm
        where wm.workspace_id = workspace_members.workspace_id
      )
    )
  );

drop policy if exists "workspace_members_update" on workspace_members;
create policy "workspace_members_update"
  on workspace_members for update
  using (workspace_member_role(workspace_id) = 'admin');

drop policy if exists "workspace_members_delete" on workspace_members;
create policy "workspace_members_delete"
  on workspace_members for delete
  using (
    workspace_member_role(workspace_id) = 'admin'
    or user_id = auth.uid()
  );

-- -----------------------------------------------------------------------------
-- RLS — workspace_invites
-- -----------------------------------------------------------------------------
alter table workspace_invites enable row level security;

drop policy if exists "workspace_invites_select" on workspace_invites;
create policy "workspace_invites_select"
  on workspace_invites for select
  using (is_workspace_member(workspace_id));

drop policy if exists "workspace_invites_insert" on workspace_invites;
create policy "workspace_invites_insert"
  on workspace_invites for insert
  with check (workspace_member_role(workspace_id) = 'admin');

drop policy if exists "workspace_invites_delete" on workspace_invites;
create policy "workspace_invites_delete"
  on workspace_invites for delete
  using (workspace_member_role(workspace_id) = 'admin');
