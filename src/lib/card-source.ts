import { cache } from "react";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { retryWithBackoff } from "./load-cards";

/**
 * Card Source — the single seam through which every route reads card data.
 *
 * Reads are wrapped in React.cache, so identical calls within one request or
 * prerender pass are deduplicated. This is what lets card/[cardId] call
 * getCardById in both generateMetadata and the page component while only
 * hitting the Pokémon TCG API once. retryWithBackoff handles 429 rate limits.
 */
export const getCardsByQuery = cache(
  async (q: string, orderBy?: string): Promise<PokemonTCG.ICard[]> => {
    try {
      return await retryWithBackoff(() =>
        PokemonTCG.findCardsByQueries(orderBy ? { q, orderBy } : { q })
      );
    } catch (error) {
      console.error(`[card-source] query failed: ${q}`, error);
      return [];
    }
  }
);

export const getCardById = cache(
  async (id: string): Promise<PokemonTCG.ICard | undefined> => {
    try {
      return await retryWithBackoff(() => PokemonTCG.findCardByID(id));
    } catch (error) {
      console.error(`[card-source] card ${id} failed`, error);
      return undefined;
    }
  }
);
