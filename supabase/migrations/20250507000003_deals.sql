-- =============================================================================
-- Migration 0003: Deals (Pipeline Kanban)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabela: deals
-- -----------------------------------------------------------------------------
create table if not exists deals (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  title         text not null,
  value         numeric(15, 2) not null default 0 check (value >= 0),
  stage         text not null default 'novo_lead'
                  check (stage in (
                    'novo_lead',
                    'contato_realizado',
                    'proposta_enviada',
                    'negociacao',
                    'fechado_ganho',
                    'fechado_perdido'
                  )),
  lead_id       uuid references leads(id) on delete set null,
  owner_id      uuid references auth.users(id),
  due_date      date,
  notes         text,
  -- Posição dentro da coluna (para ordenação do Kanban)
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Índices de performance
create index if not exists deals_workspace_idx  on deals(workspace_id);
create index if not exists deals_stage_idx      on deals(workspace_id, stage);
create index if not exists deals_lead_idx       on deals(lead_id);
create index if not exists deals_owner_idx      on deals(workspace_id, owner_id);
create index if not exists deals_due_date_idx   on deals(workspace_id, due_date) where due_date is not null;
-- Índice para ordenação Kanban (workspace + stage + posição)
create index if not exists deals_kanban_order_idx on deals(workspace_id, stage, position);

-- Trigger updated_at
create trigger deals_updated_at
  before update on deals
  for each row execute function set_updated_at();

-- RLS
alter table deals enable row level security;

create policy "deals_select"
  on deals for select
  using (is_workspace_member(workspace_id));

create policy "deals_insert"
  on deals for insert
  with check (is_workspace_member(workspace_id));

create policy "deals_update"
  on deals for update
  using (is_workspace_member(workspace_id));

create policy "deals_delete"
  on deals for delete
  using (is_workspace_member(workspace_id));
