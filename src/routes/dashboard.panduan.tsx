import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Link2, QrCode, BarChart3, Lock, Edit3, Trash2, Copy, ExternalLink, Lightbulb, ShieldCheck, MousePointerClick, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/panduan")({
  head: () => ({ meta: [{ title: "Panduan Pengguna — RSLink" }] }),
  component: PanduanPage,
});

function PanduanPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.replace("/login");
        return;
      }
      setEmail(data.session.user.email ?? "");
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader email={email} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Buku Petunjuk Pengguna</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pelajari cara memendekkan, mengelola, dan memantau link Anda dengan RSLink.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Daftar Isi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <a href="#pengenalan" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">Pengenalan RSLink</a>
                <a href="#memendekkan" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">Memendekkan Link</a>
                <a href="#mengelola" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">Mengelola Link</a>
                <a href="#qr" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">QR Code</a>
                <a href="#statistik" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">Statistik & Analytics</a>
                <a href="#keamanan" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">Keamanan Link</a>
                <a href="#faq" className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">FAQ</a>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <div className="space-y-8">
            <section id="pengenalan">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Link2 className="h-5 w-5 text-primary" /> Pengenalan RSLink
                  </CardTitle>
                  <CardDescription>Apa itu RSLink dan siapa yang boleh menggunakannya?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">RSLink</strong> adalah platform pemendek URL eksklusif untuk civitas
                    <strong className="text-foreground"> SMA Riyadhussholihiin</strong>. Dengan RSLink, Anda dapat mengubah URL panjang menjadi tautan pendek yang mudah dibagikan, dilengkapi QR Code, statistik klik, dan pengaturan keamanan.
                  </p>
                  <p>
                    Platform ini ditujukan untuk guru, staf, siswa, dan komunitas sekolah agar dapat menyebarkan informasi secara lebih rapi, profesional, dan terukur.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="memendekkan">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MousePointerClick className="h-5 w-5 text-primary" /> Memendekkan Link
                  </CardTitle>
                  <CardDescription>Cara membuat link pendek dari URL panjang.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Masuk ke <strong className="text-foreground">Dashboard</strong> melalui menu di atas.</li>
                    <li>Temukan formulir <strong className="text-foreground">Buat Link Pendek</strong>.</li>
                    <li>Masukkan URL panjang Anda, misalnya: <code className="rounded bg-muted px-1 py-0.5 text-xs">https://drive.google.com/xxxx</code>.</li>
                    <li>(Opsional) Isi <strong className="text-foreground">Slug kustom</strong> jika Anda ingin URL seperti <code className="rounded bg-muted px-1 py-0.5 text-xs">s.smariyadhussholihiin.sch.id/nama-acara</code>.</li>
                    <li>(Opsional) Pilih <strong className="text-foreground">Kategori</strong> agar link tersusun rapi.</li>
                    <li>Klik tombol <strong className="text-foreground">Pendekkan</strong>.</li>
                    <li>Link pendek Anda akan muncul di tabel dan siap dibagikan.</li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section id="mengelola">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Edit3 className="h-5 w-5 text-primary" /> Mengelola Link
                  </CardTitle>
                  <CardDescription>Edit, salin, hapus, dan pantau link Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>Di tabel <strong className="text-foreground">Link Saya</strong>, setiap baris memiliki beberapa aksi:</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li><Copy className="inline h-4 w-4 align-text-bottom" /> <strong>Salin</strong>: Menyalin URL pendek ke clipboard.</li>
                    <li><ExternalLink className="inline h-4 w-4 align-text-bottom" /> <strong>Buka</strong>: Membuka link pendek di tab baru.</li>
                    <li><QrCode className="inline h-4 w-4 align-text-bottom" /> <strong>QR Code</strong>: Menampilkan QR Code yang dapat diunduh.</li>
                    <li><Edit3 className="inline h-4 w-4 align-text-bottom" /> <strong>Edit</strong>: Mengubah URL tujuan, slug, kategori, atau status aktif/non-aktif.</li>
                    <li><Trash2 className="inline h-4 w-4 align-text-bottom" /> <strong>Hapus</strong>: Menghapus link secara permanen.</li>
                  </ul>
                  <p>
                    Tips: Jadikan link <strong className="text-foreground">non-aktif</strong> sementara jika Anda ingin menghentikan akses tanpa menghapus link.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="qr">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <QrCode className="h-5 w-5 text-primary" /> QR Code
                  </CardTitle>
                  <CardDescription>Cara membuat dan mengunduh QR Code link Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Pastikan Anda sudah membuat link pendek.</li>
                    <li>Klik ikon <strong className="text-foreground">QR Code</strong> pada baris link yang diinginkan.</li>
                    <li>QR Code akan muncul dalam dialog.</li>
                    <li>Klik <strong className="text-foreground">Unduh PNG</strong> untuk menyimpan gambar QR Code.</li>
                    <li>Cetak atau tempel QR Code pada pamflet, poster, atau slide presentasi.</li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section id="statistik">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart3 className="h-5 w-5 text-primary" /> Statistik & Analytics
                  </CardTitle>
                  <CardDescription>Pahami performa setiap link.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    RSLink mencatat setiap kali seseorang mengakses link Anda. Di Dashboard, Anda dapat melihat:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li><strong className="text-foreground">Total Link</strong>: Jumlah link yang Anda buat.</li>
                    <li><strong className="text-foreground">Total Klik</strong>: Jumlah keseluruhan akses ke semua link Anda.</li>
                    <li><strong className="text-foreground">Link Aktif</strong>: Link yang saat ini dapat diakses.</li>
                  </ul>
                  <p>
                    Untuk melihat detail per link, klik ikon statistik pada baris link. Anda dapat mengetahui kapan link paling banyak diklik.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="keamanan">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lock className="h-5 w-5 text-primary" /> Keamanan Link
                  </CardTitle>
                  <CardDescription>Lindungi link dengan password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Jika Anda membagikan dokumen atau materi sensitif, aktifkan fitur <strong className="text-foreground">Password</strong> saat membuat atau mengedit link. Pengunjung harus memasukkan password yang benar sebelum diarahkan ke URL tujuan.
                  </p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Buat atau edit link.</li>
                    <li>Centang opsi <strong className="text-foreground">Aktifkan Password</strong>.</li>
                    <li>Masukkan password yang kuat.</li>
                    <li>Simpan perubahan.</li>
                    <li>Bagikan link pendek <em>dan</em> password secara terpisah kepada penerima yang berhak.</li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            <Separator />

            <section id="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="h-5 w-5 text-primary" /> Pertanyaan Umum
                  </CardTitle>
                  <CardDescription>Jawaban atas kendala yang sering dialami.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="slug">
                      <AccordionTrigger className="text-sm font-medium">Apa itu slug kustom?</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Slug adalah bagian akhir dari URL pendek. Secara default RSLink membuatkan slug acak, tetapi Anda bisa menggantinya dengan kata yang lebih mudah diingat, misalnya <code className="rounded bg-muted px-1 py-0.5 text-xs">rapat-guru</code>.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="tidak-bisa-login">
                      <AccordionTrigger className="text-sm font-medium">Saya tidak bisa masuk, apa yang harus dilakukan?</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Pastikan email dan password sudah benar. Periksa juga folder spam jika Anda baru mendaftar dan belum menerima email verifikasi. Jika lupa password, hubungi admin sekolah.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="link-tidak-aktif">
                      <AccordionTrigger className="text-sm font-medium">Mengapa link saya tidak bisa dibuka?</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Kemungkinan link sudah dinonaktifkan atau dihapus. Periksa di tabel Link Saya; kolom status harus <strong>Aktif</strong> agar dapat diakses.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="bagikan">
                      <AccordionTrigger className="text-sm font-medium">Bagaimana cara membagikan link dengan aman?</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Bagikan URL pendek melalui media yang biasa Anda gunakan. Untuk konten sensitif, aktifkan password dan bagikan password melalui jalur komunikasi yang berbeda.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="admin">
                      <AccordionTrigger className="text-sm font-medium">Siapa yang bisa mengakses menu Admin?</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Menu Admin hanya muncul untuk pengguna yang diberi peran <strong>admin</strong> oleh pengelola sistem. Admin dapat mengatur FAQ, kelola link pengguna, dan mengubah pengaturan situs.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Pastikan selalu membagikan link dengan bijak. RSLink adalah sarana internal sekolah; gunakan sesuai kebijakan dan etika yang berlaku di SMA Riyadhussholihiin.
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
