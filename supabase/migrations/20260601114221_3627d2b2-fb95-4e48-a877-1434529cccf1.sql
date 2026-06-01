
-- Allow admins to manage user roles
create policy "Admins insert user roles"
on public.user_roles for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete user roles"
on public.user_roles for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert the singleton site_settings row
create policy "Admins insert site settings"
on public.site_settings for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));
