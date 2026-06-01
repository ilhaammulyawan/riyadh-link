import { Link } from "@tanstack/react-router";
import { Link2, LogOut, BarChart3, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

export function DashboardHeader({ email }: { email: string }) {
  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    window.location.replace("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">RSLink</span>
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
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
          <Button onClick={signOut} size="sm" variant="outline">
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
