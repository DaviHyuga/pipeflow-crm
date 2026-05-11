"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ActivityType } from "@/types/lead"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, Video, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { createActivityAction } from "@/app/(app)/leads/actions"

const activityTypes: { value: ActivityType; label: string; icon: React.ElementType }[] = [
  { value: "ligacao", label: "Ligação", icon: Phone },
  { value: "email", label: "E-mail", icon: Mail },
  { value: "reuniao", label: "Reunião", icon: Video },
  { value: "nota", label: "Nota", icon: FileText },
]

interface AddActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId: string
}

export function AddActivityModal({ open, onOpenChange, leadId }: AddActivityModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<ActivityType>("ligacao")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    startTransition(async () => {
      await createActivityAction({
        leadId,
        type,
        title: title.trim(),
        description: description.trim(),
      })
      setType("ligacao")
      setTitle("")
      setDescription("")
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Atividade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <div className="grid grid-cols-4 gap-2">
              {activityTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium transition-colors",
                    type === value
                      ? "border-ring bg-primary/10 text-primary"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="act-title" className="block text-sm font-medium mb-1.5">
              Título
            </label>
            <Input
              id="act-title"
              placeholder="Ex: Ligação de acompanhamento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="act-desc" className="block text-sm font-medium mb-1.5">
              Descrição
            </label>
            <textarea
              id="act-desc"
              rows={3}
              placeholder="Detalhes da atividade..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
