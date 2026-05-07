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
- [ ] Criar projeto Supabase e configurar variáveis de ambiente
- [x] Criar `/app/(auth)/login/page.tsx` — formulário de login (e-mail + senha)
- [x] Criar `/app/(auth)/signup/page.tsx` — formulário de cadastro
- [x] Criar `/app/(auth)/layout.tsx` — layout público de auth (centralizado, sem sidebar)
- [ ] Criar `lib/supabase/actions.ts` — Server Actions para login, signup, logout
- [ ] Middleware `middleware.ts` — redirecionar rotas protegidas para `/login` se não autenticado
- [x] Redirecionar para `/dashboard` após login bem-sucedido
- [ ] Logout no dropdown de perfil da topbar
- [x] Página `/app/(auth)/forgot-password` — solicitar reset de senha
- [ ] Callback de auth: `/app/auth/callback/route.ts`
- [ ] Proteger todas as rotas `(app)` com middleware

> UI concluída (aula 2.2). Integração Supabase pendente para fase de backend.

**Commit final:** `feat: autenticação completa com Supabase Auth, middleware e proteção de rotas`

---

## Milestone 07 — Multi-workspace & Onboarding
**Branch:** `feat/milestone-007-workspace`
**Objetivo:** Criação de workspace no primeiro acesso, troca de workspace e sistema de convites por e-mail.

### Entregas
- [ ] Schema Supabase: tabelas `workspaces`, `workspace_members` (role: admin/member)
- [x] Onboarding flow: após cadastro, redirecionar para `/create-workspace`
- [x] Página `/app/(onboarding)/create-workspace` — formulário de criação do primeiro workspace
- [ ] Salvar `workspace_id` ativo no cookie/session
- [ ] `WorkspaceSwitcher` funcional — listar workspaces do usuário e alternar
- [ ] Página `/app/(app)/settings/workspace` — configurações do workspace (nome, logo)
- [ ] Página `/app/(app)/settings/members` — listar membros e papéis
- [ ] Modal `InviteMember` — convidar por e-mail (gera token de convite)
- [ ] Rota `/app/invite/[token]` — aceitar convite e entrar no workspace
- [ ] Envio de e-mail de convite via Resend
- [ ] RLS básica no Supabase: policies de leitura/escrita por `workspace_id`

**Commit final:** `feat: multi-workspace com onboarding, convites por e-mail Resend e RLS base`

---

## Milestone 08 — Backend: Leads & Atividades
**Branch:** `feat/milestone-008-leads-backend`
**Objetivo:** CRUD completo de leads e atividades conectado ao Supabase com RLS.

### Entregas
- [ ] Schema Supabase: tabelas `leads`, `activities` com `workspace_id`
- [ ] RLS policies para `leads` e `activities` (leitura/escrita apenas dentro do workspace)
- [ ] `lib/leads.ts` — funções de acesso ao banco (getLeads, getLead, createLead, updateLead, deleteLead)
- [ ] `lib/activities.ts` — funções (getActivities, createActivity)
- [ ] Server Actions em `app/(app)/leads/actions.ts`
- [ ] Conectar listagem de leads à base real (substituir mock)
- [ ] Conectar formulário de criação/edição de lead ao banco
- [ ] Busca e filtros funcionando via query params + Supabase
- [ ] Conectar página de detalhe do lead ao banco
- [ ] Conectar `ActivityTimeline` ao banco
- [ ] Formulário `AddActivity` salvando no banco

**Commit final:** `feat: CRUD de leads e atividades conectado ao Supabase com RLS`

---

## Milestone 09 — Backend: Pipeline Kanban
**Branch:** `feat/milestone-009-pipeline-backend`
**Objetivo:** Negócios persistidos no banco, drag-and-drop com atualização de etapa em tempo real.

### Entregas
- [ ] Schema Supabase: tabela `deals` com campos (title, value, stage, lead_id, owner_id, due_date, workspace_id)
- [ ] RLS policies para `deals`
- [ ] `lib/deals.ts` — funções (getDeals, getDeal, createDeal, updateDeal, updateDealStage, deleteDeal)
- [ ] Server Actions em `app/(app)/pipeline/actions.ts`
- [ ] Conectar `KanbanBoard` ao banco (substituir mock)
- [ ] Persistir mudança de etapa após drag-and-drop (Server Action ou Route Handler)
- [ ] Formulário `DealForm` salvando no banco
- [ ] Vincular deal ao lead (`lead_id`)
- [ ] Conectar `DealCard` ao detalhe do lead na página de leads

**Commit final:** `feat: pipeline Kanban persistido no Supabase com drag-and-drop e RLS`

---

## Milestone 10 — Backend: Dashboard com Dados Reais
**Branch:** `feat/milestone-010-dashboard-backend`
**Objetivo:** Dashboard exibindo métricas reais calculadas a partir do banco de dados.

### Entregas
- [ ] `lib/metrics.ts` — queries agregadas (count leads, sum pipeline value, conversion rate)
- [ ] Conectar MetricCards a dados reais do Supabase
- [ ] Query de funil: agrupar deals por stage para o gráfico Recharts
- [ ] Conectar `SalesFunnel` a dados reais
- [ ] Query de "negócios com prazo próximo" filtrada pelo usuário logado
- [ ] Conectar `UpcomingDeals` ao banco
- [ ] Otimizar queries com índices no Supabase (seguir `supabase-postgres-best-practices`)

**Commit final:** `feat: dashboard com métricas reais do Supabase e queries otimizadas`

---

## Milestone 11 — Monetização (Stripe)
**Branch:** `feat/milestone-011-stripe`
**Objetivo:** Planos Free e Pro com checkout Stripe, webhook e Customer Portal funcionando.

### Entregas
- [ ] Criar produtos e preços no Stripe Dashboard (Free e Pro R$49/mês)
- [ ] Schema Supabase: coluna `plan` e `stripe_customer_id` em `workspaces`
- [ ] `lib/stripe.ts` — cliente Stripe + funções helpers
- [ ] Página `/app/(app)/settings/billing` — exibir plano atual e botão de upgrade
- [ ] Route Handler `/app/api/stripe/checkout/route.ts` — criar Stripe Checkout Session
- [ ] Route Handler `/app/api/stripe/portal/route.ts` — criar Customer Portal Session
- [ ] Route Handler `/app/api/stripe/webhook/route.ts` — processar eventos (checkout.session.completed, customer.subscription.updated, customer.subscription.deleted)
- [ ] Webhook atualiza `plan` no workspace via Supabase
- [ ] Enforcer de limites do plano Free: bloquear ao atingir 2 membros ou 50 leads
- [ ] Banner de upgrade quando próximo do limite
- [ ] Testar com Stripe CLI + cartões de teste

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
