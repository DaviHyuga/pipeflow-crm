"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const FAKE_WORKSPACES = [
  { id: "1", name: "Acme Corp", plan: "Pro" },
  { id: "2", name: "Startup XYZ", plan: "Free" },
  { id: "3", name: "Tech Solutions", plan: "Pro" },
];

export function WorkspaceSwitcher() {
  const [active, setActive] = useState(FAKE_WORKSPACES[0]);

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
          <p className="text-[10px] text-sidebar-foreground/45 leading-tight">
            Plano {active.plan}
          </p>
        </div>
        <ChevronsUpDown className="h-3 w-3 flex-shrink-0 text-sidebar-foreground/35" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" sideOffset={6}>
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-2">
          Workspaces
        </DropdownMenuLabel>
        {FAKE_WORKSPACES.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => setActive(ws)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold">
              {ws.name.charAt(0)}
            </div>
            <span className="flex-1 truncate text-sm">{ws.name}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-4",
                ws.plan === "Pro" && "border-primary/40 text-primary"
              )}
            >
              {ws.plan}
            </Badge>
            {ws.id === active.id && (
              <Check className="h-3 w-3 text-primary flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" />
          <span className="text-sm">Criar workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
