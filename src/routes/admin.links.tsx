import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ExternalLink, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getShortBase } from "@/lib/links";

export const Route = createFileRoute("/admin/links")({
  head: () => ({ meta: [{ title: "Semua Link — Admin" }] }),
  component: AdminLinks,
});

type Row = {
  id: string;
  slug: string;
  original_url: string;
  title: string | null;
  is_active: boolean;
  click_count: number;
  created_at: string;
  user_id: string;
  profile?: { full_name: string | null; email: string | null } | null;
};

function AdminLinks() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: links } = await supabase.from("links").select("*").order("created_at", { ascending: false }).limit(500);
    const linksData = (links ?? []) as Row[];
    const userIds = Array.from(new Set(linksData.map((l) => l.user_id)));
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      for (const l of linksData) l.profile = map.get(l.user_id) ?? null;
    }
    setRows(linksData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, current: boolean) => {
    const { error } = await supabase.from("links").update({ is_active: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Link ${!current ? "diaktifkan" : "dinonaktifkan"}`);
    setRows(rows.map((r) => r.id === id ? { ...r, is_active: !current } : r));
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus link ini secara permanen?")) return;
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Link dihapus");
    setRows(rows.filter((r) => r.id !== id));
  };

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return r.slug.toLowerCase().includes(s)
      || r.original_url.toLowerCase().includes(s)
      || (r.title ?? "").toLowerCase().includes(s)
      || (r.profile?.email ?? "").toLowerCase().includes(s);
  });

  const base = getShortBase();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Semua Link</h1>
        <p className="mt-1 text-sm text-muted-foreground">Moderasi tautan dari seluruh pengguna ({rows.length} link).</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="border-b border-border/60 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari slug, URL, judul, atau email pemilik..." className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Tidak ada link.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 p-4 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`${base}${r.slug}`} target="_blank" rel="noreferrer" className="font-mono text-sm font-semibold text-primary hover:underline">
                      /{r.slug}
                    </a>
                    {!r.is_active && <Badge variant="outline">Nonaktif</Badge>}
                    {r.profile?.email && <Badge variant="secondary" className="text-xs">{r.profile.email}</Badge>}
                  </div>
                  {r.title && <p className="mt-1 truncate text-sm font-medium">{r.title}</p>}
                  <a href={r.original_url} target="_blank" rel="noreferrer" className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{r.original_url}</span>
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums">{r.click_count.toLocaleString("id-ID")}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">klik</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => toggle(r.id, r.is_active)} title={r.is_active ? "Nonaktifkan" : "Aktifkan"}>
                    {r.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
