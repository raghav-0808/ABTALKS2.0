
-- ===== roles =====
create type public.app_role as enum ('admin','moderator','user');

create table public.profiles (
  id uuid primary key,
  username text not null unique,
  full_name text not null,
  avatar_url text,
  bio text,
  headline text,
  location text,
  skills text[] not null default '{}',
  github_url text,
  website_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by all" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base_username text; final_username text; n int := 0;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)), '[^a-z0-9_]', '', 'g'));
  if base_username = '' or base_username is null then base_username := 'member'; end if;
  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    n := n + 1; final_username := base_username || n::text;
  end loop;
  insert into public.profiles (id, username, full_name)
  values (new.id, final_username, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', final_username));
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- ===== interests =====
create table public.interests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'technology'
);
grant select on public.interests to anon, authenticated;
grant all on public.interests to service_role;
alter table public.interests enable row level security;
create policy "interests readable by all" on public.interests for select using (true);

create table public.user_interests (
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest_id uuid not null references public.interests(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, interest_id)
);
grant select on public.user_interests to anon;
grant select, insert, delete on public.user_interests to authenticated;
grant all on public.user_interests to service_role;
alter table public.user_interests enable row level security;
create policy "user interests readable" on public.user_interests for select using (true);
create policy "manage own interests" on public.user_interests for insert to authenticated with check (auth.uid() = user_id);
create policy "delete own interests" on public.user_interests for delete to authenticated using (auth.uid() = user_id);

-- ===== events =====
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  category text not null,
  event_type text not null check (event_type in ('hackathon','workshop','talk','webinar','meetup')),
  banner_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null,
  is_online boolean not null default false,
  organizer text not null,
  capacity int not null default 100,
  participant_count int not null default 0,
  tags text[] not null default '{}',
  agenda jsonb not null default '[]',
  requirements text[] not null default '{}',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_starts_at_idx on public.events (starts_at);
create index events_category_idx on public.events (category);
grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "events readable by all" on public.events for select using (true);
create policy "admins manage events" on public.events for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();

create table public.event_speakers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  title text not null,
  avatar_url text
);
grant select on public.event_speakers to anon, authenticated;
grant all on public.event_speakers to service_role;
alter table public.event_speakers enable row level security;
create policy "speakers readable by all" on public.event_speakers for select using (true);
create policy "admins manage speakers" on public.event_speakers for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index event_registrations_user_idx on public.event_registrations (user_id);
grant select, insert, delete on public.event_registrations to authenticated;
grant all on public.event_registrations to service_role;
alter table public.event_registrations enable row level security;
create policy "read own registrations" on public.event_registrations for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "create own registration" on public.event_registrations for insert to authenticated with check (auth.uid() = user_id);
create policy "delete own registration" on public.event_registrations for delete to authenticated using (auth.uid() = user_id);

create or replace function public.sync_participant_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.events set participant_count = participant_count + 1 where id = new.event_id;
    return new;
  else
    update public.events set participant_count = greatest(participant_count - 1, 0) where id = old.event_id;
    return old;
  end if;
end; $$;
create trigger registrations_count after insert or delete on public.event_registrations
  for each row execute function public.sync_participant_count();

-- ===== community =====
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 5000),
  post_type text not null default 'discussion' check (post_type in ('discussion','question','project','achievement','learning','event')),
  title text,
  tags text[] not null default '{}',
  like_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_created_idx on public.posts (created_at desc);
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "posts readable by all" on public.posts for select using (true);
create policy "create own posts" on public.posts for insert to authenticated with check (auth.uid() = author_id);
create policy "update own posts" on public.posts for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "delete own or admin posts" on public.posts for delete to authenticated
  using (auth.uid() = author_id or public.has_role(auth.uid(),'admin'));
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id);
grant select on public.comments to anon;
grant select, insert, update, delete on public.comments to authenticated;
grant all on public.comments to service_role;
alter table public.comments enable row level security;
create policy "comments readable by all" on public.comments for select using (true);
create policy "create own comments" on public.comments for insert to authenticated with check (auth.uid() = author_id);
create policy "delete own or admin comments" on public.comments for delete to authenticated
  using (auth.uid() = author_id or public.has_role(auth.uid(),'admin'));

create or replace function public.sync_comment_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id; return new;
  else
    update public.posts set comment_count = greatest(comment_count - 1,0) where id = old.post_id; return old;
  end if;
end; $$;
create trigger comments_count after insert or delete on public.comments for each row execute function public.sync_comment_count();

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
grant select on public.likes to anon;
grant select, insert, delete on public.likes to authenticated;
grant all on public.likes to service_role;
alter table public.likes enable row level security;
create policy "likes readable by all" on public.likes for select using (true);
create policy "create own like" on public.likes for insert to authenticated with check (auth.uid() = user_id);
create policy "delete own like" on public.likes for delete to authenticated using (auth.uid() = user_id);

create or replace function public.sync_like_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id; return new;
  else
    update public.posts set like_count = greatest(like_count - 1,0) where id = old.post_id; return old;
  end if;
end; $$;
create trigger likes_count after insert or delete on public.likes for each row execute function public.sync_like_count();

create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
grant select on public.follows to anon;
grant select, insert, delete on public.follows to authenticated;
grant all on public.follows to service_role;
alter table public.follows enable row level security;
create policy "follows readable by all" on public.follows for select using (true);
create policy "create own follow" on public.follows for insert to authenticated with check (auth.uid() = follower_id);
create policy "delete own follow" on public.follows for delete to authenticated using (auth.uid() = follower_id);

-- ===== learning =====
create table public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  category text not null,
  technology text not null,
  estimated_minutes int not null default 60,
  resource_type text not null check (resource_type in ('course','article','video','documentation','tutorial','book','roadmap')),
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.learning_resources to anon;
grant select, insert, update, delete on public.learning_resources to authenticated;
grant all on public.learning_resources to service_role;
alter table public.learning_resources enable row level security;
create policy "resources readable by all" on public.learning_resources for select using (true);
create policy "admins manage resources" on public.learning_resources for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger resources_touch before update on public.learning_resources for each row execute function public.touch_updated_at();

create table public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  resource_id uuid not null references public.learning_resources(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, resource_id)
);
grant select, insert, update, delete on public.learning_progress to authenticated;
grant all on public.learning_progress to service_role;
alter table public.learning_progress enable row level security;
create policy "own progress" on public.learning_progress for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger progress_touch before update on public.learning_progress for each row execute function public.touch_updated_at();

-- ===== bookmarks =====
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_type text not null check (item_type in ('event','post','resource')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);
grant select, insert, delete on public.bookmarks to authenticated;
grant all on public.bookmarks to service_role;
alter table public.bookmarks enable row level security;
create policy "own bookmarks" on public.bookmarks for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== notifications =====
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "read own notifications" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "insert notifications" on public.notifications for insert to authenticated with check (true);
create policy "update own notifications" on public.notifications for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own notifications" on public.notifications for delete to authenticated using (auth.uid() = user_id);

-- ===== AI chat =====
create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index chat_threads_user_idx on public.chat_threads (user_id, updated_at desc);
grant select, insert, update, delete on public.chat_threads to authenticated;
grant all on public.chat_threads to service_role;
alter table public.chat_threads enable row level security;
create policy "own threads" on public.chat_threads for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('user','assistant')),
  message_id text,
  parts jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index chat_messages_thread_idx on public.chat_messages (thread_id, created_at);
grant select, insert, delete on public.chat_messages to authenticated;
grant all on public.chat_messages to service_role;
alter table public.chat_messages enable row level security;
create policy "own chat messages" on public.chat_messages for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
