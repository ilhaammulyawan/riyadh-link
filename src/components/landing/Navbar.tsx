import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight">RSLink</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">by Mulyawan</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#fitur" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Fitur</a>
          <a href="#cara" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cara Pakai</a>
          <a href="#statistik" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Statistik</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Masuk</Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90">
            Daftar
          </Button>
        </div>
      </div>
    </header>
  );
}
