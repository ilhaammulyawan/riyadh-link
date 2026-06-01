import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link2, MousePointerClick, Users, HelpCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Ikhtisar — RSLink" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ links: 0, clicks: 0, users: 0, faqs: 0 });

  useEffect(() => {
    (async () => {
      const [links, clicks, users, faqs] = await Promise.all([
        supabase.from("links").select("*", { count: "exact", head: true }),
        supabase.from("link_clicks").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("faqs").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        links: links.count ?? 0,
        clicks: clicks.count ?? 0,
        users: users.count ?? 0,
        faqs: faqs.count ?? 0,
      });
    })();
  }, []);

  const items = [
    { label: "Total Link", value: stats.links, icon: Link2, to: "/admin/links" },
    { label: "Total Klik", value: stats.clicks, icon: MousePointerClick, to: "/admin/links" },
    { label: "Total Pengguna", value: stats.users, icon: Users, to: "/admin/users" },
    { label: "FAQ Terdaftar", value: stats.faqs, icon: HelpCircle, to: "/admin/faqs" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ikhtisar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ringkasan platform RSLink.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.label}
            to={it.to}
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">{it.label}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{it.value.toLocaleString("id-ID")}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
              <it.icon className="h-5 w-5" />
            </div>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-card p-6">
        <h2 className="text-base font-bold">Tips Admin</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Gunakan menu <strong>Pengaturan Situs</strong> untuk mengubah headline, kontak, dan media sosial.</li>
          <li>• Tambah/hapus pertanyaan di <strong>Kelola FAQ</strong> — perubahan tampil langsung di landing page.</li>
          <li>• Buka <strong>Semua Link</strong> untuk memoderasi tautan yang dibuat civitas.</li>
          <li>• Jadikan rekan kerja sebagai admin via <strong>Pengguna & Role</strong>.</li>
        </ul>
        <p className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
          Selamat bertugas <ArrowRight className="h-4 w-4" />
        </p>
      </div>
    </div>
  );
}
