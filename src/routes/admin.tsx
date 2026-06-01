import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, Settings, HelpCircle, Link2 as LinkIcon, Users, ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — RSLink" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof Shield; exact?: boolean }[] = [
  { to: "/admin", label: "Ikhtisar", icon: Shield, exact: true },
  { to: "/admin/settings", label: "Pengaturan Situs", icon: Settings },
  { to: "/admin/faqs", label: "Kelola FAQ", icon: HelpCircle },
  { to: "/admin/links", label: "Semua Link", icon: LinkIcon },
  { to: "/admin/users", label: "Pengguna & Role", icon: Users },
];

function AdminLayout() {
  const [state, setState] = useState<"checking" | "ok" | "forbidden">("checking");
  const [email, setEmail] = useState("");
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { window.location.replace("/login"); return; }
      setEmail(sess.session.user.email ?? "");
      const { data } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", sess.session.user.id).eq("role", "admin").maybeSingle();
      setState(data ? "ok" : "forbidden");
    })();
  }, []);

  if (state === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state === "forbidden") {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader email={email} />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Akses ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hanya pengguna dengan peran <span className="font-semibold">Admin</span> yang bisa mengakses halaman ini.
          </p>
          <Button asChild className="mt-6"><Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard</Link></Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader email={email} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold">Admin Panel</h2>
          </div>
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
