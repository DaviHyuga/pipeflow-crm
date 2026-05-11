"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Depoimentos", href: "#testimonials" },
  { label: "Preços", href: "#pricing" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-white/8 bg-[oklch(0.145_0_0)]/90 backdrop-blur-xl shadow-2xl shadow-black/30"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/40 transition-shadow group-hover:shadow-primary/60">
            <span className="text-sm font-bold text-primary-foreground">P</span>
          </div>
          <span className={cn("text-[15px] font-semibold tracking-tight transition-colors", scrolled ? "text-white" : "text-foreground")}>PipeFlow</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-1.5 text-sm transition-colors rounded-lg",
                scrolled
                  ? "text-white/70 hover:text-white hover:bg-white/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-1">
          <ThemeToggle size="icon-sm" />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              scrolled && "text-white/80 hover:text-white hover:bg-white/10"
            )}
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "px-4 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            )}
          >
            Começar grátis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-[oklch(0.145_0_0)]/95 backdrop-blur-xl px-4 py-4 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/8 mt-2">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs text-muted-foreground">Aparência</span>
              <ThemeToggle size="icon-sm" />
            </div>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-center")}
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}
            >
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
