-- Optimistic concurrency: each successful update gets a new revision.
-- Clients update WHERE user_id = auth.uid() AND revision = the last seen revision.
-- A stale device cannot silently overwrite a newer device.
alter table public.learner_progress
  add column if not exists revision bigint not null default 1;

alter table public.learner_progress
  drop constraint if exists learner_progress_revision_positive;
alter table public.learner_progress
  add constraint learner_progress_revision_positive check (revision >= 1);

create or replace function public.set_learner_progress_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  new.revision = old.revision + 1;
  return new;
end;
$$;
revoke all on function public.set_learner_progress_updated_at() from public, anon, authenticated;
