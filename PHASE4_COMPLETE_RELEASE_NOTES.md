# Project Baobab — Phase 4 Complete

This release consolidates Phase 4.5.2, Phase 4.6 and Phase 4.7 into one deploy-ready project.

## Phase 4.5.2 — Video correction
- M’Banza Kongo starts at 20 seconds in Culture and Heritage.
- Kalandula starts at 50 seconds.
- Traditional Dance starts at 25 seconds.
- Agostinho Neto Memorial starts at 72 seconds.
- Fortaleza de São Miguel starts at 5 seconds.
- YouTube captions are disabled where the source supports it (`cc_load_policy=0`).
- Privacy-enhanced YouTube embeds are used.
- Fallback images remain available for reduced-motion users or unavailable video playback.

## Phase 4.6 — Living Museum stories
- Expanded destination-specific editorial stories.
- Destination location map cards with coordinates.
- Editorial visual galleries.
- Curated local experiences.
- Recommended accommodation guidance.
- Practical details, access, best period, journeys and departure availability.

## Phase 4.7 — Launch readiness
- Improved journey enquiry form, validation, consent and anti-spam honeypot.
- Resend email delivery with Reply-To set to the traveller.
- WhatsApp enquiry button and pre-filled journey text.
- Optional GA4 analytics and conversion events.
- SEO metadata, Open Graph, Twitter card, structured data, robots and sitemap.
- Skip link, focus indicators, keyboard-close destination stories and reduced-motion support.
- Responsive gallery, map, booking and destination layouts.

## Vercel environment variables
Copy values from `.env.example` into Vercel → Project Settings → Environment Variables. A verified sending domain is required for a production Resend sender address.

## Final human device checks
Automated builds can confirm compilation, but launch approval should also include hands-on checks in current Chrome, Edge, Safari and Firefox on desktop, iPhone and Android. Verify every YouTube source is embeddable in the visitor’s region and that no captions are burned permanently into the source footage.
