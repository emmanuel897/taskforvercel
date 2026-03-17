-- ============================================================
-- CORRECTIF : Récursion infinie dans les politiques RLS
-- À exécuter dans Supabase → SQL Editor
-- ============================================================

-- 1. Fonction security definer pour vérifier le statut admin
--    (contourne RLS → brise la récursion)
create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.friends
    where user_id = auth.uid() and is_admin = true
  );
$$;

-- 2. Supprimer les anciennes politiques problématiques
drop policy if exists "friends_all_admin"                  on public.friends;
drop policy if exists "invitations_admin"                  on public.invitations;
drop policy if exists "podcasts_update_author_or_admin"    on public.podcasts;
drop policy if exists "comments_update_author_or_admin"    on public.comments;

-- 3. Recréer sans récursion

-- FRIENDS
create policy "friends_all_admin" on public.friends
  for all using (public.is_current_user_admin());

-- INVITATIONS
create policy "invitations_admin" on public.invitations
  for all using (public.is_current_user_admin());

-- PODCASTS
create policy "podcasts_update_author_or_admin" on public.podcasts
  for update using (
    (select user_id from public.friends where id = friend_id) = auth.uid()
    or public.is_current_user_admin()
  );

-- COMMENTS
create policy "comments_update_author_or_admin" on public.comments
  for update using (
    (select user_id from public.friends where id = friend_id) = auth.uid()
    or public.is_current_user_admin()
  );
