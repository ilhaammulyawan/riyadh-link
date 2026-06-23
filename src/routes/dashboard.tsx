import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickShorten } from "@/components/dashboard/QuickShorten";
import { LinksTable } from "@/components/dashboard/LinksTable";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent } from "@/components/ui/card";
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
        <StatsCards links={links} />
        <QuickShorten userId={userId} onCreated={() => fetchLinks(userId)} />
        <LinksTable links={links} onChanged={() => fetchLinks(userId)} />
      </main>
    </div>
  );
}
