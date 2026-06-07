import { Link2, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const { settings } = useSiteSettings();

  const socials = [
    { url: settings.social_instagram, icon: Instagram, label: "Instagram" },
    { url: settings.social_facebook, icon: Facebook, label: "Facebook" },
    { url: settings.social_youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

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
                <span className="text-base font-bold">{settings.site_name}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{settings.tagline}</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {settings.footer_description}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.url ?? "#"} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="rounded-lg border border-border p-2 transition hover:border-primary/40 hover:text-primary">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
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
              {settings.contact_email && <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{settings.contact_email}</span></li>}
              {settings.contact_address && <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{settings.contact_address}</span></li>}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>{settings.copyright_text} · {new Date().getFullYear()}</p>
          <p>
            {settings.credit_prefix && <span>{settings.credit_prefix} </span>}
            {settings.credit_link_label && (
              settings.credit_link_url ? (
                <a
                  href={settings.credit_link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:underline"
                >
                  {settings.credit_link_label}
                </a>
              ) : (
                <span className="font-semibold">{settings.credit_link_label}</span>
              )
            )}
            {settings.credit_suffix && <span> {settings.credit_suffix}</span>}
          </p>
        </div>
      </div>
    </footer>
  );
}
