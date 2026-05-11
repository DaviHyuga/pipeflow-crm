"use client"

import { useState } from "react"
import { Activity, ActivityType } from "@/types/lead"
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
  onAdd: (activity: Activity) => void
}

export function AddActivityModal({
  open,
  onOpenChange,
  leadId,
  onAdd,
}: AddActivityModalProps) {
  const [type, setType] = useState<ActivityType>("ligacao")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const activity: Activity = {
      id: `act-${Date.now()}`,
      leadId,
      type,
      title: title.trim(),
      description: description.trim(),
      date,
      author: "Rafael Torres",
    }

    onAdd(activity)
    resetForm()
    onOpenChange(false)
  }

  function resetForm() {
    setType("ligacao")
    setTitle("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Atividade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
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
                      : "border-border hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
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

          {/* Descrição */}
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

          {/* Data */}
          <div>
            <label htmlFor="act-date" className="block text-sm font-medium mb-1.5">
              Data
            </label>
            <Input
              id="act-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
