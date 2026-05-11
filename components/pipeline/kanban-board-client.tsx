"use client"

import dynamic from "next/dynamic"

// ssr: false precisa estar num Client Component.
// @dnd-kit gera aria-describedby com IDs que divergem entre servidor e
// cliente — desativar SSR elimina o hydration mismatch.
export const KanbanBoardClient = dynamic(
  () => import("./kanban-board").then((m) => m.KanbanBoard),
  { ssr: false }
)
