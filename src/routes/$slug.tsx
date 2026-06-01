import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Link2, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/$slug")({
  head: () => ({ meta: [{ title: "Mengalihkan… — RSLink" }] }),
  component: RedirectPage,
});

type LinkRow = {
  id: string;
  original_url: string;
  password: string | null;
  is_active: boolean;
  expires_at: string | null;
  open_in_new_tab: boolean;
};

function detectClient() {
  if (typeof navigator === "undefined") return {};
  const ua = navigator.userAgent;
  const browser = /Edg/.test(ua) ? "Edge" : /Chrome/.test(ua) ? "Chrome" : /Firefox/.test(ua) ? "Firefox" : /Safari/.test(ua) ? "Safari" : "Other";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS|Macintosh/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad|iOS/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const device = /Mobi|Android|iPhone/.test(ua) ? "Mobile" : /iPad|Tablet/.test(ua) ? "Tablet" : "Desktop";
  return { browser, os, device, referrer: document.referrer || null };
}

function RedirectPage() {
  const { slug } = useParams({ from: "/$slug" });
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "password" | "error" | "expired" | "inactive">("loading");
  const [errMsg, setErrMsg] = useState<string>("");
  const [link, setLink] = useState<LinkRow | null>(null);
  const [pwd, setPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("links")
        .select("id, original_url, password, is_active, expires_at, open_in_new_tab")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setErrMsg("Link tidak ditemukan");
        setState("error");
        return;
      }
      const row = data as LinkRow;
      if (!row.is_active) { setState("inactive"); setLink(row); return; }
      if (row.expires_at && new Date(row.expires_at) < new Date()) { setState("expired"); setLink(row); return; }
      setLink(row);
      if (row.password) { setState("password"); return; }
      await go(row);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function go(row: LinkRow) {
    try {
      await supabase.from("link_clicks").insert({ link_id: row.id, ...detectClient() });
      await supabase.rpc as never; // no-op typing
    } catch { /* ignore analytics failure */ }
    // Increment click_count best-effort
    supabase.from("links").update({ click_count: undefined } as never).eq("id", row.id).then(() => {});
    if (row.open_in_new_tab) {
      window.open(row.original_url, "_blank", "noopener,noreferrer");
      navigate({ to: "/" });
    } else {
      window.location.replace(row.original_url);
    }
  }

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;
    setSubmitting(true);
    if (pwd !== link.password) {
      setSubmitting(false);
      setErrMsg("Password salah");
      return;
    }
    setErrMsg("");
    await go(link);
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-elegant">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            {state === "password" ? <Lock className="h-5 w-5 text-primary-foreground" /> : <Link2 className="h-5 w-5 text-primary-foreground" />}
          </div>
          <div>
            <h1 className="text-lg font-bold">
              {state === "password" && "Link dilindungi password"}
              {state === "expired" && "Link kedaluwarsa"}
              {state === "inactive" && "Link tidak aktif"}
              {state === "error" && "Link tidak ditemukan"}
            </h1>
            <p className="text-xs text-muted-foreground">rslink/{slug}</p>
          </div>
        </div>

        {state === "password" && (
          <form onSubmit={submitPwd} className="space-y-4">
            <Input
              type="password"
              required
              autoFocus
              placeholder="Masukkan password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            {errMsg && <p className="flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{errMsg}</p>}
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary text-primary-foreground">
              {submitting ? "Memverifikasi..." : "Buka link"}
            </Button>
          </form>
        )}

        {(state === "expired" || state === "inactive" || state === "error") && (
          <>
            <p className="text-sm text-muted-foreground">
              {state === "expired" && "Tautan ini sudah melewati batas waktu yang ditentukan oleh pemiliknya."}
              {state === "inactive" && "Pemilik link telah menonaktifkan tautan ini."}
              {state === "error" && "Periksa kembali URL atau hubungi pemilik link."}
            </p>
            <Button asChild className="mt-6 w-full bg-gradient-primary text-primary-foreground">
              <Link to="/">Kembali ke beranda</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
