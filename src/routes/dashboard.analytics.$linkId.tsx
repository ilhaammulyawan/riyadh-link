import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ArrowLeft, Loader2, MousePointerClick, Calendar, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getShortBase } from "@/lib/links";
import type { LinkRow } from "@/lib/dashboard-types";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend,
} from "recharts";

export const Route = createFileRoute("/dashboard/analytics/$linkId")({
  head: () => ({ meta: [{ title: "Statistik Link — RSLink" }] }),
  component: AnalyticsPage,
});

type Click = {
  clicked_at: string;
  browser: string | null;
  os: string | null;
  device: string | null;
  referrer: string | null;
  country: string | null;
};

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function groupCount<T>(items: T[], key: (t: T) => string | null) {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it) || "Tidak diketahui";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function AnalyticsPage() {
  const { linkId } = useParams({ from: "/dashboard/analytics/$linkId" });
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<LinkRow | null>(null);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { window.location.replace("/login"); return; }
      setEmail(sess.session.user.email ?? "");

      const [{ data: linkData }, { data: clicksData }] = await Promise.all([
        supabase.from("links").select("*").eq("id", linkId).maybeSingle(),
        supabase.from("link_clicks").select("clicked_at, browser, os, device, referrer, country").eq("link_id", linkId).order("clicked_at", { ascending: true }).limit(5000),
      ]);
      setLink(linkData as LinkRow | null);
      setClicks((clicksData ?? []) as Click[]);
      setLoading(false);
    })();
  }, [linkId]);

  const timeseries = useMemo(() => {
    const days = 30;
    const buckets = new Map<string, number>();
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const c of clicks) {
      const k = c.clicked_at.slice(0, 10);
      if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
    return Array.from(buckets.entries()).map(([date, value]) => ({
      date: new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      clicks: value,
    }));
  }, [clicks]);

  const devices = useMemo(() => groupCount(clicks, (c) => c.device), [clicks]);
  const browsers = useMemo(() => groupCount(clicks, (c) => c.browser), [clicks]);
  const os = useMemo(() => groupCount(clicks, (c) => c.os), [clicks]);
  const referrers = useMemo(() => {
    const parsed = clicks.map((c) => {
      if (!c.referrer) return "Langsung";
      try { return new URL(c.referrer).hostname.replace(/^www\./, ""); } catch { return "Langsung"; }
    });
    const map = new Map<string, number>();
    for (const r of parsed) map.set(r, (map.get(r) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [clicks]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader email={email} />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-muted-foreground">Link tidak ditemukan atau Anda tidak punya akses.</p>
          <Button asChild className="mt-4"><Link to="/dashboard">Kembali</Link></Button>
        </main>
      </div>
    );
  }

  const base = getShortBase();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader email={email} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
              <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard</Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {link.title || `/${link.slug}`}
            </h1>
            <a href={`${base}${link.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
              {base}{link.slug}
            </a>
          </div>
          <div className="flex items-center gap-2">
            {link.is_active ? <Badge className="bg-success text-success-foreground">Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>}
            {link.category && <Badge variant="secondary">{link.category}</Badge>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox icon={MousePointerClick} label="Total Klik" value={clicks.length} />
          <StatBox icon={Calendar} label="30 Hari Terakhir" value={timeseries.reduce((s, d) => s + d.clicks, 0)} />
          <StatBox icon={Globe} label="Browser Unik" value={browsers.length} />
          <StatBox icon={Smartphone} label="Perangkat Unik" value={devices.length} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="text-base font-bold">Klik 30 Hari Terakhir</h2>
          <p className="mb-4 text-xs text-muted-foreground">Tren harian total klik.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries}>
                <defs>
                  <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="clicks" stroke="var(--chart-1)" strokeWidth={2} fill="url(#clicksFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Perangkat" subtitle="Distribusi Mobile / Desktop / Tablet">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {devices.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Browser" subtitle="Top browser pengunjung">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={browsers.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {browsers.slice(0, 6).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sistem Operasi" subtitle="Top OS pengunjung">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={os.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={80} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {os.slice(0, 6).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sumber Trafik" subtitle="Domain pengirim teratas">
            {referrers.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Belum ada data.</p>
            ) : (
              <ul className="divide-y divide-border/60">
                {referrers.map((r, i) => {
                  const max = referrers[0].value;
                  return (
                    <li key={r.name} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                        <span className="truncate text-sm">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
                        </div>
                        <span className="w-10 text-right text-sm font-semibold tabular-nums">{r.value}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </ChartCard>
        </div>
      </main>
    </div>
  );
}

function StatBox({ icon: Icon, label, value }: { icon: typeof MousePointerClick; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums">{value.toLocaleString("id-ID")}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mb-4 text-xs text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}
