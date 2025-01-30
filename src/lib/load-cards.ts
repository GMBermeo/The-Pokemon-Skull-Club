import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const apiError = error as ApiError;
    if (retries === 0 || apiError?.response?.status !== 429) {
      throw error;
    }
    const delay =
      baseDelay * 100 ** (3 - retries) * (0.9 + Math.random() * 0.2);
    console.log(`Rate limited. Retrying in ${Math.round(delay)}ms...`);

    return retryWithBackoff(fn, retries - 1, baseDelay);
  }
}

export const generalFilter: string =
  "-set.id:ru* -set.id:mcd* -set.id:ecard* -rarity:*rainbow* (-subtypes:BREAK AND -subtypes:V-UNION)";

export async function loadCards(
  startPokemon: number,
  finalPokemon?: number
): Promise<PokemonTCG.Card[]> {
  const subtypes = [
    "EX hp:[200 TO *]",
    "V",
    "GX",
    "MEGA",
    "VMAX",
    "TAG",
    // "Basic",
  ];
  const regions: string[] = ["alola*", "galar*", "hisui*", "paldea*"];

  const totalPokemons: number = finalPokemon ?? startPokemon;

  // const conflictFilter: string = `(-subtypes:${subtypes
  //   .map((subtype) => `${subtype}`)
  //   .join(" AND -subtypes:")})
  //   (-name:${regions.map((region) => `${region}`).join(" AND -name:")})`;

  const paramsArray: PokemonTCG.Parameter[] = [];

  // Add the parameters for the first query
  for (let i = startPokemon; i <= totalPokemons; i++) {
    const params: PokemonTCG.Parameter = {
      q: `nationalPokedexNumbers:${i} ${generalFilter}`,
      pageSize: 1,
      orderBy:
        "rarity, tcgplayer.prices.normal.market, tcgplayer.prices.holofoil.market",
    };
    paramsArray.push(params);
  }

  // Add the parameters for subtypes
  for (const subtype of subtypes) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} ${generalFilter} subtypes:${subtype}`,
        pageSize: 1,
        orderBy:
          "rarity, tcgplayer.prices.normal.market, tcgplayer.prices.holofoil.market",
      };
      paramsArray.push(params);
    }
  }

  // Add the parameters for regions
  for (const region of regions) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} ${generalFilter} name:${region}`,
        pageSize: 1,
        orderBy: "rarity, tcgplayer.prices.market",
      };
      paramsArray.push(params);
    }
  }

  const cardCollection: PokemonTCG.Card[] = [];
  const cardIds = new Set<string>(); // Create a Set to track unique card IDs

  // Update the card fetching loop
  for (const params of paramsArray) {
    try {
      const response: PokemonTCG.Card[] = await retryWithBackoff(() =>
        PokemonTCG.findCardsByQueries(params)
      );
      const card: PokemonTCG.Card = response[0];
      if (card && !cardIds.has(card.id)) {
        cardCollection.push(card);
        cardIds.add(card.id);
      }
    } catch (error: unknown) {
      if ((error as ApiError).response?.status == 404) {
        console.error(
          "Error fetching card, skipping:",
          params.q,
          (error as ApiError).response?.status
        );
        break;
      }
      if ((error as ApiError).response?.status != 429) {
        console.error(
          "Error fetching card:",
          params.q,
          (error as ApiError).response?.status
        );
      }
      continue;
    }
  }

  return cardCollection;
}
