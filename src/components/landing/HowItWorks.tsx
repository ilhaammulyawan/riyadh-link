const steps = [
  { n: "01", title: "Tempel URL Panjang", desc: "Salin tautan yang ingin dipendekkan dan tempel di kolom shortener." },
  { n: "02", title: "Custom Back-Half", desc: "Tentukan slug Anda sendiri, contoh: rslink.id/materi-python (opsional)." },
  { n: "03", title: "Atur Opsi Link", desc: "Tambahkan password, masa berlaku, status aktif, dan generate QR Code." },
  { n: "04", title: "Simpan & Bagikan", desc: "Link siap dibagikan. Pantau klik melalui dashboard analitik." },
];

export function HowItWorks() {
  return (
    <section id="cara" className="bg-gradient-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Cara Penggunaan</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Hanya 4 langkah mudah</h2>
          <p className="mt-4 text-muted-foreground">
            Dari URL panjang menjadi link rapi dalam hitungan detik.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="group h-full rounded-2xl border border-border/60 bg-card p-6 transition hover:border-primary/30 hover:shadow-soft">
                <div className="text-5xl font-extrabold text-gradient">{s.n}</div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-primary/40 to-transparent lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
