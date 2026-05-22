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
- All 1025 Pokédex pages statically generated at build (zero runtime invocations)
- Build-time `Promise.all` parallelization on `fetch-collection.ts`

## Migration

See [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) for the full audit and migration history.
