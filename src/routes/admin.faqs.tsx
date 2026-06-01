import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, GripVertical, Save } from "lucide-react";

export const Route = createFileRoute("/admin/faqs")({
  head: () => ({ meta: [{ title: "Kelola FAQ — Admin" }] }),
  component: AdminFaqs,
});

type Faq = { id: string; question: string; answer: string; sort_order: number };

function AdminFaqs() {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({ question: "", answer: "" });

  const load = async () => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    setItems((data ?? []) as Faq[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!adding.question.trim() || !adding.answer.trim()) {
      toast.error("Pertanyaan dan jawaban wajib diisi");
      return;
    }
    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("faqs").insert({
      question: adding.question.trim(),
      answer: adding.answer.trim(),
      sort_order: nextOrder,
    });
    if (error) return toast.error(error.message);
    toast.success("FAQ ditambahkan");
    setAdding({ question: "", answer: "" });
    load();
  };

  const update = async (faq: Faq) => {
    const { error } = await supabase.from("faqs").update({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
    }).eq("id", faq.id);
    if (error) return toast.error(error.message);
    toast.success("FAQ diperbarui");
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus FAQ ini?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("FAQ dihapus");
    load();
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kelola FAQ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tambah, edit, atau hapus pertanyaan yang tampil di landing page.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold"><Plus className="h-4 w-4" /> Tambah FAQ baru</h2>
        <div className="grid gap-3">
          <div>
            <Label className="text-xs">Pertanyaan</Label>
            <Input value={adding.question} onChange={(e) => setAdding({ ...adding, question: e.target.value })} placeholder="Contoh: Apakah RSLink gratis?" />
          </div>
          <div>
            <Label className="text-xs">Jawaban</Label>
            <Textarea rows={3} value={adding.answer} onChange={(e) => setAdding({ ...adding, answer: e.target.value })} placeholder="Jawaban lengkap..." />
          </div>
          <div>
            <Button onClick={add} className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Tambahkan</Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Belum ada FAQ.
          </p>
        )}
        {items.map((faq, idx) => (
          <div key={faq.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={faq.question}
                  onChange={(e) => setItems(items.map((i) => i.id === faq.id ? { ...i, question: e.target.value } : i))}
                  className="font-medium"
                />
                <Textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => setItems(items.map((i) => i.id === faq.id ? { ...i, answer: e.target.value } : i))}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Label className="flex items-center gap-1 text-xs"><GripVertical className="h-3 w-3" /> Urutan</Label>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={faq.sort_order}
                    onChange={(e) => setItems(items.map((i) => i.id === faq.id ? { ...i, sort_order: Number(e.target.value) } : i))}
                  />
                  <Button size="sm" variant="outline" onClick={() => update(faq)}><Save className="h-3.5 w-3.5" /> Simpan</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(faq.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
