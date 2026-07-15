# Explorer Map Visibility Fix

This release fixes the blank Explorer map by:

- using explicit SVG fill and stroke values instead of relying only on SVG gradients;
- adding a CSS Angola silhouette fallback behind the SVG;
- forcing correct map layer order for routes and markers;
- packaging the Next.js project files at the ZIP root (no extra parent folder).

## Run locally

Do not open the folder directly in the browser. In the project folder run:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

For GitHub/Vercel, upload the root contents: `app`, `components`, `public`, `package.json`, and the other root files.
