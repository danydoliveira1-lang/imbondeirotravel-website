# Phase 5 Production Launch Checklist

## 1. Database migration

Run `supabase/phase5_4_launch_readiness.sql` once in the production Supabase SQL Editor before deploying this release.

The migration is idempotent and may be run again safely.

## 2. Required Vercel Production environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `COMMAND_CENTRE_EMAIL`
- `COMMAND_CENTRE_PASSWORD`
- `COMMAND_CENTRE_SESSION_SECRET`
- `RESEND_API_KEY`
- `IMBONDEIRO_TO_EMAIL`
- `IMBONDEIRO_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL=https://www.imbondeirotravel.com`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

Recommended:

- `IMBONDEIRO_JOURNEY_DESIGNER`
- `IMBONDEIRO_RESPONSE_TIME`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Never commit the values of these variables to GitHub.

## 3. Website smoke test

- Confirm the approved logo appears in both the header and footer.
- Confirm the hero reads “Your Lifetime Experience”.
- Test the menu and every visible chapter.
- Add and remove destinations in My Journey.
- Test the currency converter.
- Check desktop and mobile layouts.
- Open `/privacy` and confirm the contact-form consent link works.

## 4. Enquiry end-to-end test

Submit one clearly labelled test request from the live website.

Confirm all of the following:

- The visitor sees a request reference.
- The customer confirmation email arrives.
- The Imbondeiro notification email arrives.
- A Customer record exists in the Command Centre.
- A Reservation with status `Enquiry` exists.
- The reservation appears under `Needs Attention`.
- The top notification count increases.

After validation, mark the test reservation appropriately or remove it before adding financial records.

## 5. Command Centre smoke test

- Sign in and sign out.
- Create or edit a draft tour.
- Create or edit a future departure.
- Open the newly captured test enquiry.
- Upload one test image and confirm its preview.
- Confirm company and brand settings load.
- Print a Pro Forma document.
- Open Tax Preview and confirm the non-fiscal warning.
- Confirm official Tax Invoice issuance remains locked until Billing & Tax Identity is approved and active.
- Print the Management Report.

## 6. Production verification

- Confirm Vercel Production is built from `main`.
- Confirm the custom domain points to the new successful Production deployment.
- Confirm `/robots.txt` and `/sitemap.xml` load.
- Confirm `/admin` is marked no-index.
- Check Vercel Function logs after the test enquiry.
- Keep the previous successful Production deployment available for immediate rollback.
