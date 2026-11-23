import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";

const CARD_ID = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/;
const MONTH_SECONDS = 60 * 60 * 24 * 30;

export async function fetchCard(
  cardId: string
): Promise<PokemonTCG.ICard | undefined> {
  // Reject malformed crawler URLs without an upstream request or cache entry.
  if (cardId.length > 64 || !CARD_ID.test(cardId)) return undefined;

  const apiKey = process.env.POKEMONTCG_API_KEY;
  const response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`, {
    headers: apiKey ? { "X-Api-Key": apiKey } : {},
    cache: "force-cache",
    next: { revalidate: MONTH_SECONDS },
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 404) return undefined;
  // Never turn rate limits/outages into cached 404s. During revalidation Next
  // keeps the last successful page when rendering throws. Do not log request
  // objects, which can contain the API key.
  if (!response.ok) {
    throw new Error(`Pokemon TCG card request failed (${response.status})`);
  }

  const payload: { data: PokemonTCG.ICard } = await response.json();
  return payload.data;
}
