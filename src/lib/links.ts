// Shared helpers for link slugs and URL validation
export function makeRandomSlug(len = 6): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) throw new Error("URL kosong");
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  // throws if invalid
  new URL(withProto);
  return withProto;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]{3,40}$/.test(slug);
}

export function getShortBase(): string {
  if (typeof window !== "undefined") return `${window.location.origin}/`;
  return "https://rslink.id/";
}
