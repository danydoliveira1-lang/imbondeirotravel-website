# Project Imbondeiro — Phase 5.1
## Imbondeiro Command Centre Preview

### Open the Command Centre
After deployment, visit:

`https://www.imbondeirotravel.com/admin`

For this first preview, enter the pre-filled email and any password. The preview session is browser-based so Daniela can immediately inspect and test the workflows before the Supabase credentials are connected.

### Working no-code features
- Branded staff login screen
- Executive dashboard and live summary cards
- Tour Manager: add, edit and delete tours
- Departure Manager: dates, capacity, booked seats, held seats and availability
- Reservation Manager: enquiry-to-confirmed status workflow
- Customer CRM foundation
- Media Library for YouTube IDs, images and documents
- Search across the current module
- Mobile-responsive Command Centre
- Automatic browser persistence through local storage

### Cloud activation prepared
The included `supabase/phase5_1_schema.sql` creates the production tables, booking lifecycle, seat-inventory view, authentication profiles and Row Level Security foundation.

The preview deliberately does not claim production security or multi-user cloud synchronisation yet. Those become live after the Imbondeiro Supabase project is created and its environment credentials are added to Vercel.

### Safe deployment
The existing Phase 4 public website is preserved. Phase 5.1 adds the new `/admin` route without replacing the homepage.
