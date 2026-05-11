"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { switchWorkspace } from "@/lib/workspace-actions";
import type { WorkspaceWithRole } from "@/lib/workspaces";

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceWithRole[];
  activeWorkspaceId: string;
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const active =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];

  async function handleSwitch(id: string) {
    if (id === activeWorkspaceId) return;
    await switchWorkspace(id);
    router.refresh();
  }

  if (!active) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent/60 outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-sidebar-primary/15 text-sidebar-primary text-[11px] font-bold">
          {active.name.charAt(0)}
        </div>
        <div className="flex-1 overflow-hidden text-left">
          <p className="truncate text-xs font-semibold text-sidebar-foreground leading-tight">
            {active.name}
          </p>
          <p className="text-[10px] text-sidebar-foreground/45 leading-tight capitalize">
            Plano {active.plan}
          </p>
        </div>
        <ChevronsUpDown className="h-3 w-3 flex-shrink-0 text-sidebar-foreground/35" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-2">
            Workspaces
          </DropdownMenuLabel>
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => handleSwitch(ws.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold">
                {ws.name.charAt(0)}
              </div>
              <span className="flex-1 truncate text-sm">{ws.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 capitalize",
                  ws.plan === "pro" && "border-primary/40 text-primary",
                )}
              >
                {ws.plan}
              </Badge>
              {ws.id === activeWorkspaceId && (
                <Check className="h-3 w-3 text-primary flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/create-workspace")}
          className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Criar workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
