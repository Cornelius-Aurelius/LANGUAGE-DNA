create table if not exists public.learner_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer not null default 1 check (schema_version >= 1),
  snapshot jsonb not null default '{}'::jsonb,
  client_updated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learner_progress enable row level security;

revoke all on public.learner_progress from anon;
grant select, insert, update, delete on public.learner_progress to authenticated;

drop policy if exists "users_select_own_progress" on public.learner_progress;
create policy "users_select_own_progress"
on public.learner_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users_insert_own_progress" on public.learner_progress;
create policy "users_insert_own_progress"
on public.learner_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users_update_own_progress" on public.learner_progress;
create policy "users_update_own_progress"
on public.learner_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users_delete_own_progress" on public.learner_progress;
create policy "users_delete_own_progress"
on public.learner_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.set_learner_progress_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists learner_progress_updated_at on public.learner_progress;
create trigger learner_progress_updated_at
before update on public.learner_progress
for each row execute procedure public.set_learner_progress_updated_at();
