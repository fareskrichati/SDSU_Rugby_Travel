# SDSU_Rugby_Travel

SDSU Men’s Rugby website with a match dashboard, fall/spring seasons, travel packets, team rosters, car assignments, maps, and code-protected staff editing.

## Stack

React, Vinext, TypeScript, a Cloudflare Worker, and Cloudflare D1 (SQLite) with Drizzle migrations.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_harsh_puppet_master.sql
npm start
```

Apply the local migration once per new local database. Open the URL printed by the server.

To test editing locally, supply a development code:

```sh
npm start -- --var TRAVEL_EDIT_CODE:your-local-test-code
```

Do not put a production edit code in source control.

## Verification

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.mjs
npm run build
```

## Deployment and data

This is a full-stack website. GitHub stores its source; GitHub Pages alone cannot run the packet API or shared database. Deployment needs a Worker-compatible server and a D1 database bound as `DB`, with the SQL migrations in `drizzle/` applied. Set `TRAVEL_EDIT_CODE` as a runtime secret on the destination host.

ChatGPT sign-in on the previous host is controlled by that host’s access settings. Pushing to GitHub does not deploy the website or change those settings.

Live travel packets, rosters, and staff secrets are not part of this repository. Export live data separately before retiring the previous host; otherwise a new database starts with the clearly marked example packet. Local preview records under `.wrangler/` are disposable test data and must not be uploaded as production data.

The custom domain was disconnected from the previous host. Configure it on the new host after deployment.

See [STARTER.md](STARTER.md) for the original framework and Sites development notes. The tracked `.openai/hosting.json` identifies the original Sites project; it does not contain credentials.
