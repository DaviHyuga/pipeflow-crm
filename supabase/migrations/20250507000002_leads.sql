-- =============================================================================
-- Migration 0002: Leads & Activities
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabela: leads
-- -----------------------------------------------------------------------------
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  name          text not null,
  email         text,
  phone         text,
  company       text,
  role          text,  -- cargo/função do lead
  status        text not null default 'novo'
                  check (status in ('novo', 'contactado', 'qualificado', 'proposta', 'fechado', 'perdido')),
  owner_id      uuid references auth.users(id),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Índices de performance
create index if not exists leads_workspace_idx    on leads(workspace_id);
create index if not exists leads_status_idx       on leads(workspace_id, status);
create index if not exists leads_owner_idx        on leads(workspace_id, owner_id);
create index if not exists leads_company_idx      on leads(workspace_id, company);
-- Busca full-text por nome ou empresa
create index if not exists leads_search_idx       on leads using gin(
  to_tsvector('portuguese', coalesce(name, '') || ' ' || coalesce(company, '') || ' ' || coalesce(email, ''))
);

-- Trigger updated_at
drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- RLS
alter table leads enable row level security;

drop policy if exists "leads_select" on leads;
create policy "leads_select"
  on leads for select
  using (is_workspace_member(workspace_id));

drop policy if exists "leads_insert" on leads;
create policy "leads_insert"
  on leads for insert
  with check (is_workspace_member(workspace_id));

drop policy if exists "leads_update" on leads;
create policy "leads_update"
  on leads for update
  using (is_workspace_member(workspace_id));

drop policy if exists "leads_delete" on leads;
create policy "leads_delete"
  on leads for delete
  using (is_workspace_member(workspace_id));

-- -----------------------------------------------------------------------------
-- Tabela: activities  (timeline de atividades por lead)
-- -----------------------------------------------------------------------------
create table if not exists activities (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  lead_id       uuid not null references leads(id) on delete cascade,
  user_id       uuid not null references auth.users(id),
  type          text not null check (type in ('ligacao', 'email', 'reuniao', 'nota')),
  title         text not null,
  description   text,
  created_at    timestamptz not null default now()
);

create index if not exists activities_lead_idx      on activities(lead_id);
create index if not exists activities_workspace_idx on activities(workspace_id);
create index if not exists activities_user_idx      on activities(workspace_id, user_id);

-- RLS
alter table activities enable row level security;

drop policy if exists "activities_select" on activities;
create policy "activities_select"
  on activities for select
  using (is_workspace_member(workspace_id));

drop policy if exists "activities_insert" on activities;
create policy "activities_insert"
  on activities for insert
  with check (
    is_workspace_member(workspace_id)
    and user_id = auth.uid()
  );

drop policy if exists "activities_update" on activities;
create policy "activities_update"
  on activities for update
  using (
    is_workspace_member(workspace_id)
    and user_id = auth.uid()
  );

drop policy if exists "activities_delete" on activities;
create policy "activities_delete"
  on activities for delete
  using (
    is_workspace_member(workspace_id)
    and user_id = auth.uid()
  );
