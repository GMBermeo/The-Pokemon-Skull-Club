import "server-only";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";

const CARD_ID = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/;
const MONTH_SECONDS = 60 * 60 * 24 * 30;
const HOUR_SECONDS = 60 * 60;
const DATA_URL =
  "https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master";

async function fetchPublishedCard(cardId: string): Promise<PokemonTCG.ICard> {
  const [setId] = cardId.split("-");
  // The API provider publishes cards and sets separately. No API key may be
  // forwarded to this public source, and it does not contain market prices.
  const responses = await Promise.all(
    [`cards/en/${setId}.json`, "sets/en.json"].map((path) =>
      fetch(`${DATA_URL}/${path}`, {
        cache: "force-cache",
        next: { revalidate: HOUR_SECONDS },
        signal: AbortSignal.timeout(10_000),
      })
    )
  );
  if (responses.some((response) => !response.ok)) {
    throw new Error("Published card data unavailable.");
  }

  const [cards, sets]: [Omit<PokemonTCG.ICard, "set">[], PokemonTCG.ISet[]] =
    await Promise.all([responses[0].json(), responses[1].json()]);
  const card = Array.isArray(cards)
    ? cards.find((candidate) => candidate?.id === cardId)
    : undefined;
  const set = Array.isArray(sets)
    ? sets.find((candidate) => candidate?.id === setId)
    : undefined;

  // Absence in this historical dataset is not proof of an upstream 404.
  if (!card || !set) throw new Error("Published card data incomplete.");
  return { ...card, set };
}

export async function fetchCard(
  cardId: string
): Promise<PokemonTCG.ICard | undefined> {
  // Reject malformed crawler URLs without an upstream request or cache entry.
  if (cardId.length > 64 || !CARD_ID.test(cardId)) return undefined;

  const apiKey = process.env.POKEMONTCG_API_KEY;
  let response: Response | undefined;
  try {
    response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`, {
      headers: apiKey ? { "X-Api-Key": apiKey } : {},
      cache: "force-cache",
      next: { revalidate: MONTH_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Network errors and timeouts can use the same fallback as upstream 5xx.
    // Never retain raw request errors, which may carry credentials.
  }

  if (response?.status === 404) return undefined;
  if (response?.ok) {
    const payload: { data: PokemonTCG.ICard } = await response.json();
    return payload.data;
  }

  if (!response || response.status === 429 || response.status >= 500) {
    try {
      // An hourly fallback revalidation lets pages recover API pricing sooner
      // than the normal monthly cache without retrying an outage in a loop.
      return await fetchPublishedCard(cardId);
    } catch {
      // If both sources fail, throw so ISR retains any last successful page.
      // Do not turn an outage or an unknown new set into a cached 404.
    }
  }

  throw new Error(
    `Pokemon TCG card request failed (${response?.status ?? "network"})`
  );
}
