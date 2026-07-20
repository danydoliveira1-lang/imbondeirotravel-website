# Phase 4.9.1 — Mobile Form & Contact Fix

- Fixed **Craft My Journey** mobile navigation by rendering the hidden contact chapter before scrolling.
- Fixed **Craft My Private Journey** so it reveals the request form, pre-fills a private-journey note and focuses travel dates.
- Linked `imbondeirotravel@gmail.com` with `mailto:`.
- Added a **Send by Email** fallback with the journey details pre-filled.
- Preserved WhatsApp number `+244 945 175 238` and its pre-filled journey message.
- Form API email delivery still requires `RESEND_API_KEY` and verified sender settings in Vercel.
