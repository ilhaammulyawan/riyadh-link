import { createServerFn } from "@tanstack/react-start";

export const getPublicStats = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [linksRes, usersRes, activeRes, clicksSumRes] = await Promise.all([
    supabaseAdmin.from("links").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabaseAdmin.from("links").select("click_count"),
  ]);

  const totalClicks =
    (clicksSumRes.data ?? []).reduce(
      (sum, r: { click_count: number | null }) => sum + (r.click_count ?? 0),
      0,
    );

  return {
    totalLinks: linksRes.count ?? 0,
    totalClicks,
    totalUsers: usersRes.count ?? 0,
    activeLinks: activeRes.count ?? 0,
  };
});
