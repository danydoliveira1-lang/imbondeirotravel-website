# Vercel dependency-install fix

This release replaces every private/internal dependency URL in `package-lock.json`
with the public npm registry (`https://registry.npmjs.org/`).

The project `.npmrc` also explicitly uses the public npm registry.

Upload/replace **all root files**, especially:
- `package-lock.json`
- `.npmrc`
- `package.json`

Then redeploy in Vercel with the build cache cleared.
