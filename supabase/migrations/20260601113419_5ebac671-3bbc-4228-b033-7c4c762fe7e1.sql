
-- Fix set_updated_at search_path
create or replace function public.set_updated_at()
returns trigger language plpgsql
security invoker
set search_path = public
as $$
begin new.updated_at = now(); return new; end; $$;

-- Lock down execute privileges on SECURITY DEFINER functions
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- (trigger runs as table owner; no direct callers needed)

-- Tighten link_clicks insert policy
drop policy if exists "Anyone insert click" on public.link_clicks;
create policy "Anyone insert click" on public.link_clicks
  for insert to anon, authenticated
  with check (link_id is not null);
