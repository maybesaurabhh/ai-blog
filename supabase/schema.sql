-- ═══════════════════════════════════════════════════════════════
-- SYNAPSE BLOG — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS TABLE ─────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid references auth.users on delete cascade primary key,
  email       text unique not null,
  name        text not null default '',
  avatar_url  text,
  role        text not null default 'reader' check (role in ('admin', 'author', 'reader')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.users enable row level security;

create policy "Public users are viewable by everyone"
  on public.users for select using (true);

create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id);

-- Trigger: create user record on sign up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── POSTS TABLE ─────────────────────────────────────────────────
create table if not exists public.posts (
  id            uuid default uuid_generate_v4() primary key,
  title         text not null,
  slug          text unique not null,
  excerpt       text not null default '',
  content       text not null default '',
  cover_image   text,
  author_id     uuid references public.users(id) on delete set null,
  author_name   text not null default '',
  author_avatar text,
  tags          text[] not null default '{}',
  published     boolean not null default false,
  featured      boolean not null default false,
  views         integer not null default 0,
  reading_time  integer not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz
);

-- Indexes
create index if not exists posts_slug_idx on public.posts(slug);
create index if not exists posts_published_idx on public.posts(published);
create index if not exists posts_published_at_idx on public.posts(published_at desc);
create index if not exists posts_tags_idx on public.posts using gin(tags);
create index if not exists posts_featured_idx on public.posts(featured);

-- Row Level Security
alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (published = true);

create policy "Authors can view their own drafts"
  on public.posts for select
  using (auth.uid() = author_id);

create policy "Admins can view all posts"
  on public.posts for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'author')
    )
  );

create policy "Admins can insert posts"
  on public.posts for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'author')
    )
  );

create policy "Admins can update posts"
  on public.posts for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'author')
    )
  );

create policy "Admins can delete posts"
  on public.posts for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at();


-- ─── INCREMENT VIEWS FUNCTION ─────────────────────────────────────
-- Safely increments view counter (bypasses RLS)
create or replace function public.increment_post_views(post_id uuid)
returns void language plpgsql security definer
as $$
begin
  update public.posts
  set views = views + 1
  where id = post_id and published = true;
end;
$$;


-- ─── STORAGE BUCKET ──────────────────────────────────────────────
-- Create via Supabase Dashboard → Storage → New bucket
-- Name: blog-images
-- Public: true
-- Or run:
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict do nothing;

create policy "Anyone can view blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Authenticated users can upload blog images"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-images' and
    auth.role() = 'authenticated'
  );

create policy "Users can update their own uploads"
  on storage.objects for update
  using (
    bucket_id = 'blog-images' and
    auth.uid() = owner
  );

create policy "Users can delete their own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'blog-images' and
    auth.uid() = owner
  );


-- ─── SEED DATA (optional) ────────────────────────────────────────
-- First create a user via Supabase Auth, then update their role:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
