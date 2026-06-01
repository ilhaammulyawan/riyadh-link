import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Pengaturan Situs — Admin" }] }),
  component: AdminSettings,
});

const FIELDS: { key: string; label: string; type?: "text" | "textarea"; placeholder?: string; section: string }[] = [
  { key: "site_name", label: "Nama Situs", section: "Identitas" },
  { key: "tagline", label: "Tagline", section: "Identitas" },
  { key: "meta_description", label: "Meta Description (SEO)", type: "textarea", section: "Identitas" },
  { key: "hero_headline", label: "Headline Hero", type: "textarea", section: "Hero" },
  { key: "hero_subheadline", label: "Sub-headline Hero", type: "textarea", section: "Hero" },
  { key: "hero_cta", label: "Tombol CTA Hero", section: "Hero" },
  { key: "footer_description", label: "Deskripsi Footer", type: "textarea", section: "Footer & Kontak" },
  { key: "contact_email", label: "Email Kontak", section: "Footer & Kontak" },
  { key: "contact_address", label: "Alamat", section: "Footer & Kontak" },
  { key: "social_instagram", label: "URL Instagram", placeholder: "https://instagram.com/...", section: "Sosial Media" },
  { key: "social_facebook", label: "URL Facebook", placeholder: "https://facebook.com/...", section: "Sosial Media" },
  { key: "social_youtube", label: "URL YouTube", placeholder: "https://youtube.com/...", section: "Sosial Media" },
  { key: "copyright_text", label: "Teks Copyright", section: "Footer & Kontak" },
];

function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        const r: Record<string, string> = {};
        for (const f of FIELDS) r[f.key] = ((data as Record<string, unknown>)[f.key] as string) ?? "";
        setForm(r);
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const payload: Record<string, string | null> = {};
    for (const f of FIELDS) payload[f.key] = form[f.key]?.trim() || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("site_settings").update(payload as any).eq("id", 1);
    if (error) toast.error(error.message);
    else toast.success("Pengaturan disimpan");
    setSaving(false);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const sections = Array.from(new Set(FIELDS.map((f) => f.section)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan Situs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ubah informasi yang tampil di landing page dan footer.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      {sections.map((sec) => (
        <div key={sec} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-base font-bold">{sec}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.filter((f) => f.section === sec).map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label className="text-xs">{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    rows={3}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <Input
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
