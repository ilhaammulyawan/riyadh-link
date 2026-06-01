import {
  Link2, Wand2, QrCode, Lock, ToggleLeft, BarChart3, Pencil, Copy,
  ExternalLink, Clock, Folder, Tag, LayoutDashboard, Moon, BookOpen,
} from "lucide-react";

const features = [
  { icon: Link2, title: "URL Shortener", desc: "Pendekkan tautan panjang menjadi link rapi yang mudah dibagikan." },
  { icon: Wand2, title: "Custom Back-Half", desc: "Tentukan slug sendiri seperti rslink.id/materi-python." },
  { icon: QrCode, title: "QR Code Generator", desc: "Buat QR Code otomatis untuk setiap link Anda." },
  { icon: Lock, title: "Password Protected", desc: "Lindungi link dengan password sebelum dibuka." },
  { icon: ToggleLeft, title: "Enable / Disable", desc: "Aktifkan atau nonaktifkan link kapan saja." },
  { icon: BarChart3, title: "Link Analytics", desc: "Lihat statistik klik harian, mingguan, dan bulanan." },
  { icon: Pencil, title: "Edit Link", desc: "Ubah tujuan link tanpa mengubah URL pendeknya." },
  { icon: Copy, title: "Copy Link", desc: "Salin link dengan satu klik." },
  { icon: ExternalLink, title: "Open in New Tab", desc: "Atur perilaku link saat dibuka." },
  { icon: Clock, title: "Link Expiration", desc: "Tetapkan masa berlaku 1, 7, 30 hari, atau kustom." },
  { icon: Folder, title: "Link Categories", desc: "Kelompokkan link dalam kategori." },
  { icon: Tag, title: "Link Tags", desc: "Tambahkan tag untuk pencarian cepat." },
  { icon: LayoutDashboard, title: "Responsive Dashboard", desc: "Tampil sempurna di desktop maupun mobile." },
  { icon: Moon, title: "Dark Mode", desc: "Mode gelap nyaman di mata." },
  { icon: BookOpen, title: "Reading Mode", desc: "Mode baca dengan latar hangat." },
];

export function Features() {
  return (
    <section id="fitur" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Fitur Lengkap</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Semua yang Anda butuhkan untuk mengelola link
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dari pemendek sederhana hingga analitik mendalam — semuanya dalam satu platform.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft transition group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
