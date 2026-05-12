# PipeFlow CRM — Plano de Execução

> **Estratégia**: Interface primeiro, backend depois. Cada milestone é um incremento shippable.
> Branches seguem o padrão `feat/milestone-NNN-nome`.

---

## Milestone 00 — Setup & Scaffold
**Branch:** `feat/milestone-000-setup`
**Objetivo:** Repositório configurado, projeto Next.js rodando localmente com todas as dependências instaladas e variáveis de ambiente prontas.

### Entregas
- [x] Criar repositório GitHub `pipeflow-crm`
- [x] Scaffold Next.js 16 com App Router + TypeScript strict (`create-next-app`)
- [x] Configurar Tailwind CSS
- [x] Inicializar shadcn/ui (`npx shadcn@latest init`)
- [x] Instalar dependências: `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts`, `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `resend`
- [x] Criar estrutura de pastas: `/app`, `/components`, `/lib`, `/hooks`, `/types`
- [x] Configurar `.env.local` com todas as variáveis (ver `CLAUDE.md`)
- [x] Configurar `tsconfig.json` com strict mode e path aliases (`@/`)
- [x] Criar `lib/supabase/client.ts` e `lib/supabase/server.ts` (clientes browser e server)
- [x] Confirmar `npm run dev` sem erros

**Commit final:** `feat: scaffold Next.js 16 + shadcn/ui + dependências do projeto`

---

## Milestone 01 — Layout Shell & Design System
**Branch:** `feat/milestone-001-layout-shell`
**Objetivo:** Shell visual do app completo com sidebar, topbar e área de conteúdo — sem dados reais, apenas UI estática.

### Entregas
- [x] Criar layout raiz `/app/layout.tsx` com fontes e providers
- [x] Criar `/app/(app)/layout.tsx` — layout autenticado com sidebar + content area
- [x] Componente `Sidebar` com dark background, logo PipeFlow, nav links (Dashboard, Leads, Pipeline, Configurações)
- [x] Componente `WorkspaceSwitcher` — dropdown na sidebar para alternar workspaces (UI estática)
- [x] Componente `Topbar` com avatar do usuário e dropdown de perfil
- [x] Instalar e configurar componentes shadcn/ui necessários: `Button`, `Avatar`, `DropdownMenu`, `Badge`, `Card`, `Input`, `Dialog`, `Sheet`, `Separator`, `Tooltip`
- [x] Página `/app/(app)/dashboard` — página vazia com título
- [x] Página `/app/(app)/leads` — página vazia com título
- [x] Página `/app/(app)/pipeline` — página vazia com título
- [x] Responsividade básica (sidebar colapsável em mobile via Sheet)
- [x] Definir tokens de cor no `tailwind.config.ts` (primary blue, sidebar dark, content light)

**Commit final:** `feat: layout shell com sidebar dark, topbar e design system base` ✅

---

## Milestone 02 — Landing Page
**Branch:** `feat/milestone-002-landing-page`
**Objetivo:** Página pública de marketing completa e responsiva, sem integração de dados.

### Entregas
- [x] Criar `/app/(marketing)/layout.tsx` — layout público (sem sidebar)
- [x] Landing page em `app/page.tsx` — compõe Navbar + Hero + LogoStrip + Features + Testimonials + Pricing + CTA + Footer
- [x] Seção **Hero**: headline com gradient text, badge animado, mesh background, 2 CTAs, 4 stats, mockup Kanban flutuante
- [x] Seção **Logo Strip**: prova social — "Confiado por mais de 1.200 times de vendas"
- [x] Seção **Funcionalidades**: 3 abas interativas (Pipeline Kanban, Gestão de Leads, Dashboard) com mini-UI mockups
- [x] Seção **Depoimentos**: 3 cards com quote, métrica em destaque, avatar e estrelas (gatilho de prova social)
- [x] Seção **Planos e Preços**: Free vs Pro com 10 features, badge "Mais popular", trust badges (SSL, sem cartão)
- [x] Seção **CTA final**: headline com gradient, 2 botões, 3 trust items com ícones
- [x] Navbar scroll-aware com backdrop-blur, shadow ao rolar, menu mobile
- [x] Footer com 3 colunas (Produto, Empresa, Legal) + tagline
- [x] Responsividade completa (mobile-first) + scroll-smooth
- [x] Página `/pricing` — página de preços standalone via `app/(marketing)/pricing/page.tsx`

> UI concluída (aula 2.6). Landing page completa e interativa: hero com mesh animado, abas interativas nas features, seção de depoimentos, navbar scroll-aware e footer expandido.

**Commit final:** `feat: landing page completa com hero, features, pricing e CTA` ✅

---

## Milestone 03 — Dashboard UI
**Branch:** `feat/milestone-003-dashboard-ui`
**Objetivo:** Dashboard com todos os componentes visuais usando dados mockados.

### Entregas
- [x] Criar tipos em `types/dashboard.ts` (MetricCard, FunnelData, Deal)
- [x] Criar dados mock em `lib/mock/dashboard.ts`
- [x] Componente `MetricCard` — card com título, valor, variação percentual e ícone
- [x] Grid de 4 MetricCards: Total de Leads, Negócios Abertos, Valor do Pipeline, Taxa de Conversão
- [x] Componente `SalesFunnel` com Recharts (BarChart ou FunnelChart) — etapas do pipeline
- [x] Componente `UpcomingDeals` — lista de negócios com prazo próximo (tabela/cards)
- [x] Layout responsivo do dashboard em grid

> UI concluída (aula 2.5). Métricas mockadas, funil Recharts e lista de negócios próximos.

**Commit final:** `feat: dashboard UI com métricas, funil Recharts e negócios próximos` ✅

---

## Milestone 04 — Leads UI
**Branch:** `feat/milestone-004-leads-ui`
**Objetivo:** Tela de listagem e detalhe de leads completa com dados mockados.

### Entregas
- [x] Criar tipos em `types/lead.ts` (Lead, Activity, ActivityType)
- [x] Criar dados mock em `lib/mock/leads.ts`
- [x] Página `/app/(app)/leads` — listagem de leads
  - [x] Tabela/lista com colunas: nome, empresa, cargo, status, responsável, data
  - [x] Barra de busca por nome/empresa
  - [x] Filtros por status e responsável (dropdowns)
  - [x] Botão "Novo Lead" abrindo modal/sheet
  - [x] Badge de status colorido por etapa
- [x] Modal/Sheet `LeadForm` — formulário de criação/edição de lead (nome, e-mail, telefone, empresa, cargo, status)
- [x] Página `/app/(app)/leads/[id]` — detalhe do lead
  - [x] Header com nome, empresa, cargo e status
  - [x] Seção de informações de contato
  - [x] Componente `ActivityTimeline` — lista cronológica de atividades
  - [x] Modal `AddActivity` — formulário para registrar ligação/e-mail/reunião/nota

> UI concluída (aula 2.3). Inclui exclusão com confirmação e 12 leads brasileiros mockados.

**Commit final:** `feat: UI de leads com listagem, busca, filtros, detalhe e timeline de atividades` ✅

---

## Milestone 05 — Pipeline Kanban UI
**Branch:** `feat/milestone-005-pipeline-ui`
**Objetivo:** Kanban drag-and-drop completo com @dnd-kit usando dados mockados.

### Entregas
- [x] Criar tipos em `types/pipeline.ts` (Stage, Deal, KanbanBoard)
- [x] Criar dados mock em `lib/mock/pipeline.ts`
- [x] Página `/app/(app)/pipeline` — board Kanban
- [x] Componente `KanbanBoard` — container do board com DndContext
- [x] Componente `KanbanColumn` — coluna por etapa (Novo Lead, Contato Realizado, Proposta Enviada, Negociação, Fechado Ganho, Fechado Perdido)
- [x] Componente `DealCard` — card arrastável com título, valor (R$), lead vinculado, responsável, prazo
- [x] Drag-and-drop funcional entre colunas com `@dnd-kit/sortable`
- [x] Estado otimista no frontend (mover card sem aguardar API)
- [x] Modal `DealForm` — criar/editar negócio (título, valor, lead vinculado, responsável, prazo, etapa)
- [x] Botão "Novo Negócio" em cada coluna
- [x] Indicador visual de valor total por coluna

> UI concluída (aula 2.4). 16 deals mockados, drag entre colunas e dentro da coluna, hover colorido por etapa, stagger animation.

**Commit final:** `feat: Kanban pipeline UI com drag-and-drop @dnd-kit e cards de negócios` ✅

---

## Milestone 06 — Autenticação (Supabase Auth)
**Branch:** `feat/milestone-006-auth`
**Objetivo:** Login, cadastro e proteção de rotas funcionando com Supabase Auth.

### Entregas
- [x] Criar projeto Supabase e configurar variáveis de ambiente
- [x] Criar `/app/(auth)/login/page.tsx` — formulário de login (e-mail + senha)
- [x] Criar `/app/(auth)/signup/page.tsx` — formulário de cadastro
- [x] Criar `/app/(auth)/layout.tsx` — layout público de auth (centralizado, sem sidebar)
- [x] Criar `lib/supabase/actions.ts` — Server Actions para login, signup, logout
- [x] `proxy.ts` — redirecionar rotas protegidas para `/login` se não autenticado (Next.js 16: `middleware.ts` → `proxy.ts`)
- [x] Redirecionar para `/dashboard` após login bem-sucedido
- [x] Logout no dropdown de perfil da topbar
- [x] Página `/app/(auth)/forgot-password` — solicitar reset de senha
- [x] Callback de auth: `/app/auth/callback/route.ts`
- [x] Proteger todas as rotas `(app)` com proxy.ts

> Concluído. Auth real Supabase completo. Fixes: Script anti-FOUC (React 19), createServiceClient com `@supabase/supabase-js` puro para bypass correto de RLS.

**Commit final:** `feat: auth real Supabase, onboarding, dashboard/pipeline UI e correções Next.js 16` ✅

---

## Milestone 07 — Multi-workspace & Onboarding
**Branch:** `feat/milestone-007-workspace`
**Objetivo:** Criação de workspace no primeiro acesso, troca de workspace e sistema de convites por e-mail.

### Entregas
- [x] Schema Supabase: tabelas `workspaces`, `workspace_members`, `workspace_invites` (role: admin/member)
- [x] RLS policies para `workspaces`, `workspace_members`, `workspace_invites`
- [x] Onboarding flow: após cadastro, redirecionar para `/create-workspace`
- [x] Página `/app/(onboarding)/create-workspace` — formulário de criação do primeiro workspace
- [x] Salvar `workspace_id` ativo no cookie/session
- [x] `WorkspaceSwitcher` funcional — listar workspaces do usuário e alternar
- [x] Página `/app/(app)/settings/workspace` — configurações do workspace (nome, logo)
- [x] Página `/app/(app)/settings/members` — listar membros e papéis
- [x] Modal `InviteMember` — convidar por e-mail (gera token de convite)
- [x] Rota `/invite/[token]` — aceitar convite e entrar no workspace
- [x] Envio de e-mail de convite via Resend
- [x] Limite plano Free: máximo 2 membros com banner de upgrade
- [x] Settings layout com sub-nav (Workspace, Membros, Faturamento)
- [x] `proxy.ts` suporta `?next=` redirect após login

**Commit final:** `feat: colaboração — convites por e-mail, membros, limite Free, settings (aula 3.5)`

---

## Milestone 08 — Backend: Leads & Atividades ✅
**Branch:** `feat/leads-data`
**Objetivo:** CRUD completo de leads e atividades conectado ao Supabase com RLS.

### Entregas
- [x] Schema Supabase: tabelas `leads`, `activities` com `workspace_id`
- [x] RLS policies para `leads` e `activities`
- [x] `lib/leads.ts` — getLeads, getLead (com activities), createLead, updateLead, deleteLead, createActivity
- [x] Server Actions em `app/(app)/leads/actions.ts`
- [x] Listagem de leads buscando do Supabase com filtro por status e busca ilike
- [x] Busca e filtros via URL params + Supabase (debounced, server-side)
- [x] Página de detalhe do lead com dados reais
- [x] ActivityTimeline com atividades do banco
- [x] AddActivityModal salvando no banco via Server Action + router.refresh()

**Commit final:** `feat: leads, deals e dashboard com dados reais do Supabase (aula 3.4)` ✅

---

## Milestone 09 — Backend: Pipeline Kanban ✅
**Branch:** `feat/leads-data`
**Objetivo:** Negócios persistidos no banco, drag-and-drop com atualização de etapa.

### Entregas
- [x] Schema Supabase: tabela `deals` com position, stage, lead_id, owner_id
- [x] RLS policies para `deals`
- [x] `lib/deals.ts` — getDeals (join leads), createDeal, updateDeal, updateDealStage, deleteDeal
- [x] Server Actions em `app/(app)/pipeline/actions.ts`
- [x] KanbanBoard com dados reais (initialDeals prop da página)
- [x] Drag-and-drop persiste stage + position via updateDealStageAction (fire & forget)
- [x] DealForm com lead picker real (workspaceLeads prop)
- [x] Create/edit/delete deals persistidos no banco

**Commit final:** `feat: leads, deals e dashboard com dados reais do Supabase (aula 3.4)` ✅

---

## Milestone 10 — Backend: Dashboard com Dados Reais ✅
**Branch:** `feat/leads-data`
**Objetivo:** Dashboard exibindo métricas reais calculadas a partir do banco de dados.

### Entregas
- [x] `lib/metrics.ts` — count leads, sum pipeline value, conversion rate, funil, upcoming deals
- [x] MetricCards com dados reais do Supabase
- [x] SalesFunnel com deals agrupados por stage do banco
- [x] UpcomingDeals com deals reais (due_date ordenado asc, limit 6)

**Commit final:** `feat: leads, deals e dashboard com dados reais do Supabase (aula 3.4)` ✅

---

## Milestone 11 — Monetização (Stripe)
**Branch:** `feat/billing`
**Objetivo:** Planos Free e Pro com checkout Stripe, webhook e Customer Portal funcionando.

### Entregas
- [ ] Criar produtos e preços no Stripe Dashboard (Free e Pro R$49/mês)
- [x] Schema Supabase: coluna `plan` e `stripe_customer_id` em `workspaces`
- [x] Schema Supabase: tabela `subscriptions` espelhando estado do Stripe
- [x] RLS policies para `subscriptions` (leitura para membros; escrita exclusiva via service_role)
- [x] `lib/stripe.ts` — cliente Stripe singleton + `getOrCreateStripeCustomer`
- [x] Página `/app/(app)/settings/billing` — plano atual, data de renovação, barras de uso, features Pro
- [x] Server Action `startCheckoutAction` — cria Checkout Session e redireciona (sem Route Handler)
- [x] Server Action `openPortalAction` — cria Customer Portal Session e redireciona (sem Route Handler)
- [x] Route Handler `/app/api/stripe/webhook/route.ts` — único exception; lê body raw + verifica assinatura
- [x] Webhook processa `checkout.session.completed` → ativa plano Pro
- [x] Webhook processa `customer.subscription.updated` → sincroniza status
- [x] Webhook processa `customer.subscription.deleted` → volta para Free
- [ ] Enforcer de limites do plano Free: bloquear ao atingir 2 membros ou 50 leads
- [ ] Banner de upgrade quando próximo do limite
- [ ] Testar com Stripe CLI + cartões de teste

> Checkout, webhook e Customer Portal concluídos (aula 4.1). Checkout e portal via Server Actions; webhook como único Route Handler (necessidade de body raw).

**Commit final:** `feat: monetização Stripe com checkout, webhook e Customer Portal`

---

## Milestone 12 — Deploy & Produção
**Branch:** `feat/milestone-012-deploy`
**Objetivo:** App rodando em produção no Vercel + Supabase com domínio configurado.

### Entregas
- [ ] Criar projeto no Vercel e vincular ao repositório GitHub
- [ ] Configurar todas as variáveis de ambiente no Vercel (production)
- [ ] Configurar domínio customizado (ou usar `.vercel.app`)
- [ ] Atualizar `NEXT_PUBLIC_APP_URL` com a URL de produção
- [ ] Configurar Stripe webhook endpoint apontando para produção
- [ ] Configurar Supabase Auth: `Site URL` e `Redirect URLs` para produção
- [ ] Rodar migrations do Supabase em produção
- [ ] Teste end-to-end: cadastro → onboarding → criar lead → mover no pipeline → upgrade para Pro
- [ ] Configurar `vercel.json` / `vercel.ts` se necessário
- [ ] Verificar headers de segurança (CSP, HSTS)
- [ ] Deploy em produção aprovado

**Commit final:** `feat: deploy em produção no Vercel com Supabase e Stripe configurados`

---

## Resumo dos Milestones

| # | Branch | Foco | Tipo |
|---|--------|------|------|
| 00 | `milestone-000-setup` | Scaffold + dependências | Setup |
| 01 | `milestone-001-layout-shell` | Shell visual + design system | UI |
| 02 | `milestone-002-landing-page` | Landing page pública | UI |
| 03 | `milestone-003-dashboard-ui` | Dashboard (mock) | UI |
| 04 | `milestone-004-leads-ui` | Leads + timeline (mock) | UI |
| 05 | `milestone-005-pipeline-ui` | Kanban drag-and-drop (mock) | UI |
| 06 | `milestone-006-auth` | Login, signup, proteção de rotas | Backend |
| 07 | `milestone-007-workspace` | Multi-workspace + convites | Backend |
| 08 | `milestone-008-leads-backend` | CRUD leads + atividades | Backend |
| 09 | `milestone-009-pipeline-backend` | Pipeline persistido | Backend |
| 10 | `milestone-010-dashboard-backend` | Métricas reais | Backend |
| 11 | `milestone-011-stripe` | Assinaturas + webhook | Backend |
| 12 | `milestone-012-deploy` | Deploy em produção | Deploy |

---

> Cada milestone deve ser executado em ordem. Confirme que o milestone anterior está funcionando antes de iniciar o próximo.
