import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LinkRow } from "@/lib/dashboard-types";

export function EditLinkDialog({ link, open, onOpenChange, onSaved }: {
  link: LinkRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    original_url: "",
    password: "",
    is_active: true,
    open_in_new_tab: true,
    expires_at: "",
    category: "",
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!link) return;
    setForm({
      title: link.title ?? "",
      original_url: link.original_url,
      password: link.password ?? "",
      is_active: link.is_active,
      open_in_new_tab: link.open_in_new_tab,
      expires_at: link.expires_at ? link.expires_at.slice(0, 16) : "",
      category: link.category ?? "",
      tags: (link.tags ?? []).join(", "),
    });
  }, [link]);

  if (!link) return null;

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("links").update({
        title: form.title.trim() || null,
        original_url: form.original_url.trim(),
        password: form.password.trim() || null,
        is_active: form.is_active,
        open_in_new_tab: form.open_in_new_tab,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        category: form.category.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }).eq("id", link.id);
      if (error) throw error;
      toast.success("Link diperbarui");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label className="text-xs">Slug</Label>
            <Input value={link.slug} disabled />
          </div>
          <div>
            <Label className="text-xs">URL Asli</Label>
            <Input value={form.original_url} onChange={(e) => setForm({ ...form, original_url: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Judul</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Kategori</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Akademik" />
            </div>
            <div>
              <Label className="text-xs">Tags (pisahkan koma)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="ppdb, brosur" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Password (opsional)</Label>
              <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Kosongkan jika tidak perlu" />
            </div>
            <div>
              <Label className="text-xs">Kedaluwarsa</Label>
              <Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Link aktif</p>
              <p className="text-xs text-muted-foreground">Nonaktifkan untuk menjeda link.</p>
            </div>
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Buka di tab baru</p>
              <p className="text-xs text-muted-foreground">Aktifkan agar tautan terbuka di tab baru.</p>
            </div>
            <Switch checked={form.open_in_new_tab} onCheckedChange={(v) => setForm({ ...form, open_in_new_tab: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
            {saving ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
