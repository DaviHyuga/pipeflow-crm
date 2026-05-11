import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces, WORKSPACE_COOKIE } from "@/lib/workspaces";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) redirect("/create-workspace");

  const cookieStore = await cookies();
  const savedId = cookieStore.get(WORKSPACE_COOKIE)?.value;
  const activeWorkspaceId =
    workspaces.find((w) => w.id === savedId)?.id ?? workspaces[0].id;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        className="hidden md:flex"
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
      />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar
          user={user}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
