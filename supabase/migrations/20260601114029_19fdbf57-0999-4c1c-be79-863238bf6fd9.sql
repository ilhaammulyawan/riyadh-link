
create or replace function public.increment_link_click_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.links set click_count = click_count + 1 where id = new.link_id;
  return new;
end;
$$;

drop trigger if exists trg_increment_link_click_count on public.link_clicks;
create trigger trg_increment_link_click_count
after insert on public.link_clicks
for each row execute function public.increment_link_click_count();
