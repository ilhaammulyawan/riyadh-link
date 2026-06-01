import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Shield, ShieldOff, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Pengguna & Role — Admin" }] }),
  component: AdminUsers,
});

type ProfileRow = { id: string; email: string | null; full_name: string | null; created_at: string };

function AdminUsers() {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [me, setMe] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const [{ data: sess }, { data: profs }, { data: roles }] = await Promise.all([
      supabase.auth.getSession(),
      supabase.from("profiles").select("id, email, full_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    setMe(sess.session?.user.id ?? "");
    setUsers((profs ?? []) as ProfileRow[]);
    setAdminIds(new Set((roles ?? []).map((r) => r.user_id)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promote = async (uid: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("Dijadikan admin");
    setAdminIds(new Set([...adminIds, uid]));
  };

  const demote = async (uid: string) => {
    if (uid === me) {
      if (!confirm("Anda akan mencabut peran admin dari akun Anda sendiri. Lanjutkan?")) return;
    }
    const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Peran admin dicabut");
    const next = new Set(adminIds); next.delete(uid); setAdminIds(next);
  };

  const filtered = users.filter((u) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (u.email ?? "").toLowerCase().includes(s) || (u.full_name ?? "").toLowerCase().includes(s);
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengguna & Role</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola peran admin pada akun pengguna ({users.length} total, {adminIds.size} admin).</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="border-b border-border/60 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau email..." className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Tidak ada pengguna.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((u) => {
              const isAdmin = adminIds.has(u.id);
              return (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-muted/30">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{u.full_name || u.email || "Pengguna"}</p>
                        {isAdmin && <Badge className="bg-gradient-primary text-primary-foreground">Admin</Badge>}
                        {u.id === me && <Badge variant="outline">Anda</Badge>}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <Button size="sm" variant="outline" onClick={() => demote(u.id)}>
                      <ShieldOff className="h-4 w-4" /> Cabut Admin
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => promote(u.id)} className="bg-gradient-primary text-primary-foreground">
                      <Shield className="h-4 w-4" /> Jadikan Admin
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
