import { Link } from "@tanstack/react-router";
import { Link2, LogOut, BarChart3, LayoutDashboard, Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

export function DashboardHeader({ email }: { email: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", sess.session.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    window.location.replace("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-base font-bold tracking-tight">RSLink</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">SMA RIYADHUSSHOLIHIIN</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-primary/10 text-primary" }}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" /> Link Saya
            </Link>
            <span className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground">
              <BarChart3 className="h-4 w-4" /> Statistik
            </span>
            {isAdmin && (
              <Link
                to="/admin"
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <span className="hidden max-w-[180px] truncate text-sm text-muted-foreground lg:inline">{email}</span>
          <Button onClick={signOut} size="sm" variant="outline" className="hidden sm:inline-flex">
            <LogOut className="h-4 w-4" /> Keluar
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-2 px-4 text-xs text-muted-foreground">{email}</div>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <LayoutDashboard className="h-4 w-4" /> Link Saya
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                )}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-border/60 px-4 pt-4">
                <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Tema</span>
                  <ThemeToggle />
                </div>
                <Button onClick={() => { signOut(); setOpen(false); }} variant="outline">
                  <LogOut className="h-4 w-4" /> Keluar
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
