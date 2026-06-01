// Theme management: light | dark | reading
export type Theme = "light" | "dark" | "reading";
export const THEME_KEY = "rslink-theme";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("dark", "reading");
  if (theme === "dark") html.classList.add("dark");
  else if (theme === "reading") html.classList.add("reading");
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(THEME_KEY);
  if (v === "dark" || v === "reading" || v === "light") return v;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  if (typeof window !== "undefined") window.localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("rslink-theme-change", { detail: theme }));
}

// Inline script (string) for SSR to avoid theme flash
export const THEME_INIT_SCRIPT = `
(function(){try{
  var k='${THEME_KEY}';
  var t=localStorage.getItem(k);
  if(t!=='dark'&&t!=='reading'&&t!=='light'){
    t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  }
  var h=document.documentElement;
  h.classList.remove('dark','reading');
  if(t==='dark')h.classList.add('dark');
  else if(t==='reading')h.classList.add('reading');
}catch(e){}})();
`.trim();
