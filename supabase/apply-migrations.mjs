/**
 * apply-migrations.mjs — Aplica as migrations via Supabase Management API
 *
 * Uso:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxxx node supabase/apply-migrations.mjs
 *
 * Como obter o token:
 *   1. Acesse https://supabase.com/dashboard/account/tokens
 *   2. Crie um "Access Token" (Personal Access Token)
 *   3. Cole no comando acima ou adicione ao .env.local como SUPABASE_ACCESS_TOKEN
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PROJECT_REF = 'rqrqpfnwxuutzjfyeisi'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!ACCESS_TOKEN) {
  console.error('❌ Variável SUPABASE_ACCESS_TOKEN não definida.')
  console.error('')
  console.error('Como obter:')
  console.error('  1. Acesse https://supabase.com/dashboard/account/tokens')
  console.error('  2. Crie um Access Token')
  console.error('  3. Execute: SUPABASE_ACCESS_TOKEN=sbp_xxx node supabase/apply-migrations.mjs')
  process.exit(1)
}

const migrationsDir = join(__dirname, 'migrations')
const files = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()

console.log(`🚀 Aplicando ${files.length} migrations no projeto ${PROJECT_REF}...\n`)

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf-8')
  console.log(`📄 ${file}...`)

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  )

  if (!response.ok) {
    const body = await response.text()
    console.error(`❌ Erro ao aplicar ${file}:`, response.status, body)
    process.exit(1)
  }

  const result = await response.json()
  if (result.error) {
    console.error(`❌ Erro SQL em ${file}:`, result.error)
    process.exit(1)
  }

  console.log(`   ✅ OK`)
}

console.log('\n✅ Todas as migrations aplicadas com sucesso!')
console.log('\nPara gerar os tipos TypeScript atualizados:')
console.log(`  npx supabase gen types typescript --project-id ${PROJECT_REF} > src/types/supabase.ts`)
