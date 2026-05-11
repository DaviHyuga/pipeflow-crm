"use client";

import { useState } from "react";
import { Menu, Bell, LogOut, Settings, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";
import type { WorkspaceWithRole } from "@/lib/workspaces";

interface TopbarProps {
  user: SupabaseUser;
  workspaces: WorkspaceWithRole[];
  activeWorkspaceId: string;
}

export function Topbar({ user, workspaces, activeWorkspaceId }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName: string =
    user.user_metadata?.full_name ?? user.email ?? "Usuário";
  const email = user.email ?? "";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* App name — mobile only */}
        <span className="font-semibold text-sm md:hidden flex-1">
          PipeFlow
        </span>

        {/* Spacer — desktop */}
        <div className="flex-1 hidden md:block" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle size="icon" className="h-8 w-8" />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "h-8 w-8 rounded-full cursor-pointer bg-transparent border-0",
                "inline-flex items-center justify-center",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
              aria-label="Menu do usuário"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={user.user_metadata?.avatar_url ?? ""}
                  alt={displayName}
                />
                <AvatarFallback className="text-[11px] font-semibold bg-primary/15 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal pb-1">
                  <p className="text-sm font-semibold leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{email}</p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile sidebar via Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="p-0 bg-sidebar border-sidebar-border"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de navegação</SheetTitle>
          </SheetHeader>
          <Sidebar
            className="flex w-full border-none"
            onNavigate={() => setMobileOpen(false)}
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
