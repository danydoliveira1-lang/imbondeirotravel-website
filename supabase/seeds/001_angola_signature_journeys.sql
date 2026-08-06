/*
===============================================================================
IMBONDEIRO OS — THE LIVING BAOBAB

Growth Ring IX — Business Seed 001
File: supabase/seeds/001_angola_signature_journeys.sql
Version: 1.0.0
Business Capability: Signature Angola Journeys

Mission:
The authentic story of Angola, told through Imbondeiro Travel.

Editorial Philosophy:
The architecture gives it strength.
The journeys give it life.
The people of Angola give it meaning.

Engineering Standard:
- Deterministic
- Idempotent
- Transactional
- Auditable
- Production-safe
- Version controlled
- Independently verifiable

Important:
This is not sample data.
It is the first enduring operational record of Imbondeiro Travel's catalogue.

Publication posture:
All journeys are inserted as DRAFTS so editorial, commercial, media,
pricing, itinerary and legal review can be completed before publication.
===============================================================================
*/

begin;

-- =============================================================================
-- PRE-FLIGHT: VERIFY THE CERTIFIED TOURS ARCHITECTURE
-- =============================================================================

do $preflight$
declare
    missing_columns text[];
    draft_status_exists boolean;
begin
    if to_regclass('public.tours') is null then
        raise exception
            'Business Seed 001 aborted: required table public.tours does not exist.';
    end if;

    select array_agg(required.column_name order by required.column_name)
      into missing_columns
      from (
          values
              ('id'),
              ('slug'),
              ('title'),
              ('short_description'),
              ('description'),
              ('duration'),
              ('category'),
              ('hero_video_url'),
              ('featured_image_url'),
              ('status'),
              ('is_featured'),
              ('created_by'),
              ('updated_by'),
              ('created_at'),
              ('updated_at')
      ) as required(column_name)
      where not exists (
          select 1
          from information_schema.columns actual
          where actual.table_schema = 'public'
            and actual.table_name = 'tours'
            and actual.column_name = required.column_name
      );

    if missing_columns is not null then
        raise exception
            'Business Seed 001 aborted: public.tours is missing required columns: %',
            array_to_string(missing_columns, ', ');
    end if;

    select exists (
        select 1
        from pg_type t
        join pg_enum e on e.enumtypid = t.oid
        join pg_namespace n on n.oid = t.typnamespace
        where n.nspname = 'public'
          and t.typname = 'tour_status'
          and e.enumlabel = 'draft'
    )
    into draft_status_exists;

    if not draft_status_exists then
        raise exception
            'Business Seed 001 aborted: public.tour_status does not contain draft.';
    end if;
end
$preflight$;

-- =============================================================================
-- COLLECTION: SIGNATURE ANGOLA
--
-- Canonical editorial order:
-- 01. Luanda Highlights
-- 02. Angolan Culture & Dance
-- 03. Miradouro da Lua & Kwanza River
-- 04. Kissama Safari
-- 05. Kalandula Falls & Malanje
-- 06. Serra da Leba & Lubango
-- 07. Benguela & Lobito Coastal Escape
-- 08. Cabo Ledo Beach Escape
-- 09. M'Banza Kongo Heritage
-- 10. Namibe Desert Experience
--
-- The current tours schema contains no collection or display-order columns.
-- The approved order is documented here and preserved by the VALUES sequence.
-- =============================================================================

insert into public.tours (
    slug,
    title,
    short_description,
    description,
    duration,
    category,
    hero_video_url,
    featured_image_url,
    status,
    is_featured,
    created_by,
    updated_by
)
values

-- JOURNEY 001 — LUANDA HIGHLIGHTS
(
    'luanda-highlights',
    'Luanda Highlights',
    'Discover Angola''s capital through its Atlantic coastline, historic landmarks, cultural memory and contemporary energy in a carefully curated introduction to Luanda.',
    $journey$
Luanda is Angola's gateway to the world and the natural beginning of the Imbondeiro story. Set beside the Atlantic, the capital brings together centuries of history, national memory, modern ambition and the unmistakable rhythm of everyday Angolan life.

This journey introduces guests to the city's defining landmarks and the stories that connect them. The experience may include the Fortaleza de São Miguel, the Dr. António Agostinho Neto Memorial, panoramic coastal viewpoints and carefully selected neighbourhoods that reveal both the historic and contemporary character of Luanda.

Beyond monuments, the journey is shaped by human connection. Local interpretation, architecture, food and the movement of the city help visitors understand Luanda not as a checklist of sights, but as a living capital whose identity continues to evolve.

Designed for first-time visitors, returning travellers and professional guests with limited time, Luanda Highlights offers a confident, welcoming and meaningful introduction to Angola.
$journey$,
    'Full day',
    'Culture',
    'https://www.youtube.com/watch?v=JXCkN8Xa_AM',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 002 — ANGOLAN CULTURE & DANCE
(
    'angolan-culture-and-dance',
    'Angolan Culture & Dance',
    'Experience Angola through rhythm, movement, storytelling and shared cultural traditions that connect generations and communities.',
    $journey$
Angola's cultural identity lives in rhythm. It is heard in percussion, carried through song and expressed through dances that preserve memory, celebrate community and mark the important moments of life.

Angolan Culture & Dance invites guests to encounter this living heritage with respect and curiosity. Rather than presenting culture as performance alone, the journey creates space to understand the meaning behind movement, musical traditions, clothing, instruments and the social settings in which they have developed.

Depending on the programme and local availability, the experience may include demonstrations, guided interpretation, conversations with cultural practitioners and opportunities to engage with music and dance in an appropriate and welcoming setting.

This journey is designed to celebrate Angola's diversity without reducing it to spectacle. Its purpose is to help travellers appreciate culture as something lived, shared and continually renewed by the people who carry it forward.
$journey$,
    'Half day',
    'Culture',
    'https://www.youtube.com/watch?v=U9ILT0S2GYA&t=25s',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 003 — MIRADOURO DA LUA & KWANZA RIVER
(
    'miradouro-da-lua-and-kwanza-river',
    'Miradouro da Lua & Kwanza River',
    'Travel south of Luanda to the sculpted landscape of Miradouro da Lua and the calm waters of the Kwanza River.',
    $journey$
South of Luanda, the city gradually gives way to open landscapes, dramatic earth formations and the broad presence of the Kwanza River.

The journey begins with the extraordinary scenery of Miradouro da Lua, where erosion has shaped layered cliffs and ridges into a landscape that feels both ancient and otherworldly. Time is allowed for observation, interpretation and photography while respecting the natural terrain.

The experience then continues toward the Kwanza River, one of Angola's most important waterways. Here, the pace softens. River views, local stories and the surrounding environment offer a different understanding of the country's natural geography and its relationship with human settlement.

Together, these two landscapes create a balanced journey: one defined by dramatic form, the other by movement and tranquillity. It is an accessible introduction to Angola's natural character within reach of the capital.
$journey$,
    'Full day',
    'Nature',
    'https://www.youtube.com/watch?v=lVGz0m0HW4M',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 004 — KISSAMA SAFARI
(
    'kissama-safari',
    'Kissama Safari',
    'Explore the landscapes and wildlife of Kissama in a guided nature journey from Luanda, shaped by responsible observation and local knowledge.',
    $journey$
Kissama offers one of the most accessible opportunities to encounter Angola's natural landscapes and wildlife from Luanda.

The journey travels beyond the capital into a protected environment of open plains, woodland, river systems and changing vegetation. With experienced local guidance, guests explore the park at an unhurried pace, allowing wildlife sightings to unfold naturally rather than treating them as guaranteed performances.

The value of the experience lies not only in the animals that may be observed, but also in the wider story of habitat, conservation, ecological recovery and Angola's renewed relationship with its natural heritage.

Kissama Safari is designed for travellers seeking a grounded introduction to the country's wildlife. Responsible conduct, respect for park regulations and realistic expectations remain central to the experience.
$journey$,
    'Full day',
    'Wildlife',
    'https://www.youtube.com/watch?v=xBZjmw9AreU',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 005 — KALANDULA FALLS & MALANJE
(
    'kalandula-falls-and-malanje',
    'Kalandula Falls & Malanje',
    'Journey into Malanje Province to experience the scale, sound and atmosphere of Kalandula Falls alongside the region''s landscapes and local stories.',
    $journey$
Kalandula Falls is one of Angola's most commanding natural landmarks. Water spreads across a vast horseshoe-shaped escarpment before descending with a force that can be heard and felt across the surrounding landscape.

This journey allows time to experience the falls from carefully selected viewpoints and to appreciate how season, rainfall, light and distance continually reshape the scene. The purpose is not to rush toward a photograph, but to understand the scale and atmosphere of the place.

The wider Malanje experience adds context through regional landscapes, local communities and stories connected to the province. Where programme conditions allow, additional natural or cultural points of interest may be incorporated without distracting from the falls as the central experience.

Kalandula Falls & Malanje is suited to travellers who value nature, photography and a deeper encounter with Angola beyond the capital.
$journey$,
    '2 days / 1 night',
    'Nature',
    'https://www.youtube.com/watch?v=1Bot0Ke7a0Y',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 006 — SERRA DA LEBA & LUBANGO
(
    'serra-da-leba-and-lubango',
    'Serra da Leba & Lubango',
    'Discover Lubango and the dramatic mountain road of Serra da Leba, where highland scenery and southern Angolan identity meet.',
    $journey$
The southern highlands reveal a different Angola: cooler air, expansive views, mountain roads and a strong regional identity shaped by landscape and history.

From Lubango, the journey explores the city's character before continuing toward Serra da Leba. Its celebrated road descends through a sequence of sweeping bends framed by steep slopes and distant valleys, creating one of the country's most recognisable panoramas.

The experience is carefully paced so that the road is understood not merely as a viewpoint, but as part of a wider southern journey connecting geography, movement and human settlement. Weather and visibility can transform the landscape from one hour to the next, giving each visit its own atmosphere.

Serra da Leba & Lubango is designed for travellers drawn to scenic routes, photography, highland environments and the distinctive culture of southern Angola.
$journey$,
    '3 days / 2 nights',
    'Nature',
    'https://www.youtube.com/watch?v=FlWYO9zeRGI',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 007 — BENGUELA & LOBITO COASTAL ESCAPE
(
    'benguela-and-lobito-coastal-escape',
    'Benguela & Lobito Coastal Escape',
    'Experience the Atlantic character of Benguela and Lobito through coastal scenery, urban heritage, local flavour and a relaxed southern rhythm.',
    $journey$
Benguela and Lobito offer a coastal journey shaped by Atlantic light, historic connections, broad avenues and the easy rhythm of life beside the sea.

In Benguela, guests discover a city whose architecture and public spaces reflect layers of history while its markets, cuisine and daily life express a confident contemporary identity. Nearby coastal settings create opportunities to slow down and experience the region beyond its urban landmarks.

Lobito adds another dimension through its bay, port history and long relationship with movement, trade and the railway. Together, the two cities tell a story of connection between Angola's interior and the Atlantic world.

This escape balances cultural discovery with time by the coast. It is designed for travellers who value atmosphere, local interpretation and a journey that feels composed rather than hurried.
$journey$,
    '3 days / 2 nights',
    'Coast',
    'https://www.youtube.com/watch?v=Of-AtWK5CtA',
    null,
    'draft'::public.tour_status,
    false,
    null,
    null
),

-- JOURNEY 008 — CABO LEDO BEACH ESCAPE
(
    'cabo-ledo-beach-escape',
    'Cabo Ledo Beach Escape',
    'Leave the city behind for Cabo Ledo, where Atlantic scenery, warm hospitality and an unhurried coastal setting create space to rest and reconnect.',
    $journey$
Cabo Ledo offers a welcome change of pace from Luanda. The journey follows the coast toward a landscape of open sea, sandy shoreline and cliffs shaped by the Atlantic.

The experience is intentionally simple: time to breathe, walk, enjoy the beach and appreciate the natural setting without an overloaded itinerary. Depending on conditions and the selected programme, guests may also enjoy local cuisine, coastal viewpoints or optional water-based activities delivered by suitable operators.

Cabo Ledo is known for its waves, yet the destination is equally meaningful for travellers who simply want calm, space and a day away from the city's intensity.

This journey is designed as a considered coastal escape rather than a rushed excursion, with comfort, safety and seasonal conditions guiding every departure.
$journey$,
    'Full day',
    'Coast',
    'https://www.youtube.com/watch?v=Om6PSHBDB34',
    null,
    'draft'::public.tour_status,
    false,
    null,
    null
),

-- JOURNEY 009 — M'BANZA KONGO HERITAGE
(
    'mbanza-kongo-heritage',
    'M''Banza Kongo Heritage',
    'Explore M''Banza Kongo through the history, memory and living heritage of the former capital of the Kingdom of Kongo.',
    $journey$
M'Banza Kongo invites travellers into one of the most significant historical landscapes in the region. As the former political and spiritual centre of the Kingdom of Kongo, the city carries a story that extends across present-day borders and continues to shape cultural identity.

This journey approaches that heritage with care. Archaeological places, sacred memory, historic landmarks and local interpretation are brought together to help guests understand the scale and complexity of the kingdom and its encounters with the wider world.

The experience is not limited to the past. M'Banza Kongo remains a living city whose communities continue to preserve and interpret their heritage. Respectful engagement and responsible storytelling are therefore central to the journey.

Designed for culturally curious travellers, researchers and heritage enthusiasts, this experience offers one of the deepest historical encounters in the Signature Angola collection.
$journey$,
    '3 days / 2 nights',
    'Heritage',
    'https://www.youtube.com/watch?v=jkTv2xkPNi8&t=20s',
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
),

-- JOURNEY 010 — NAMIBE DESERT EXPERIENCE
(
    'namibe-desert-experience',
    'Namibe Desert Experience',
    'Enter the remarkable landscapes of Namibe, where desert, mountains and Atlantic coast meet in one of Angola''s most distinctive regions.',
    $journey$
Namibe is a landscape of powerful contrasts. Desert plains reach toward the Atlantic, ancient rock formations rise from open terrain and communities have adapted to an environment defined by distance, wind and scarce water.

The journey is designed to reveal the region gradually. From the character of Moçâmedes to desert scenery and carefully selected natural viewpoints, each stage adds another layer to the understanding of southern Angola.

Where routes, permissions and seasonal conditions allow, the programme may incorporate additional desert, coastal or cultural experiences. The final itinerary must always reflect local guidance, road conditions and responsible access to sensitive environments.

Namibe Desert Experience is for travellers drawn to space, geology, photography and a sense of discovery. It closes the first Signature Angola catalogue with a landscape that feels both elemental and unforgettable.
$journey$,
    '4 days / 3 nights',
    'Nature',
    null,
    null,
    'draft'::public.tour_status,
    true,
    null,
    null
)

on conflict (slug) do update
set
    title = excluded.title,
    short_description = excluded.short_description,
    description = excluded.description,
    duration = excluded.duration,
    category = excluded.category,
    hero_video_url = excluded.hero_video_url,
    featured_image_url = excluded.featured_image_url,
    status = excluded.status,
    is_featured = excluded.is_featured,
    updated_by = excluded.updated_by,
    updated_at = now();

-- =============================================================================
-- CERTIFICATION: ASSERT THE BUSINESS CAPABILITY WAS ESTABLISHED
-- =============================================================================

do $certification$
declare
    expected_slugs constant text[] := array[
        'luanda-highlights',
        'angolan-culture-and-dance',
        'miradouro-da-lua-and-kwanza-river',
        'kissama-safari',
        'kalandula-falls-and-malanje',
        'serra-da-leba-and-lubango',
        'benguela-and-lobito-coastal-escape',
        'cabo-ledo-beach-escape',
        'mbanza-kongo-heritage',
        'namibe-desert-experience'
    ];
    actual_count integer;
    incomplete_count integer;
begin
    select count(*)
      into actual_count
      from public.tours
      where slug = any(expected_slugs);

    if actual_count <> cardinality(expected_slugs) then
        raise exception
            'Business Seed 001 certification failed: expected % flagship journeys, found %.',
            cardinality(expected_slugs),
            actual_count;
    end if;

    select count(*)
      into incomplete_count
      from public.tours
      where slug = any(expected_slugs)
        and (
            btrim(title) = ''
            or short_description is null
            or btrim(short_description) = ''
            or description is null
            or btrim(description) = ''
            or duration is null
            or btrim(duration) = ''
            or category is null
            or btrim(category) = ''
        );

    if incomplete_count > 0 then
        raise exception
            'Business Seed 001 certification failed: % journeys contain incomplete core editorial data.',
            incomplete_count;
    end if;

    raise notice
        'Business Seed 001 certified: % Signature Angola journeys are present and editorially complete.',
        actual_count;
end
$certification$;

commit;

-- =============================================================================
-- POST-COMMIT VERIFICATION
-- =============================================================================

select
    slug,
    title,
    duration,
    category,
    status,
    is_featured,
    hero_video_url,
    featured_image_url,
    updated_at
from public.tours
where slug in (
    'luanda-highlights',
    'angolan-culture-and-dance',
    'miradouro-da-lua-and-kwanza-river',
    'kissama-safari',
    'kalandula-falls-and-malanje',
    'serra-da-leba-and-lubango',
    'benguela-and-lobito-coastal-escape',
    'cabo-ledo-beach-escape',
    'mbanza-kongo-heritage',
    'namibe-desert-experience'
)
order by array_position(
    array[
        'luanda-highlights',
        'angolan-culture-and-dance',
        'miradouro-da-lua-and-kwanza-river',
        'kissama-safari',
        'kalandula-falls-and-malanje',
        'serra-da-leba-and-lubango',
        'benguela-and-lobito-coastal-escape',
        'cabo-ledo-beach-escape',
        'mbanza-kongo-heritage',
        'namibe-desert-experience'
    ]::text[],
    slug
);

select
    count(*) as flagship_journey_count,
    count(*) filter (where status = 'draft'::public.tour_status) as draft_count,
    count(*) filter (where is_featured) as featured_count,
    count(*) filter (where hero_video_url is null) as missing_hero_video_count,
    count(*) filter (where featured_image_url is null) as missing_featured_image_count
from public.tours
where slug in (
    'luanda-highlights',
    'angolan-culture-and-dance',
    'miradouro-da-lua-and-kwanza-river',
    'kissama-safari',
    'kalandula-falls-and-malanje',
    'serra-da-leba-and-lubango',
    'benguela-and-lobito-coastal-escape',
    'cabo-ledo-beach-escape',
    'mbanza-kongo-heritage',
    'namibe-desert-experience'
);

/*
===============================================================================
CERTIFICATION RECORD

Expected flagship journeys: 10
Publication state: Draft
Business capability: Signature Angola Journeys
Growth Ring: IX — Matured
Seed: 001
Version: 1.0.0

The architecture gives it strength.
The journeys give it life.
The people of Angola give it meaning.

STATUS: READY FOR FOUNDER REVIEW AND CONTROLLED EXECUTION
===============================================================================
*/
