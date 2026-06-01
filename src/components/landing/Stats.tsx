import { useEffect, useRef, useState } from "react";
import { Link2, MousePointerClick, QrCode, Users, Activity } from "lucide-react";

const items = [
  { icon: Link2, label: "Total Link Dibuat", value: 12480 },
  { icon: MousePointerClick, label: "Total Klik", value: 384920 },
  { icon: QrCode, label: "Total QR Code", value: 3240 },
  { icon: Users, label: "Total Pengguna", value: 1860 },
  { icon: Activity, label: "Link Aktif", value: 10230 },
];

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Link2; label: string; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const count = useCountUp(value, visible);
  return (
    <div ref={ref} className="rounded-2xl border border-border/60 bg-card p-6 text-center transition hover:border-primary/30 hover:shadow-soft">
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
        {count.toLocaleString("id-ID")}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section id="statistik" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Statistik Platform</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Dipercaya civitas sekolah</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((it) => <StatCard key={it.label} {...it} />)}
        </div>
      </div>
    </section>
  );
}
