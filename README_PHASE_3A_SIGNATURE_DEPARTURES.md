# Project Baobab — Phase 3A: Signature Departures

This release adds the public-facing Signature Departures experience while preserving the Phase 2.2 curated navigation and Living Explorer.

## Included

- Editorial Upcoming Signature Departures section
- Scheduled departure dates and durations
- Maximum guest capacity
- Automatically calculated places remaining
- Available, Limited Places and Sold Out states
- Reserve Your Place integration with My Journey
- Private journey / preferred dates option
- Responsive desktop and mobile layouts
- One central editable data file

## How to change tours and availability now

Open:

`data/signatureDepartures.js`

Each departure contains:

- title
- image
- startDate / endDate
- maximumGuests
- reservedGuests
- travelStyle
- status
- featured

Places remaining are calculated automatically:

`maximumGuests - reservedGuests`

Example:

- maximumGuests: 8
- reservedGuests: 3
- website displays: 5 places remaining

Set `status` to:

- `available`
- `limited`
- `sold-out`

Set `featured: true` to display a departure in the initial three-card view.

## Next phase

Phase 3B — Imbondeiro Management Studio will replace manual file editing with a secure `/admin` dashboard and database-backed live updates.
