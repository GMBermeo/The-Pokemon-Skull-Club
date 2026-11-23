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
- Card API requests time out after 10 seconds. Only a genuine upstream 404 becomes a missing card; transient failures throw so revalidation retains the last successful page

## Migration

See [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) for the full audit and migration history.
