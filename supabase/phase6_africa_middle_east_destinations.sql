-- Imbondeiro Travel
-- Phase 6: Africa & Middle East destination register
-- Safe to run more than once.

-- A country may contain independently presented destinations,
-- such as Tanzania and Zanzibar.
alter table public.explorer_destinations
drop constraint if exists explorer_destinations_country_code_key;

alter table public.explorer_destinations
add column if not exists destination_type text
not null default 'country'
check (
  destination_type in (
    'country',
    'island',
    'city',
    'region'
  )
);

alter table public.explorer_destinations
add column if not exists parent_country_code text;

create index if not exists
  explorer_destinations_country_code_index
on public.explorer_destinations (country_code);

insert into public.explorer_destinations (
  name,
  slug,
  country_code,
  explorer_region,
  subregion,
  capital,
  launch_status,
  supplier_status,
  enquiry_enabled,
  published,
  featured,
  sort_order
)
values
  -- Flagship
  ('Angola', 'angola', 'AO', 'Africa', 'Southern Africa', 'Luanda',
   'bookable', 'ready', true, false, true, 1),

  -- Southern Africa
  ('South Africa', 'south-africa', 'ZA', 'Africa', 'Southern Africa', 'Pretoria',
   'tailor_made', 'developing', true, false, true, 10),
  ('Namibia', 'namibia', 'NA', 'Africa', 'Southern Africa', 'Windhoek',
   'tailor_made', 'developing', true, false, true, 11),
  ('Botswana', 'botswana', 'BW', 'Africa', 'Southern Africa', 'Gaborone',
   'tailor_made', 'developing', true, false, true, 12),
  ('Zimbabwe', 'zimbabwe', 'ZW', 'Africa', 'Southern Africa', 'Harare',
   'tailor_made', 'developing', true, false, false, 13),
  ('Zambia', 'zambia', 'ZM', 'Africa', 'Southern Africa', 'Lusaka',
   'tailor_made', 'developing', true, false, false, 14),
  ('Mozambique', 'mozambique', 'MZ', 'Africa', 'Southern Africa', 'Maputo',
   'tailor_made', 'developing', true, false, false, 15),
  ('Malawi', 'malawi', 'MW', 'Africa', 'Southern Africa', 'Lilongwe',
   'tailor_made', 'developing', true, false, false, 16),
  ('Lesotho', 'lesotho', 'LS', 'Africa', 'Southern Africa', 'Maseru',
   'tailor_made', 'developing', true, false, false, 17),
  ('Eswatini', 'eswatini', 'SZ', 'Africa', 'Southern Africa', 'Mbabane',
   'tailor_made', 'developing', true, false, false, 18),

  -- East Africa
  ('Kenya', 'kenya', 'KE', 'Africa', 'East Africa', 'Nairobi',
   'tailor_made', 'developing', true, false, true, 30),
  ('Tanzania', 'tanzania', 'TZ', 'Africa', 'East Africa', 'Dodoma',
   'tailor_made', 'developing', true, false, true, 31),
  ('Rwanda', 'rwanda', 'RW', 'Africa', 'East Africa', 'Kigali',
   'tailor_made', 'developing', true, false, false, 32),
  ('Uganda', 'uganda', 'UG', 'Africa', 'East Africa', 'Kampala',
   'tailor_made', 'developing', true, false, false, 33),
  ('Ethiopia', 'ethiopia', 'ET', 'Africa', 'East Africa', 'Addis Ababa',
   'tailor_made', 'developing', true, false, false, 34),
  ('Djibouti', 'djibouti', 'DJ', 'Africa', 'East Africa', 'Djibouti',
   'tailor_made', 'developing', true, false, false, 35),
  ('Eritrea', 'eritrea', 'ER', 'Africa', 'East Africa', 'Asmara',
   'tailor_made', 'developing', true, false, false, 36),
  ('Somalia', 'somalia', 'SO', 'Africa', 'East Africa', 'Mogadishu',
   'coming_soon', 'not_started', false, false, false, 37),
  ('South Sudan', 'south-sudan', 'SS', 'Africa', 'East Africa', 'Juba',
   'coming_soon', 'not_started', false, false, false, 38),
  ('Burundi', 'burundi', 'BI', 'Africa', 'East Africa', 'Gitega',
   'tailor_made', 'developing', true, false, false, 39),

  -- Indian Ocean
  ('Zanzibar', 'zanzibar', 'TZ', 'Africa', 'Indian Ocean', 'Zanzibar City',
   'tailor_made', 'developing', true, false, true, 49),
  ('Mauritius', 'mauritius', 'MU', 'Africa', 'Indian Ocean', 'Port Louis',
   'tailor_made', 'developing', true, false, true, 50),
  ('Seychelles', 'seychelles', 'SC', 'Africa', 'Indian Ocean', 'Victoria',
   'tailor_made', 'developing', true, false, true, 51),
  ('Madagascar', 'madagascar', 'MG', 'Africa', 'Indian Ocean', 'Antananarivo',
   'tailor_made', 'developing', true, false, false, 52),
  ('Comoros', 'comoros', 'KM', 'Africa', 'Indian Ocean', 'Moroni',
   'tailor_made', 'developing', true, false, false, 53),

  -- Central Africa
  ('Cameroon', 'cameroon', 'CM', 'Africa', 'Central Africa', 'Yaoundé',
   'tailor_made', 'developing', true, false, false, 60),
  ('Gabon', 'gabon', 'GA', 'Africa', 'Central Africa', 'Libreville',
   'tailor_made', 'developing', true, false, false, 61),
  ('Republic of the Congo', 'republic-of-the-congo', 'CG', 'Africa', 'Central Africa', 'Brazzaville',
   'tailor_made', 'developing', true, false, false, 62),
  ('Democratic Republic of the Congo', 'democratic-republic-of-the-congo', 'CD', 'Africa', 'Central Africa', 'Kinshasa',
   'tailor_made', 'developing', true, false, false, 63),
  ('Equatorial Guinea', 'equatorial-guinea', 'GQ', 'Africa', 'Central Africa', 'Malabo',
   'tailor_made', 'developing', true, false, false, 64),
  ('São Tomé and Príncipe', 'sao-tome-and-principe', 'ST', 'Africa', 'Central Africa', 'São Tomé',
   'tailor_made', 'developing', true, false, false, 65),
  ('Central African Republic', 'central-african-republic', 'CF', 'Africa', 'Central Africa', 'Bangui',
   'coming_soon', 'not_started', false, false, false, 66),
  ('Chad', 'chad', 'TD', 'Africa', 'Central Africa', 'N''Djamena',
   'coming_soon', 'not_started', false, false, false, 67),

  -- West Africa
  ('Ghana', 'ghana', 'GH', 'Africa', 'West Africa', 'Accra',
   'tailor_made', 'developing', true, false, true, 70),
  ('Senegal', 'senegal', 'SN', 'Africa', 'West Africa', 'Dakar',
   'tailor_made', 'developing', true, false, false, 71),
  ('Cabo Verde', 'cabo-verde', 'CV', 'Africa', 'West Africa', 'Praia',
   'tailor_made', 'developing', true, false, true, 72),
  ('Nigeria', 'nigeria', 'NG', 'Africa', 'West Africa', 'Abuja',
   'tailor_made', 'developing', true, false, false, 73),
  ('Côte d''Ivoire', 'cote-divoire', 'CI', 'Africa', 'West Africa', 'Yamoussoukro',
   'tailor_made', 'developing', true, false, false, 74),
  ('Benin', 'benin', 'BJ', 'Africa', 'West Africa', 'Porto-Novo',
   'tailor_made', 'developing', true, false, false, 75),
  ('Togo', 'togo', 'TG', 'Africa', 'West Africa', 'Lomé',
   'tailor_made', 'developing', true, false, false, 76),
  ('The Gambia', 'the-gambia', 'GM', 'Africa', 'West Africa', 'Banjul',
   'tailor_made', 'developing', true, false, false, 77),
  ('Guinea', 'guinea', 'GN', 'Africa', 'West Africa', 'Conakry',
   'tailor_made', 'developing', true, false, false, 78),
  ('Guinea-Bissau', 'guinea-bissau', 'GW', 'Africa', 'West Africa', 'Bissau',
   'tailor_made', 'developing', true, false, false, 79),
  ('Liberia', 'liberia', 'LR', 'Africa', 'West Africa', 'Monrovia',
   'tailor_made', 'developing', true, false, false, 80),
  ('Sierra Leone', 'sierra-leone', 'SL', 'Africa', 'West Africa', 'Freetown',
   'tailor_made', 'developing', true, false, false, 81),
  ('Burkina Faso', 'burkina-faso', 'BF', 'Africa', 'West Africa', 'Ouagadougou',
   'coming_soon', 'not_started', false, false, false, 82),
  ('Mali', 'mali', 'ML', 'Africa', 'West Africa', 'Bamako',
   'coming_soon', 'not_started', false, false, false, 83),
  ('Mauritania', 'mauritania', 'MR', 'Africa', 'West Africa', 'Nouakchott',
   'tailor_made', 'developing', true, false, false, 84),
  ('Niger', 'niger', 'NE', 'Africa', 'West Africa', 'Niamey',
   'coming_soon', 'not_started', false, false, false, 85),

  -- North Africa
  ('Morocco', 'morocco', 'MA', 'Africa', 'North Africa', 'Rabat',
   'tailor_made', 'developing', true, false, true, 90),
  ('Egypt', 'egypt', 'EG', 'Africa', 'North Africa', 'Cairo',
   'tailor_made', 'developing', true, false, true, 91),
  ('Tunisia', 'tunisia', 'TN', 'Africa', 'North Africa', 'Tunis',
   'tailor_made', 'developing', true, false, false, 92),
  ('Algeria', 'algeria', 'DZ', 'Africa', 'North Africa', 'Algiers',
   'tailor_made', 'developing', true, false, false, 93),
  ('Libya', 'libya', 'LY', 'Africa', 'North Africa', 'Tripoli',
   'coming_soon', 'not_started', false, false, false, 94),
  ('Sudan', 'sudan', 'SD', 'Africa', 'North Africa', 'Khartoum',
   'coming_soon', 'not_started', false, false, false, 95),

  -- Middle East
  ('United Arab Emirates', 'united-arab-emirates', 'AE', 'Middle East', 'Arabian Peninsula', 'Abu Dhabi',
   'tailor_made', 'developing', true, false, true, 110),
  ('Oman', 'oman', 'OM', 'Middle East', 'Arabian Peninsula', 'Muscat',
   'tailor_made', 'developing', true, false, true, 111),
  ('Qatar', 'qatar', 'QA', 'Middle East', 'Arabian Peninsula', 'Doha',
   'tailor_made', 'developing', true, false, false, 112),
  ('Saudi Arabia', 'saudi-arabia', 'SA', 'Middle East', 'Arabian Peninsula', 'Riyadh',
   'tailor_made', 'developing', true, false, false, 113),
  ('Bahrain', 'bahrain', 'BH', 'Middle East', 'Arabian Peninsula', 'Manama',
   'tailor_made', 'developing', true, false, false, 114),
  ('Kuwait', 'kuwait', 'KW', 'Middle East', 'Arabian Peninsula', 'Kuwait City',
   'tailor_made', 'developing', true, false, false, 115),
  ('Yemen', 'yemen', 'YE', 'Middle East', 'Arabian Peninsula', 'Sana''a',
   'coming_soon', 'not_started', false, false, false, 116),
  ('Jordan', 'jordan', 'JO', 'Middle East', 'Levant', 'Amman',
   'tailor_made', 'developing', true, false, true, 120),
  ('Lebanon', 'lebanon', 'LB', 'Middle East', 'Levant', 'Beirut',
   'coming_soon', 'developing', false, false, false, 121),
  ('Israel', 'israel', 'IL', 'Middle East', 'Levant', 'Jerusalem',
   'coming_soon', 'not_started', false, false, false, 122),
  ('Palestine', 'palestine', 'PS', 'Middle East', 'Levant', 'Ramallah',
   'coming_soon', 'not_started', false, false, false, 123),
  ('Syria', 'syria', 'SY', 'Middle East', 'Levant', 'Damascus',
   'coming_soon', 'not_started', false, false, false, 124),
  ('Iraq', 'iraq', 'IQ', 'Middle East', 'Mesopotamia', 'Baghdad',
   'coming_soon', 'not_started', false, false, false, 125),
  ('Iran', 'iran', 'IR', 'Middle East', 'Persian Plateau', 'Tehran',
   'coming_soon', 'not_started', false, false, false, 126),
  ('Türkiye', 'turkiye', 'TR', 'Middle East', 'Anatolia', 'Ankara',
   'tailor_made', 'developing', true, false, false, 127),
  ('Cyprus', 'cyprus', 'CY', 'Middle East', 'Eastern Mediterranean', 'Nicosia',
   'tailor_made', 'developing', true, false, false, 128)

on conflict (slug)
do update set
  name = excluded.name,
  country_code = excluded.country_code,
  explorer_region = excluded.explorer_region,
  subregion = excluded.subregion,
  capital = excluded.capital,
  updated_at = now();

-- Zanzibar is an island destination belonging to Tanzania.
update public.explorer_destinations
set
  destination_type = 'island',
  parent_country_code = 'TZ',
  updated_at = now()
where slug = 'zanzibar';
