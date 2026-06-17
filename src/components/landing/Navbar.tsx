import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Link2, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara", label: "Cara Pakai" },
  { href: "#statistik", label: "Statistik" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-base font-bold tracking-tight">RSLink</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">SMA RIYADHUSSHOLIHIIN</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">{n.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          {loading ? null : user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={signOut} size="sm" variant="outline" className="hidden sm:inline-flex">
                <LogOut className="h-4 w-4" /> Keluar
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90">
                <Link to="/register">Daftar</Link>
              </Button>
            </>
          )}

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
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {n.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-border/60 px-4 pt-4">
                {user ? (
                  <>
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button onClick={() => { signOut(); setOpen(false); }} variant="ghost">
                      <LogOut className="h-4 w-4" /> Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/login">Masuk</Link>
                    </Button>
                    <Button asChild className="bg-gradient-primary text-primary-foreground" onClick={() => setOpen(false)}>
                      <Link to="/register">Daftar</Link>
                    </Button>
                  </>
                )}
                <div className="mt-2 flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Tema</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
