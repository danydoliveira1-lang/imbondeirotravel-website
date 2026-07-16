# Project Baobab — Phase 2.1 Global Navigation

## Continuously visible on desktop and mobile
- Imbondeiro logo
- Meet Angola
- The Imbondeiro Explorer
- My Journey with live selection count
- Menu

On compact mobile screens, Meet Angola and Explorer remain available inside the full-screen menu while the header preserves Logo, My Journey and Menu without crowding.

## Full-screen editorial menu
Includes Gateway, Meet Angola, Explorer, Signature Journeys, Beyond Angola, Services, Journal, Our Story, DMC & Partners and Contact.

## Language
EN / PT / FR / ES controls are functional for the navigation, hero and key Living Explorer interface. The preference is stored in the browser.

## Currency
AOA / EUR / USD / ZAR / GBP preference is stored in the browser. A live converter uses the server-side `/api/exchange` route so the website does not expose an API key.

## Deployment
The archive includes `.npmrc` pointing to the public npm registry. It intentionally excludes `node_modules`, `.next` and `package-lock.json`. Upload the contents to the repository root. Keep the clean public-registry `package-lock.json` currently in GitHub, or regenerate it locally after extraction.
