-- Luna Talent production schema starter for Supabase/Postgres
create extension if not exists pgcrypto;
create type public.booking_status as enum ('pending','confirmed','completed','cancelled','declined');
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text not null, role text not null default 'customer', phone text, city text, created_at timestamptz default now());
create table public.talents (id uuid primary key default gen_random_uuid(), owner_id uuid references public.profiles(id), slug text unique not null, display_name text not null, city text not null, roles text[] not null default '{}', skills text[] not null default '{}', bio text, rate_per_shift bigint check(rate_per_shift>=0), is_verified boolean default false, is_published boolean default false, created_at timestamptz default now());
create table public.bookings (id uuid primary key default gen_random_uuid(), customer_id uuid references public.profiles(id), talent_id uuid references public.talents(id), event_type text not null, event_date date not null, start_time time not null, duration_hours int check(duration_hours between 1 and 12), venue text not null, brief text not null, status public.booking_status default 'pending', quoted_amount bigint, created_at timestamptz default now());
create table public.favorites (user_id uuid references public.profiles(id) on delete cascade, talent_id uuid references public.talents(id) on delete cascade, primary key(user_id,talent_id));
create table public.reports (id uuid primary key default gen_random_uuid(), reporter_id uuid references public.profiles(id), booking_id uuid references public.bookings(id), category text, details text not null, created_at timestamptz default now());
alter table public.profiles enable row level security; alter table public.talents enable row level security; alter table public.bookings enable row level security; alter table public.favorites enable row level security; alter table public.reports enable row level security;
create policy "public published talents" on public.talents for select using (is_published=true);
create policy "own profile" on public.profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "customer own bookings" on public.bookings for select using (auth.uid()=customer_id);
create policy "customer creates bookings" on public.bookings for insert with check (auth.uid()=customer_id);
create policy "own favorites" on public.favorites for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "authenticated reports" on public.reports for insert to authenticated with check (auth.uid()=reporter_id);
-- Add admin/talent update policies via custom JWT claims or a server-side service role; never expose service_role in browser code.
