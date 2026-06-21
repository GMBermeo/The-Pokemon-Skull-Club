import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { getCardsByQuery } from "./card-source";
import { fetchPokemonCollection } from "./fetch-collection";
import { pokemonCollections, subtypeCollections } from "./collections";
import { artists } from "./artists";

let indexPromise: Promise<PokemonTCG.ICard[]> | null = null;

async function buildSiteCardIndex(): Promise<PokemonTCG.ICard[]> {
  const sources = [
    ...pokemonCollections.flatMap((c) => c.sources),
    ...subtypeCollections.flatMap((c) => c.sources),
    ...artists.map((a) => ({ q: a.query, orderBy: "-set.releaseDate" })),
  ];

  const groups = await Promise.all([
    fetchPokemonCollection(),
    ...sources.map((s) => getCardsByQuery(s.q, s.orderBy)),
  ]);

  const seen = new Set<string>();
  const all: PokemonTCG.ICard[] = [];
  for (const card of groups.flat()) {
    if (seen.has(card.id)) continue;
    seen.add(card.id);
    all.push(card);
  }
  return all;
}

/**
 * Every card the site links to (home + all collections + subtypes + artists),
 * deduped. This is the source for prerendering all /card/[id] pages and for
 * listing them in the sitemap. Memoized for the lifetime of the build process
 * so the many routes that need it share a single fetch.
 */
export function getSiteCardIndex(): Promise<PokemonTCG.ICard[]> {
  if (!indexPromise) indexPromise = buildSiteCardIndex();
  return indexPromise;
}

/** Distinct National Pokédex numbers that actually have cards in the index. */
export function cardBearingPokedexNumbers(
  cards: PokemonTCG.ICard[]
): number[] {
  const numbers = new Set<number>();
  for (const card of cards) {
    const n = card.nationalPokedexNumbers?.[0];
    if (n) numbers.add(n);
  }
  return [...numbers].sort((a, b) => a - b);
}
