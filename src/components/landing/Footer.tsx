import { Link2, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
                <Link2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold">RSLink</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">by Mulyawan</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Platform URL Shortener modern dan profesional untuk seluruh civitas SMA Riyadhussholihiin.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="rounded-lg border border-border p-2 transition hover:border-primary/40 hover:text-primary"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="rounded-lg border border-border p-2 transition hover:border-primary/40 hover:text-primary"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="rounded-lg border border-border p-2 transition hover:border-primary/40 hover:text-primary"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Navigasi</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#fitur" className="transition hover:text-foreground">Fitur</a></li>
              <li><a href="#cara" className="transition hover:text-foreground">Cara Pakai</a></li>
              <li><a href="#statistik" className="transition hover:text-foreground">Statistik</a></li>
              <li><a href="#faq" className="transition hover:text-foreground">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Kontak</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> info@riyadhussholihiin.sch.id</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> SMA Riyadhussholihiin</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} RSLink by Mulyawan. Seluruh hak cipta dilindungi.</p>
          <p>Dibuat dengan ❤ untuk civitas SMA Riyadhussholihiin</p>
        </div>
      </div>
    </footer>
  );
}
