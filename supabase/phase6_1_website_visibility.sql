-- Phase 6.1
-- Command Centre website visibility control

alter table public.company_settings
add column if not exists website_mode text;

update public.company_settings
set website_mode = 'live'
where website_mode is null
   or website_mode not in ('live', 'coming_soon');

alter table public.company_settings
alter column website_mode set default 'live';

alter table public.company_settings
alter column website_mode set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'company_settings_website_mode_check'
      and conrelid = 'public.company_settings'::regclass
  ) then
    alter table public.company_settings
    add constraint company_settings_website_mode_check
    check (website_mode in ('live', 'coming_soon'));
  end if;
end
$$;

comment on column public.company_settings.website_mode is
  'Controls public website visibility: live or coming_soon.';
