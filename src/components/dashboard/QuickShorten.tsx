import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const original = normalizeUrl(url);
      let finalSlug = slug.trim() || makeRandomSlug(6);
      if (!isValidSlug(finalSlug)) throw new Error("Slug 3-40 karakter (a-z, 0-9, -, _)");

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
      });
      if (error) throw error;

      toast.success("Link berhasil dipendekkan!");
      setUrl(""); setSlug(""); setTitle("");
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
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
        <div className="md:col-span-1">
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
      </form>
    </div>
  );
}
