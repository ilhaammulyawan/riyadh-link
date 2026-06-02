import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, QrCode, Pencil, Trash2, BarChart3, ExternalLink, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getShortBase } from "@/lib/links";
import { QrDialog } from "./QrDialog";
import { EditLinkDialog } from "./EditLinkDialog";
import type { LinkRow } from "@/lib/dashboard-types";

export function LinksTable({ links, onChanged }: { links: LinkRow[]; onChanged: () => void }) {
  const [q, setQ] = useState("");
  const [qr, setQr] = useState<LinkRow | null>(null);
  const [edit, setEdit] = useState<LinkRow | null>(null);
  const [del, setDel] = useState<LinkRow | null>(null);
  const base = getShortBase();

  const filtered = links.filter((l) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return l.slug.toLowerCase().includes(s) || l.original_url.toLowerCase().includes(s) || (l.title ?? "").toLowerCase().includes(s);
  });

  const copy = async (slug: string) => {
    await navigator.clipboard.writeText(`${base}${slug}`);
    toast.success("Tautan disalin");
  };

  const remove = async () => {
    if (!del) return;
    const { error } = await supabase.from("links").delete().eq("id", del.id);
    if (error) toast.error(error.message);
    else { toast.success("Link dihapus"); onChanged(); }
    setDel(null);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-soft">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold">Link Saya</h2>
          <p className="text-xs text-muted-foreground">{links.length} link total</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari slug, judul, atau URL..." className="pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-muted-foreground">{links.length === 0 ? "Belum ada link. Buat pertama Anda di atas!" : "Tidak ada hasil."}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {filtered.map((l) => {
            const expired = l.expires_at && new Date(l.expires_at) < new Date();
            return (
              <li key={l.id} className="group flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`${base}${l.slug}`} target="_blank" rel="noreferrer" className="font-mono text-sm font-semibold text-primary hover:underline">
                      {base.replace(/^https?:\/\//, "").replace(/\/$/, "")}/{l.slug}
                    </a>
                    {!l.is_active && <Badge variant="outline" className="text-xs">Nonaktif</Badge>}
                    {expired && <Badge variant="destructive" className="text-xs">Kedaluwarsa</Badge>}
                    {l.password && <Badge variant="secondary" className="text-xs"><Lock className="mr-1 h-3 w-3" />Password</Badge>}
                    {l.category && <Badge variant="secondary" className="text-xs">{l.category}</Badge>}
                  </div>
                  {l.title && <p className="mt-1 truncate text-sm font-medium">{l.title}</p>}
                  <a href={l.original_url} target="_blank" rel="noreferrer" className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{l.original_url}</span>
                  </a>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums">{l.click_count.toLocaleString("id-ID")}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">klik</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => copy(l.slug)} title="Salin">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setQr(l)} title="QR Code">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" asChild title="Statistik">
                    <Link to="/dashboard/analytics/$linkId" params={{ linkId: l.id }}>
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEdit(l)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDel(l)} title="Hapus" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <QrDialog open={!!qr} onOpenChange={(v) => !v && setQr(null)} url={qr ? `${base}${qr.slug}` : ""} slug={qr?.slug ?? ""} />
      <EditLinkDialog link={edit} open={!!edit} onOpenChange={(v) => !v && setEdit(null)} onSaved={onChanged} />

      <AlertDialog open={!!del} onOpenChange={(v) => !v && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus link ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Link <span className="font-mono font-semibold">/{del?.slug}</span> dan semua statistiknya akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
