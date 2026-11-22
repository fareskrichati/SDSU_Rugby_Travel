# SDSU Rugby Travel

SDSU Men’s Rugby website with a match dashboard, fall/spring seasons, editable travel packets, rosters, car assignments, maps, and printable packets.

## Hosting on Netlify

This project uses standard Next.js App Router and Netlify Blobs. Public viewing does not require ChatGPT sign-in. Staff edits are authorized on the server using `TRAVEL_EDIT_CODE`.

1. Connect this GitHub repository to Netlify.
2. Build command: `npm run build`. Publish directory: `.next`. These are also set in `netlify.toml`.
3. Add the environment variable `TRAVEL_EDIT_CODE` in Netlify with **Functions** scope, for the production deploy context. Enter the staff code there; do not commit it to GitHub.
4. Deploy. Netlify automatically provides Blobs access to its functions; no Cloudflare account or external database credentials are required.
5. Add `rugby.fareskrichati.com` under Domain management. In Porkbun, point the `rugby` CNAME to the actual Netlify project's `.netlify.app` hostname.

Do not set `RUGBY_LOCAL_DATA_DIR` on Netlify. Do not use a static export or `dist` as the publish directory. Netlify's Next.js adapter runs the server API and expects `.next`.

## Saved information

The site-wide Netlify Blobs store `rugby-travel` contains a single `published-packet` JSON record with the complete packet data and revision number. It persists across redeploys. Reads use strong consistency; saves use ETag-based conditional writes to reject simultaneous or stale edits with HTTP 409.

The first visit to a fresh store shows the clearly labeled example packet. Publishing through Staff access creates the first stored revision. Real records from the previous Cloudflare-hosted site are not automatically transferred by pushing source code. Keep the previous host available until any required data is exported and migrated; do not use disposable local preview data as production data.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm ci
cp .env.example .env.local
# Edit .env.local and choose a development-only TRAVEL_EDIT_CODE.
npm run dev
```

Open http://127.0.0.1:3000. Development saves go to ignored `.local-data/packet.json`. This is an explicit local development adapter, never a production fallback.

To test a production build locally:

```sh
npm run build
RUGBY_LOCAL_DATA_DIR=/tmp/rugby-local-preview TRAVEL_EDIT_CODE=local-test-code npm start
```

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The GitHub repository contains source only. Staff codes, local data, build outputs, dependencies, and Netlify credentials must remain outside source control.

`STARTER.md`, `.openai/`, and older helper scripts describe the former Sites development environment. They are not used by the Next.js/Netlify build.
