#!/usr/bin/env bash
# =============================================================================
# apply-migrations.sh — Aplica as migrations no projeto Supabase remoto
#
# Pré-requisitos:
#   1. npx supabase login   (autenticar com conta Supabase — abre browser)
#   2. bash supabase/apply-migrations.sh
# =============================================================================
set -e

PROJECT_REF="rqrqpfnwxuutzjfyeisi"

echo "🔗 Vinculando projeto Supabase..."
npx supabase link --project-ref "$PROJECT_REF"

echo "🚀 Aplicando migrations..."
npx supabase db push

echo ""
echo "✅ Migrations aplicadas com sucesso!"
echo ""
echo "Para regenerar os tipos TypeScript:"
echo "  npx supabase gen types typescript --project-id $PROJECT_REF > src/types/supabase.ts"
