# Project Baobab — Live Hero + Angola Map Fix

This build fixes the two issues reported after Project Baobab went live:

1. Hero freezing: the Hero Engine now mounts only one active media scene at a time and restores the working Step 1 media sources, with local MP4 fallbacks.
2. Incorrect/non-responsive map: the placeholder polygon has been replaced by a geographically accurate Angola outline including Cabinda. Markers are projected from longitude/latitude, routes animate, markers are clickable, and the map supports drag, zoom and reset on desktop and touch devices.

Upload the files at the ZIP root to the GitHub repository root. Remove or disable middleware.js if it still rewrites `/` to `/site.html`.
