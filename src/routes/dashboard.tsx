import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RSLink" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const [email, setEmail] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.replace("/login");
        return;
      }
      setEmail(data.session.user.email ?? "");
      setReady(true);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    window.location.replace("/");
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">RSLink</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
            <Button onClick={signOut} size="sm" variant="outline"><LogOut className="h-4 w-4" /> Keluar</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Selamat datang 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Dashboard akan dibangun pada Tahap 3 — quick shortener, daftar link, QR Code, edit, dan statistik.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Coba pemendek di{" "}
            <Link to="/" className="font-medium text-primary hover:underline">halaman utama</Link>
            {" "}— link Anda sudah tersimpan ke akun ini.
          </p>
        </div>
      </main>
    </div>
  );
}
