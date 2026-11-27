# Pokemon Skull Club

A statically-generated Pokémon TCG collection site (Bone Club). Live at [pokemon.bermeo.dev](https://pokemon.bermeo.dev).

## Stack

- **Next.js 16** (App Router, RSC, Turbopack dev)
- **React 19.2**
- **TypeScript 5.9** (ES2022 target, `bundler` moduleResolution)
- **Tailwind CSS 3.4** (LTS)
- **ESLint 9** (flat config)
- **@pokelib/pokemon-tcg-sdk-typescript** (community fork of the abandoned upstream)
- **Vercel Analytics**

## Scripts

```bash
yarn dev          # start Turbopack dev server
yarn build        # production build (SSG)
yarn start        # serve the production build locally
yarn lint         # ESLint
yarn type-check   # tsc --noEmit
```

## Pokémon TCG API key

Set `POKEMONTCG_API_KEY` in the server environment (use `.env.local` for local
development). Keep that exact name; never add a `NEXT_PUBLIC_` prefix or put the
value in `next.config.ts`.

For rotation, generate a replacement at the Pokémon TCG API provider, then save it
as **Secret** under **Type** in the project's **Environment Variables** page for
the environments that need it. Deploy again to pick up the new value, verify card
requests succeed, and revoke the old key at the provider. If the old key is known
to be compromised, revoke it immediately. Existing deployments keep their old
environment values. Do not paste keys into source code, logs, issues or PRs.
See [Vercel's Config and Secret documentation](https://vercel.com/docs/environment-variables/sensitive-environment-variables).

All card requests must go through `src/lib/pokemon-tcg.ts`. This server-only
boundary keeps the SDK out of client code and replaces credential-bearing SDK
errors with a safe error that retains only the HTTP status for retries and 404s.
Import SDK interfaces with `import type` when only types are needed.

## SEO

- Dynamic `sitemap.ts` and `robots.ts` (Next.js Metadata API)
- Per-page canonical URLs via `alternates.canonical`
- OpenGraph + Twitter card on every page
- JSON-LD `Guide` at site level, `CreativeWork` per card
- `manifest.ts` (PWA)
- `viewport` export with `themeColor`/`colorScheme`

## Vercel cost controls

- External Pokémon TCG images served via `images.pokemontcg.io` with `unoptimized: true` (bypasses paid Image Optimization)
- 1-year immutable cache headers on `/icons`, `/social`, `/opengraph`
- Both standard and rare pages for all 1025 Pokédex numbers are statically generated at build; unknown numbers return 404 without API calls
- Card details use on-demand static generation: the first visit renders HTML on the server, then the page and upstream data are cached for 30 days. A first visit can be slower; prices are snapshots, not live quotes
- Card discovery no longer fans out into thousands of individual API requests at every build
- Collection fetching uses batches of four to reduce rate-limit bursts; 429 retries actually wait before retrying
- Card API requests time out after 10 seconds. On network failures, 429s, or 5xx responses, card details fall back to the API provider's [published historical data](https://github.com/PokemonTCG/pokemon-tcg-data), joining the card with its set. This public request never receives the API key and has no market prices; the page omits pricing when unavailable. Fallback data revalidates hourly so the page can recover API pricing without waiting a month
- Only a genuine upstream 404 becomes a missing card. If both sources fail, or the historical dataset lacks a card/set, rendering still throws so revalidation retains the last successful page. Authentication errors are not hidden by the fallback
- The provider has announced that the Pokémon TCG API will shut down on March 1, 2027. This historical-data fallback mitigates outages; migrating collection queries and pricing to a maintained provider remains separate work

## Migration

See [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) for the full audit and migration history.
