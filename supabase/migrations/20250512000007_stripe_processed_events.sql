-- Tabela de idempotência para eventos Stripe
-- Previne processamento duplicado em caso de retry do webhook

create table if not exists public.stripe_processed_events (
  id           uuid primary key default gen_random_uuid(),
  event_id     text not null unique,
  event_type   text not null,
  processed_at timestamptz not null default now()
);

-- Apenas o service_role pode escrever (webhook handler usa service client)
alter table public.stripe_processed_events enable row level security;

-- Sem policy de leitura para usuários — apenas service_role acessa
-- (Supabase: sem policy = acesso negado por default para anon/authenticated)

-- Limpeza automática após 30 dias para não crescer indefinidamente
create index if not exists stripe_processed_events_processed_at_idx
  on public.stripe_processed_events (processed_at);
