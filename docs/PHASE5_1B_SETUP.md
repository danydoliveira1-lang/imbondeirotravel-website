# Project Imbondeiro — Phase 5.1B Live Command Centre

This release replaces browser-only preview saving with a shared Supabase database.

## 1. Create the database
1. Create or open your Supabase project.
2. Open **SQL Editor**.
3. Paste and run `supabase/phase5_1b_schema.sql`.

## 2. Add Vercel environment variables
In Vercel, open **Project > Settings > Environment Variables** and add:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `COMMAND_CENTRE_EMAIL`
- `COMMAND_CENTRE_PASSWORD`
- `COMMAND_CENTRE_SESSION_SECRET`

Use a long random value for the session secret. Apply each variable to Production, Preview and Development if required.

## 3. Redeploy
Redeploy the project after adding the variables. Open `/admin`, sign in with the configured Command Centre credentials, edit a departure and click Save.

## 4. Verify the live connection
Refresh the public homepage. The Upcoming Signature Departures section now reads from the same database and should show the saved date, capacity, status and availability.

## Security
The Supabase service-role key is only used by server routes and must never be prefixed with `NEXT_PUBLIC_` or pasted into browser code.
