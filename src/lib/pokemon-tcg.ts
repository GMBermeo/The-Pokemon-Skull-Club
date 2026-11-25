import "server-only";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";

// The SDK reads POKEMONTCG_API_KEY from the server environment. Never expose
// its raw errors: Axios errors can include the key in config/request headers.
async function requestCards<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const status = (error as { response?: { status?: unknown } } | null)
      ?.response?.status;

    // Keep only the HTTP status for existing 404 handling and 429 retries.
    // Do not retain the original message, cause, response body or request.
    throw Object.assign(
      new Error("Pokémon TCG request failed."),
      typeof status === "number" ? { response: { status } } : {}
    );
  }
}

export function findCardsByQueries(
  params: PokemonTCG.IParameter
): Promise<PokemonTCG.ICard[]> {
  return requestCards(() => PokemonTCG.findCardsByQueries(params));
}

export function findCardByID(id: string): Promise<PokemonTCG.ICard> {
  return requestCards(() => PokemonTCG.findCardByID(id));
}
