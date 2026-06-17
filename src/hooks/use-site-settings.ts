import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  site_name: string;
  tagline: string;
  meta_description: string | null;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta: string;
  footer_description: string | null;
  contact_email: string | null;
  contact_address: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  copyright_text: string | null;
  credit_prefix: string | null;
  credit_link_label: string | null;
  credit_link_url: string | null;
  credit_suffix: string | null;
};

const DEFAULTS: SiteSettings = {
  site_name: "RSLink - SMA RIYADHUSSHOLIHIIN",
  tagline: "Platform URL Shortener untuk Civitas SMA Riyadhussholihiin",
  meta_description: "Pendekkan, kelola, dan pantau link Anda dengan mudah.",
  hero_headline: "Pendekkan, Kelola, dan Pantau Link Anda dengan Mudah",
  hero_subheadline: "Platform URL Shortener modern untuk civitas SMA Riyadhussholihiin.",
  hero_cta: "Pendekkan Sekarang",
  footer_description: "Platform URL Shortener modern untuk seluruh civitas SMA Riyadhussholihiin.",
  contact_email: "info@riyadhussholihiin.sch.id",
  contact_address: "SMA Riyadhussholihiin",
  social_instagram: null,
  social_facebook: null,
  social_youtube: null,
  copyright_text: "© RSLink - SMA RIYADHUSSHOLIHIIN",
  credit_prefix: "Build by",
  credit_link_label: "Mulyawan",
  credit_link_url: "https://mulyawan.biz.id",
  credit_suffix: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
      .then(({ data }) => {
        if (data) setSettings({ ...DEFAULTS, ...(data as Partial<SiteSettings>) });
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
