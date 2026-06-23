import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickShorten } from "@/components/dashboard/QuickShorten";
import { LinksTable } from "@/components/dashboard/LinksTable";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LinkRow } from "@/lib/dashboard-types";
import { Loader2, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RSLink" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setLinks((data ?? []) as LinkRow[]);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.replace("/login");
        return;
      }
      setUserId(data.session.user.id);
      setEmail(data.session.user.email ?? "");
      await fetchLinks(data.session.user.id);
      setLoading(false);
    })();
  }, [fetchLinks]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader email={email} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola tautan, pantau klik, dan unduh QR code dari satu tempat.</p>
        </div>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Baru di RSLink?</p>
                <p className="text-sm text-muted-foreground">Baca buku petunjuk untuk memahami cara memendekkan link, QR Code, dan statistik.</p>
              </div>
            </div>
            <Button asChild variant="outline" className="shrink-0 bg-card">
              <Link to="/dashboard/panduan">
                Buka Panduan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <StatsCards links={links} />
        <QuickShorten userId={userId} onCreated={() => fetchLinks(userId)} />
        <LinksTable links={links} onChanged={() => fetchLinks(userId)} />
      </main>
    </div>
  );
}
