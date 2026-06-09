CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS TABLE(total_links bigint, total_clicks bigint, total_users bigint, active_links bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.links),
    (SELECT coalesce(sum(click_count), 0) FROM public.links),
    (SELECT count(*) FROM public.profiles),
    (SELECT count(*) FROM public.links WHERE is_active = true);
$$;

GRANT EXECUTE ON FUNCTION public.get_public_stats() TO anon, authenticated;