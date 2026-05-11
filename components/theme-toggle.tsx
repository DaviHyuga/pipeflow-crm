"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

interface ThemeToggleProps {
  className?: string
  size?: "icon" | "icon-sm"
}

export function ThemeToggle({ className, size = "icon" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggle}
      className={className}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-muted-foreground" />
      ) : (
        <Moon className="size-4 text-muted-foreground" />
      )}
    </Button>
  )
}
