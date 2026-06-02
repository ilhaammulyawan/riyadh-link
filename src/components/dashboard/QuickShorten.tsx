import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, Lock, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValidSlug, makeRandomSlug, normalizeUrl } from "@/lib/links";

export function QuickShorten({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const original = normalizeUrl(url);
      let finalSlug = slug.trim() || makeRandomSlug(6);
      if (!isValidSlug(finalSlug)) throw new Error("Slug 3-40 karakter (a-z, 0-9, -, _)");

      if (password && password.length > 100) throw new Error("Password maksimal 100 karakter");
      let expiresIso: string | null = null;
      if (expiresAt) {
        const d = new Date(expiresAt);
        if (isNaN(d.getTime())) throw new Error("Tanggal kadaluarsa tidak valid");
        if (d.getTime() <= Date.now()) throw new Error("Tanggal kadaluarsa harus di masa depan");
        expiresIso = d.toISOString();
      }

      // collision check
      const { data: existing } = await supabase.from("links").select("id").eq("slug", finalSlug).maybeSingle();
      if (existing) {
        if (slug) throw new Error("Slug sudah digunakan, coba yang lain");
        finalSlug = makeRandomSlug(7);
      }

      const { error } = await supabase.from("links").insert({
        user_id: userId,
        slug: finalSlug,
        original_url: original,
        title: title.trim() || null,
        password: password.trim() || null,
        expires_at: expiresIso,
      });
      if (error) throw error;

      toast.success("Link berhasil dipendekkan!");
      setUrl(""); setSlug(""); setTitle(""); setPassword(""); setExpiresAt("");
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-base font-bold">Pendekkan Cepat</h2>
          <p className="text-xs text-muted-foreground">Buat tautan pendek baru dalam hitungan detik.</p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <div>
            <Label className="text-xs">URL Asli</Label>
            <Input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://contoh.com/halaman-panjang" />
          </div>
          <div>
            <Label className="text-xs">Slug (opsional)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-kustom" />
          </div>
          <div>
            <Label className="text-xs">Judul (opsional)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brosur PPDB 2026" />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground md:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pendekkan"}
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          Opsi lanjutan (password & kadaluarsa)
        </button>

        {showAdvanced && (
          <div className="grid gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-3 md:grid-cols-2">
            <div>
              <Label className="flex items-center gap-1.5 text-xs">
                <Lock className="h-3 w-3" /> Password (opsional)
              </Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Pengunjung wajib masukkan ini"
                maxLength={100}
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 text-xs">
                <CalendarClock className="h-3 w-3" /> Kadaluarsa (opsional)
              </Label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
