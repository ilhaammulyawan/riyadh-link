import { useState } from "react";
import { ArrowRight, Link2, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { makeRandomSlug, normalizeUrl, getShortBase } from "@/lib/links";
import { Link as RouterLink } from "@tanstack/react-router";

export function Hero() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    let normalized: string;
    try { normalized = normalizeUrl(url); } catch { return toast.error("URL tidak valid"); }
    if (!user) {
      toast.info("Daftar / masuk untuk menyimpan link permanen");
      return;
    }
    setLoading(true);
    let slug = makeRandomSlug();
    // retry up to 3x on slug conflict
    for (let i = 0; i < 3; i++) {
      const { data, error } = await supabase
        .from("links")
        .insert({ slug, original_url: normalized, user_id: user.id })
        .select("slug")
        .single();
      if (!error && data) { setShortened(`${getShortBase()}${data.slug}`); break; }
      if (error?.code === "23505") { slug = makeRandomSlug(7); continue; }
      setLoading(false);
      return toast.error(error?.message ?? "Gagal membuat link");
    }
    setLoading(false);
    toast.success("Link berhasil dipendekkan!");
  };

  const copy = async () => {
    if (!shortened) return;
    await navigator.clipboard.writeText(shortened);
    setCopied(true);
    toast.success("Disalin");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="absolute left-1/2 top-20 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-glow" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Khusus civitas SMA Riyadhussholihiin
          </div>

          <h1 className="mt-6 animate-fade-up text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Pendekkan, Kelola, dan Pantau{" "}
            <span className="text-gradient">Link Anda</span> dengan Mudah
          </h1>

          <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-base text-muted-foreground sm:text-lg" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
            Platform URL Shortener modern untuk civitas SMA Riyadhussholihiin.
            Lengkap dengan QR Code, password, analitik, dan kategori link.
          </p>

          <form
            onSubmit={handleShorten}
            className="mx-auto mt-10 flex max-w-2xl animate-scale-in flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-elegant sm:flex-row sm:p-2"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Tempel URL panjang, contoh: https://drive.google.com/xxxxx"
                className="h-12 border-0 bg-transparent pl-11 text-base shadow-none focus-visible:ring-0"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="h-12 bg-gradient-primary px-6 text-primary-foreground shadow-soft transition hover:opacity-90"
            >
              {loading ? "Memendekkan..." : "Pendekkan Sekarang"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          {shortened && (
            <div className="mx-auto mt-4 flex max-w-2xl animate-fade-up items-center justify-between gap-3 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
              <a href={shortened} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2 truncate text-sm font-medium hover:underline">
                <ExternalLink className="h-4 w-4 shrink-0 text-success" />
                <span className="truncate">{shortened}</span>
              </a>
              <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? "Tersalin" : "Salin"}
              </Button>
            </div>
          )}

          {!user && (
            <p className="mt-6 text-xs text-muted-foreground">
              <RouterLink to="/register" className="font-medium text-primary hover:underline">Daftar gratis</RouterLink>
              {" "}atau{" "}
              <RouterLink to="/login" className="font-medium text-primary hover:underline">masuk</RouterLink>
              {" "}untuk menyimpan dan mengelola link.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
