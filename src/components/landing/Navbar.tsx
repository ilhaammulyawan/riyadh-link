import { Link } from "@tanstack/react-router";
import { Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Navbar() {
  const { user, loading } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight">RSLink</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">by Mulyawan</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#fitur" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Fitur</a>
          <a href="#cara" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cara Pakai</a>
          <a href="#statistik" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Statistik</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={signOut} size="sm" variant="outline">
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
        </div>
      </div>
    </header>
  );
}
