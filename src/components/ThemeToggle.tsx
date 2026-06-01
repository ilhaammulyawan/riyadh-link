import { useEffect, useState } from "react";
import { Sun, Moon, BookOpen } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Terang" },
  { value: "dark", icon: Moon, label: "Gelap" },
  { value: "reading", icon: BookOpen, label: "Baca" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setLocal] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocal(getStoredTheme());
    setMounted(true);
    const handler = (e: Event) => setLocal((e as CustomEvent<Theme>).detail);
    window.addEventListener("rslink-theme-change", handler);
    return () => window.removeEventListener("rslink-theme-change", handler);
  }, []);

  if (!mounted) return <div className={cn("h-9 w-[120px]", className)} />;

  return (
    <div className={cn("inline-flex items-center rounded-full border border-border bg-card p-0.5", className)}>
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => { setTheme(opt.value); setLocal(opt.value); }}
            title={opt.label}
            aria-label={`Mode ${opt.label}`}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition",
              active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <opt.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
