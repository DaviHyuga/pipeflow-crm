import { cn } from "@/lib/utils";
import { SidebarNav } from "@/components/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm">
          <span className="text-[13px] font-bold text-sidebar-primary-foreground">
            P
          </span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
          PipeFlow
        </span>
      </div>

      {/* Workspace switcher */}
      <div className="border-b border-sidebar-border px-3 py-2.5">
        <WorkspaceSwitcher />
      </div>

      {/* Navigation */}
      <SidebarNav onNavigate={onNavigate} />

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-[11px] text-sidebar-foreground/30 text-center">
          PipeFlow CRM · v0.1
        </p>
      </div>
    </aside>
  );
}
