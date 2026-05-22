# Pokemon Skull Club — Migration Plan

Date: 2026-05-21
Owner: @GMBermeo
Target branch: `master` (default, committed directly per request)
Goals (in order): (1) Best-in-class SEO, (2) Lower Vercel cost, (3) Modern stack on safe versions

---

## 1. Current-state audit

### Stack snapshot

| Area | Current | Latest stable (May 2026) | Decision |
|---|---|---|---|
| Next.js | 15.3.8 | 16.2.6 | Upgrade to 16.2.6 (CVE fixes, RSC perf) |
| React / React-DOM | 19.0.0 | 19.2.6 | Upgrade to 19.2.6 |
| TypeScript | 5.7.3 | 6.0.3 (5.9.3 last 5.x) | Stay on `5.9.x` — defer TS 6 |
| Tailwind CSS | 3.4.1 | 4.3.0 (3.4.19 LTS) | Stay on `3.4.19` LTS — defer Tailwind 4 |
| ESLint | 9.19.0 | 10.4.0 (9.39.4 LTS) | Stay on `9.39.4` — defer ESLint 10 |
| eslint-config-next | 15.1.5 | 16.2.6 | Upgrade to 16.2.6 |
| typescript-eslint | 8.22.0 | 8.59.4 | Upgrade to 8.59.4 |
| @vercel/analytics | 1.4.1 | 2.0.1 | Upgrade to 2.0.1 |
| Prettier | 2.8.4 | 3.8.3 | Upgrade to 3.8.3 |
| schema-dts | 1.1.2 | 2.0.0 | Upgrade to 2.0.0 |
| @types/node | 18.11.15 | 25.9.1 | Pin to Node 22 LTS family (`^22`) |
| @types/react | 19.0.7 | 19.2.15 | Upgrade |
| @types/react-dom | 19.0.3 | 19.2.3 | Upgrade |
| postcss | 8.4.35 | 8.5.15 | Upgrade (XSS CVE fix) |
| autoprefixer | 10.4.18 | 10.5.0 | Upgrade |
| pokemon-tcg-sdk-typescript | 1.3.4 (abandoned) | — | Replace with `@pokelib/pokemon-tcg-sdk-typescript@^2.1.4` |

### Security posture

`yarn audit` reports 47 advisories (3 low / 29 moderate / 15 high). All resolve via the upgrades above plus `resolutions` for the abandoned SDK's transitive `axios` & `follow-redirects`. The dominant high-severity items are Next.js (≥15.5.18 patched) and axios (≥1.7.9 patched), both addressed by upgrading.

### Architecture findings

1. **Sequential awaits** in `src/lib/fetch-collection.ts` — 50+ `await` calls that could run in parallel. Already-fixed pattern exists on `Promise.allSettled` branch but never merged.
2. **`"use server";` at the top of regular components** — `BotaoEbay`, every `page.tsx`, `layout.tsx`. This directive is for Server Actions, not RSC. Pages and layouts are server-rendered by default; the directive is a no-op-at-best, source-of-confusion-at-worst. Remove.
3. **Raw `<img>` tags** for external TCG card images (`images.pokemontcg.io`). `loading="lazy"` is set, but there's no `srcset`, `sizes`, `width`/`height`, or AVIF/WebP negotiation. Loses Core Web Vitals (LCP, CLS).
4. **`next.config.js` uses deprecated `images.domains`** — must move to `remotePatterns` for Next 16.
5. **No security headers** (CSP, HSTS, X-Content-Type-Options, etc.).
6. **Hand-maintained 23,009-line `src/app/sitemap.xml`** — Next 15+ supports `sitemap.ts` that generates from your route map and is far more maintainable.
7. **`src/app/robots.txt`** is static — Next supports `robots.ts`.
8. **TypeScript target `es5`** — modern browsers, modern bundlers; bump to ES2022.
9. **No per-page canonical URLs / `alternates`** in metadata. Every page inherits root `metadataBase` but doesn't set canonical, leading to duplicate-content risk.
10. **No `viewport` export** (Next 14+ wants `viewport` separated from metadata for `themeColor`, `colorScheme`, etc.).
11. **JSON-LD only on root layout** — a `Guide` schema is fine but card pages should emit `Product` / `CreativeWork` JSON-LD per card.
12. **`/private` is in sitemap and only blocked by `robots.txt`** — should also use `noindex` meta.
13. **Sibling sitemaps** (`public/sitemap-tcg.xml`, `public/sitemap-trading-card-game.xml`) reference different hosts — fine but duplicate maintenance burden.
14. **No `manifest.webmanifest`** even though metadata references one (commented out).
15. **Two `globals.css` files** — `src/app/globals.css` (used) and `src/styles/globals.css` (orphan); same for `src/styles/Home.module.css`.
16. **No `not-found.tsx` / `error.tsx` / `loading.tsx`** — Next.js renders blank states.
17. **Inline Google Analytics tag without `next/script` strategy attribute** and **eBay tracking script loads on every page** (even pages with no eBay buttons).
18. **`generateStaticParams` for `/pokedex/[number]`** returns 1025 IDs but `/pokedex/[number]/rares/page.tsx` has its own (likely similar) static gen — should be audited for overlap.
19. **`generateStaticParams` for `/card/[cardId]`** issues 21 API queries on every build to enumerate static cards — wasteful; replace with derivation from already-fetched data.

### Vercel cost vectors

- **Image Optimization** — Next's `/_next/image` charges per source image. Set `minimumCacheTTL` to ≥31 days, prefer AVIF, set `formats: ["image/avif", "image/webp"]`, use **`unoptimized: true` for external TCG images** so they stream directly from `images.pokemontcg.io` (free, already-CDN'd) instead of routing through Vercel's optimizer.
- **ISR Bandwidth** — 1025 statically generated pokedex pages × repeated PokemonTCG API calls at build = high build minutes. We are keeping pre-build per your decision, but `revalidate: false` (permanent) + `dynamicParams: false` ensures no on-demand regenerations.
- **Function Invocations** — currently zero edge/serverless invocations because all pages are SSG. Keep it that way.
- **Bandwidth** — adding `Cache-Control` headers + serving SVGs/icons with immutable + 1-year cache.
- **Build duration** — sequential awaits in `fetch-collection.ts` parallelized = ~5–10× faster fetch step.

---

## 2. Migration phases

### Phase 0 — Prep (already done)
- Read entire codebase
- Inventoried CVEs and library lag

### Phase 1 — Config & deps modernization (this PR)
- Add yarn `resolutions` pinning `axios` + `follow-redirects` to patched versions
- Replace abandoned `pokemon-tcg-sdk-typescript` with `@pokelib/pokemon-tcg-sdk-typescript`
- Bump Next, React, ESLint, Prettier, TypeScript, types, postcss, autoprefixer, Tailwind, vercel/analytics, schema-dts
- Move `next.config.js` → `next.config.ts`; switch `images.domains` → `remotePatterns`; add `formats`, `minimumCacheTTL`, `unoptimized` strategy for TCG images, security headers, compression
- Migrate ESLint to flat config (`eslint.config.mjs`)
- Tighten `tsconfig.json` (target ES2022, moduleResolution bundler, strict-er checks)
- Strip stray `"use server";` from non-action server components

### Phase 2 — SEO upgrades (this PR)
- Replace `src/app/sitemap.xml` and `src/app/robots.txt` with dynamic `sitemap.ts` and `robots.ts`
- Add per-page `viewport` export (themeColor, colorScheme)
- Add `alternates.canonical` to every page metadata
- Add per-card JSON-LD (`CreativeWork`) on card detail pages
- Add `noindex, nofollow` robots meta on `/private`
- Add `not-found.tsx`, `error.tsx`, and `loading.tsx`
- Add `manifest.webmanifest` (was referenced, missing)
- Add `<link rel="preconnect">` for `images.pokemontcg.io`

### Phase 3 — Image & cost optimization (this PR)
- Replace `<img>` with `next/image` for TCG card images, with explicit `width`/`height`, `sizes`, `loading="lazy"` (already implicit), `fetchPriority="low"` for grid items, `priority` on top-of-grid LCP image
- Configure `unoptimized: true` for `images.pokemontcg.io` (already a fast CDN) to spare Vercel image-optimization quota
- Add `Cache-Control: public, max-age=31536000, immutable` for `/icons/*`, `/social/*`, `/opengraph/*` via `headers()` in `next.config.ts`
- Parallelize `fetch-collection.ts` with `Promise.all` to slash build time
- Pull eBay tracker script load to only `/card/[cardId]` pages (where `BotaoEbay` actually renders) via per-page `<Script>`

### Phase 4 — Verification
- `yarn install`, `yarn build`, `yarn lint`, `tsc --noEmit`
- Manual smoke: home, a pokedex page, a card page, the artist index, dogs

### Phase 5 — Deferred (separate PRs / future work)
- Tailwind 3 → 4 (CSS-first config; CSS rewrite + postcss removal)
- TypeScript 5.9 → 6.0 (after Tailwind 4 lands)
- ESLint 9 → 10 (Node 22+ floor)
- Consider on-demand ISR for cold pokedex pages (>500) if Vercel image-CDN quota is still hit after Phase 3
- Add Search Console + Google Analytics 4 data integration

---

## 3. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Next 16 introduces breaking RSC patterns | Med | Removing stray `"use server"` directives aligns with the new contract. Build will surface anything else. |
| Switching SDK package changes namespace | Low | `@pokelib/pokemon-tcg-sdk-typescript` keeps the same `PokemonTCG.*` exports — drop-in. |
| Removing static `sitemap.xml` mid-deploy could 404 Google's crawler | Low | `sitemap.ts` serves at the same `/sitemap.xml` URL after Next's app-router conventions. |
| Image quota: `unoptimized: true` strips Vercel's image optimization for TCG images | Low | We *want* this — `images.pokemontcg.io` is already a fast CDN, and this is the single biggest Vercel-cost lever. |
| eslint flat-config rejects a global rule the team relied on | Low | Mirror current `.eslintrc.json` rules verbatim in the flat config. |
| Prettier 3 reformats whole codebase | Med | This PR intentionally doesn't run `prettier --write` to keep the diff focused on functional changes. Run formatter in a follow-up commit. |

---

## 4. Rollback

All changes are git-tracked. To roll back: `git revert <commit-sha>`. The `next-16-upgrade` and `Promise.allSettled` remote branches remain as alternate references.
