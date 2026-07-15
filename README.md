# Project Baobab — Functional Explorer + Working Hero Media

This corrected release fixes the hero media issue.

## What changed
- Added three real, browser-compatible H.264 MP4 files to `public/videos/`.
- Hero scenes now preload reliably and crossfade every 10 seconds.
- Preserved all Step 2 media and all Functional Explorer features.
- Kept image fallbacks for slow connections or browsers that block video.

## Current hero scenes
1. JOURNEY — Angola journey visual (temporary preserved-media sequence)
2. WONDER — Kalandula Falls
3. CULTURE — Traditional Angolan dance

For final launch, replace `public/videos/journey-angola.mp4` with approved Serra da Leba drone footage while retaining the same filename.

## Deployment
Upload the contents of this ZIP to the repository root, commit, and let Vercel redeploy. If needed, redeploy with build cache disabled and refresh with Ctrl+Shift+R.

## Verification
`npm run build` completed successfully with Next.js 15.5.7.

## BAOBAB EDITION 05 — Explorer interaction update
- Category buttons filter destinations.
- Destination cards are selectable and include explicit + / ✓ journey controls.
- The SVG Angola map is visible and every glowing marker is clickable.
- Selecting a destination updates the editorial panel without adding it automatically.
- "Add to My Journey" and the + control add/remove destinations.
- After three saved destinations, "Your Journey Is Taking Shape" appears.
