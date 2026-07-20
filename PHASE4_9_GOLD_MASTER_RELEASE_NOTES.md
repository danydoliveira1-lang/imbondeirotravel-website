# Project Imbondeiro — Phase 4.9 Gold Master

## Customer journey fixes

- Rebuilt the Craft My Journey form with visible validation and loading states.
- Added a successful request confirmation panel with a unique reference number.
- Added the “Travel Designer Assigned” experience:
  - Daniela Nama D'Oliveira
  - Response target: Within 24 hours
- Added customer and Imbondeiro notification emails through Resend.
- Updated the WhatsApp number to +244 945 175 238.
- Expanded the WhatsApp message to include journey, dates, travellers, style, budget and contact details.
- Preserved the selected Explorer journey in the request message.

## Required Vercel setup

Email cannot be delivered until the following environment variables are added to Vercel:

- RESEND_API_KEY
- IMBONDEIRO_TO_EMAIL
- IMBONDEIRO_FROM_EMAIL
- NEXT_PUBLIC_WHATSAPP_NUMBER
- IMBONDEIRO_JOURNEY_DESIGNER
- IMBONDEIRO_RESPONSE_TIME

Copy the values from `.env.example`, replace the Resend key with a real key, verify the sending domain in Resend, and redeploy.

## Important Phase 5 note

The current `/admin` portal remains a browser-local prototype. Shared live data, secure staff login, real-time inventory and automatic seat holds belong to Phase 5 and require a cloud database and authentication.
