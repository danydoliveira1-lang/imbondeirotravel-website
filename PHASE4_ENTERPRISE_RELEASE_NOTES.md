# Project Imbondeiro — Phase 4 Enterprise Edition

## Included corrections
- Footer signature changed to **Project Imbondeiro · Crafted with passion for Angola and the world.**
- M’Banza Kongo video starts at 20 seconds and ends at 3 minutes 45 seconds.
- YouTube captions remain disabled where the platform permits (`cc_load_policy=0`).
- Explorer **Craft My Journey** now reveals and scrolls to the enquiry form.
- Journey request email sends an internal notification and attempts a customer acknowledgement.
- `/admin` provides a Signature Departure Manager preview with add, edit, delete, availability calculations and JSON export.

## Required Vercel configuration
Set the variables documented in `.env.example`, especially `RESEND_API_KEY`, `IMBONDEIRO_TO_EMAIL`, `IMBONDEIRO_FROM_EMAIL`, and `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Important management-portal note
The included `/admin` editor persists changes in the current browser and can export JSON. It is a safe deployable preview, not yet a shared cloud database. To make edits update the public website for every visitor without a GitHub deployment, connect the portal to a hosted database and authentication service (for example Supabase) before granting staff access.
