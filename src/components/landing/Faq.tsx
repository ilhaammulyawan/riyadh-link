import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Apakah RSLink gratis untuk civitas?", a: "Ya, RSLink gratis untuk seluruh civitas SMA Riyadhussholihiin (siswa, guru, dan staf)." },
  { q: "Apakah link saya akan kedaluwarsa?", a: "Tidak otomatis. Anda dapat mengatur masa berlaku link (1 hari, 7 hari, 30 hari, atau tanggal kustom)." },
  { q: "Apakah saya bisa membuat slug sendiri?", a: "Bisa. Gunakan fitur Custom Back-Half untuk membuat slug yang mudah diingat seperti rslink.id/materi-ai." },
  { q: "Apakah link saya aman?", a: "Anda dapat melindungi link dengan password sehingga hanya orang yang Anda izinkan yang dapat membukanya." },
  { q: "Apakah ada QR Code otomatis?", a: "Ya, setiap link memiliki QR Code yang dapat diunduh dan dibagikan." },
  { q: "Apakah saya bisa melihat statistik klik?", a: "Tentu. Setiap link memiliki halaman analitik lengkap: total klik, perangkat, browser, dan lokasi pengunjung." },
];

export function Faq() {
  return (
    <section id="faq" className="bg-gradient-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang sering diajukan</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border/60 bg-card px-5">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
