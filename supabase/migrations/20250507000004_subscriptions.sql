-- =============================================================================
-- Migration 0004: Subscriptions (Stripe billing)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabela: subscriptions  (espelha estado do Stripe localmente)
-- -----------------------------------------------------------------------------
create table if not exists subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  workspace_id            uuid not null references workspaces(id) on delete cascade,
  stripe_subscription_id  text not null unique,
  stripe_customer_id      text not null,
  stripe_price_id         text not null,
  status                  text not null
                            check (status in (
                              'active',
                              'trialing',
                              'past_due',
                              'canceled',
                              'incomplete',
                              'incomplete_expired',
                              'unpaid',
                              'paused'
                            )),
  plan                    text not null default 'pro' check (plan in ('free', 'pro')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  canceled_at             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_workspace_idx         on subscriptions(workspace_id);
create index if not exists subscriptions_stripe_sub_idx        on subscriptions(stripe_subscription_id);
create index if not exists subscriptions_stripe_customer_idx   on subscriptions(stripe_customer_id);

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

-- RLS: membros do workspace podem ler; escrita apenas via service_role (webhook)
alter table subscriptions enable row level security;

create policy "subscriptions_select"
  on subscriptions for select
  using (is_workspace_member(workspace_id));

-- Inserção/update apenas via service_role (webhook handler no servidor)
-- Nenhuma policy de insert/update para roles de usuário — apenas service_role bypassa RLS

-- -----------------------------------------------------------------------------
-- View: workspace_plan  (facilita leitura do plano atual no frontend)
-- -----------------------------------------------------------------------------
create or replace view workspace_plan as
select
  w.id            as workspace_id,
  w.name          as workspace_name,
  w.plan,
  s.status        as subscription_status,
  s.current_period_end,
  s.cancel_at_period_end,
  (
    select count(*)
    from leads l
    where l.workspace_id = w.id
  )               as leads_count,
  (
    select count(*)
    from workspace_members wm
    where wm.workspace_id = w.id
  )               as members_count
from workspaces w
left join subscriptions s on s.workspace_id = w.id
  and s.status in ('active', 'trialing');

-- Segurança da view: herda RLS das tabelas base
