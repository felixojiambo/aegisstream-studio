create index if not exists user_roles_role_id_idx
on public.user_roles(role_id);

create or replace function public.directory_users_by_role(p_role_slug text)
returns table (
  id uuid,
  full_name text,
  email text,
  avatar_url text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.full_name,
    p.email,
    p.avatar_url
  from public.user_roles ur
  join public.roles r
    on r.id = ur.role_id
  join public.profiles p
    on p.id = ur.user_id
  where r.slug = p_role_slug
    and p.is_active = true
  order by coalesce(p.full_name, p.email, p.id::text);
$$;

create or replace function public.directory_users_by_ids(p_user_ids uuid[])
returns table (
  id uuid,
  full_name text,
  email text,
  avatar_url text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.full_name,
    p.email,
    p.avatar_url
  from public.profiles p
  where p.id = any(p_user_ids)
    and p.is_active = true
  order by coalesce(p.full_name, p.email, p.id::text);
$$;

revoke execute on function public.directory_users_by_role(text) from public;
revoke execute on function public.directory_users_by_role(text) from anon;
grant execute on function public.directory_users_by_role(text) to authenticated;

revoke execute on function public.directory_users_by_ids(uuid[]) from public;
revoke execute on function public.directory_users_by_ids(uuid[]) from anon;
grant execute on function public.directory_users_by_ids(uuid[]) to authenticated;
