import { Link2, MousePointerClick, CheckCircle2, Clock } from "lucide-react";
import type { LinkRow } from "@/lib/dashboard-types";

export function StatsCards({ links }: { links: LinkRow[] }) {
  const total = links.length;
  const totalClicks = links.reduce((s, l) => s + (l.click_count ?? 0), 0);
  const active = links.filter((l) => l.is_active && (!l.expires_at || new Date(l.expires_at) > new Date())).length;
  const expired = links.filter((l) => l.expires_at && new Date(l.expires_at) < new Date()).length;

  const items = [
    { label: "Total Link", value: total, icon: Link2, color: "from-primary to-primary-glow" },
    { label: "Total Klik", value: totalClicks, icon: MousePointerClick, color: "from-primary-glow to-primary" },
    { label: "Link Aktif", value: active, icon: CheckCircle2, color: "from-success to-primary-glow" },
    { label: "Kedaluwarsa", value: expired, icon: Clock, color: "from-destructive to-primary" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition-shadow hover:shadow-elegant">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{it.label}</p>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${it.color}`}>
              <it.icon className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">{it.value.toLocaleString("id-ID")}</p>
        </div>
      ))}
    </div>
  );
}
