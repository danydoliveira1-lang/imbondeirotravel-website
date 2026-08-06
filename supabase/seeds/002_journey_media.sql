/*
===============================================================================
IMBONDEIRO OS — BUSINESS SEED 002
Journey Media — Launch v1.0

Purpose:
Replace temporary YouTube hero videos with certified MP4 assets for five
Signature Angola journeys, while preserving YouTube media for all other tours.

Execution prerequisites:
1. Create a PUBLIC Supabase Storage bucket named: journey-media
2. Upload the five MP4 files to: launch-v1/
3. Replace YOUR_PROJECT_REF below with the Supabase project reference.
4. Run this script in a NEW Supabase SQL Editor window.

Engineering properties:
- Transactional
- Idempotent
- Preflight protected
- Existing editorial data preserved
- Unrelated journey media preserved
===============================================================================
*/

begin;

do $seed$
declare
    project_ref constant text := 'YOUR_PROJECT_REF';
    media_base_url text;
    expected_slugs constant text[] := array[
        'mbanza-kongo-heritage',
        'angolan-culture-and-dance',
        'kalandula-falls-and-malanje',
        'serra-da-leba-and-lubango',
        'kissama-safari'
    ];
    missing_slugs text[];
begin
    if to_regclass('public.tours') is null then
        raise exception 'Business Seed 002 aborted: public.tours does not exist.';
    end if;

    if project_ref = 'YOUR_PROJECT_REF' or btrim(project_ref) = '' then
        raise exception
            'Business Seed 002 aborted: replace YOUR_PROJECT_REF before execution.';
    end if;

    select array_agg(slug order by slug)
      into missing_slugs
      from unnest(expected_slugs) as slug
      where not exists (
          select 1
          from public.tours t
          where t.slug = slug
      );

    if missing_slugs is not null then
        raise exception
            'Business Seed 002 aborted: expected journeys are missing: %',
            array_to_string(missing_slugs, ', ');
    end if;

    media_base_url := format(
        'https://%s.supabase.co/storage/v1/object/public/journey-media/launch-v1',
        project_ref
    );

    update public.tours
       set hero_video_url = media_base_url || '/mbanza-kongo.mp4',
           updated_at = now()
     where slug = 'mbanza-kongo-heritage';

    update public.tours
       set hero_video_url = media_base_url || '/traditional-dances.mp4',
           updated_at = now()
     where slug = 'angolan-culture-and-dance';

    update public.tours
       set hero_video_url = media_base_url || '/kalandula-falls.mp4',
           updated_at = now()
     where slug = 'kalandula-falls-and-malanje';

    update public.tours
       set hero_video_url = media_base_url || '/serra-da-leba.mp4',
           updated_at = now()
     where slug = 'serra-da-leba-and-lubango';

    update public.tours
       set hero_video_url = media_base_url || '/kissama-safari.mp4',
           updated_at = now()
     where slug = 'kissama-safari';

    if (
        select count(*)
        from public.tours
        where slug = any(expected_slugs)
          and hero_video_url like media_base_url || '/%'
    ) <> cardinality(expected_slugs) then
        raise exception
            'Business Seed 002 certification failed: not all five MP4 URLs were applied.';
    end if;

    raise notice
        'Business Seed 002 certified: five Signature Angola journeys now use approved MP4 media.';
end
$seed$;

commit;

-- POST-COMMIT VERIFICATION
select
    slug,
    title,
    hero_video_url,
    status,
    updated_at
from public.tours
where slug in (
    'mbanza-kongo-heritage',
    'angolan-culture-and-dance',
    'kalandula-falls-and-malanje',
    'serra-da-leba-and-lubango',
    'kissama-safari'
)
order by title;

-- Confirm that all other tours retain their existing media references.
select
    slug,
    title,
    hero_video_url
from public.tours
where slug not in (
    'mbanza-kongo-heritage',
    'angolan-culture-and-dance',
    'kalandula-falls-and-malanje',
    'serra-da-leba-and-lubango',
    'kissama-safari'
)
order by title;
