import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RSLink - SMA RIYADHUSSHOLIHIIN — Pemendek URL untuk Civitas SMA Riyadhussholihiin" },
      { name: "description", content: "Platform URL Shortener modern dengan QR Code, password, analitik, dan kategori link untuk seluruh civitas SMA Riyadhussholihiin." },
      { property: "og:title", content: "RSLink - SMA RIYADHUSSHOLIHIIN" },
      { property: "og:description", content: "Pendekkan, kelola, dan pantau link Anda dengan mudah." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
