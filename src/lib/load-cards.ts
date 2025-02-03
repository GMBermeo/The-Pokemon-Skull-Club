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
  const subtypes = ["EX hp:[200 TO *]", "V", "GX", "MEGA", "VMAX", "TAG"];
  const regions = ["alola*", "galar*", "hisui*", "paldea*"];
  const totalPokemons: number = finalPokemon ?? startPokemon;

  // Build a single query that includes all variants for the pokemon range
  const pokemonRange = Array.from(
    { length: totalPokemons - startPokemon + 1 },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_: unknown, i: number) => startPokemon + i
  ).join(" OR nationalPokedexNumbers:");

  // Combine subtypes into a single OR condition
  const subtypesQuery = subtypes
    .map((subtype) => `subtypes:${subtype}`)
    .join(" OR ");

  // Combine regions into a single OR condition
  const regionsQuery = regions.map((region) => `name:${region}`).join(" OR ");

  // Create the main query that combines everything - removed generalFilter from base query
  const mainQuery = `nationalPokedexNumbers:${pokemonRange}`;
  const variantsQuery = `(nationalPokedexNumbers:${pokemonRange}) ${generalFilter} (${subtypesQuery} OR ${regionsQuery})`;

  const queries = [
    {
      q: mainQuery,
      pageSize: (totalPokemons - startPokemon + 1) * 10,
      orderBy:
        "-tcgplayer.prices.holofoil.market,-tcgplayer.prices.normal.market",
    },
    {
      q: variantsQuery,
      pageSize: (totalPokemons - startPokemon + 1) * 10,
      orderBy:
        "-tcgplayer.prices.holofoil.market,-tcgplayer.prices.normal.market",
    },
  ];

  const cardCollection: PokemonTCG.Card[] = [];
  const processedPokemon = new Map<number, Map<string, PokemonTCG.Card[]>>();

  for (const params of queries) {
    try {
      const response = await retryWithBackoff(() =>
        PokemonTCG.findCardsByQueries(params)
      );

      for (const card of response) {
        const pokedexNumber = card.nationalPokedexNumbers?.[0];
        if (!pokedexNumber) continue;

        // Skip cards that don't match our filters for the base query
        if (
          params.q === mainQuery &&
          !card.name.includes("-") &&
          card.subtypes?.some(
            (subtype) =>
              subtypes.some((s) => s.split(" ")[0] === subtype) ||
              regions.some((r) =>
                card.name.toLowerCase().includes(r.replace("*", ""))
              )
          )
        ) {
          continue;
        }

        // Determine the card type (base, variant, or region)
        let cardType = "base";
        const isMega =
          card.subtypes?.some((subtype) => subtype === "MEGA") ?? false;

        if (
          subtypes.some((subtype) => {
            const subtypeValue = subtype.split(" ")[0];
            return card.subtypes?.some(
              (cardSubtype) =>
                cardSubtype === subtypeValue ||
                (subtype.includes("EX") && cardSubtype === "EX")
            );
          })
        ) {
          cardType = isMega ? "mega" : "variant";
        } else if (
          regions.some((region) =>
            card.name.toLowerCase().includes(region.replace("*", ""))
          )
        ) {
          cardType = "region";
        }

        // Initialize maps if needed
        if (!processedPokemon.has(pokedexNumber)) {
          processedPokemon.set(pokedexNumber, new Map());
        }
        const pokemonTypes = processedPokemon.get(pokedexNumber)!;
        if (!pokemonTypes.has(cardType)) {
          pokemonTypes.set(cardType, []);
        }

        const typeCards = pokemonTypes.get(cardType)!;

        // Add card to its type array
        typeCards.push(card);

        // Sort by price and keep only top 2 for non-MEGA cards
        typeCards.sort((a, b) => {
          const aPrice = Math.max(
            a.tcgplayer?.prices?.holofoil?.market ?? 0,
            a.tcgplayer?.prices?.normal?.market ?? 0
          );
          const bPrice = Math.max(
            b.tcgplayer?.prices?.holofoil?.market ?? 0,
            b.tcgplayer?.prices?.normal?.market ?? 0
          );
          return bPrice - aPrice;
        });

        // Only limit non-MEGA cards to 2
        if (cardType !== "mega" && typeCards.length > 2) {
          typeCards.length = 2;
        }
      }
    } catch (error: unknown) {
      if ((error as ApiError).response?.status === 404) {
        console.error(
          "Error fetching cards, skipping:",
          params.q,
          (error as ApiError).response?.status
        );
        continue;
      }
      console.error(
        "Error fetching cards:",
        params.q,
        (error as ApiError).response?.status ?? error
      );
    }
  }

  // Flatten the processed cards into the final collection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Array.from(processedPokemon.entries()).forEach(([_, typeMap]) => {
    Array.from(typeMap.values()).forEach((cards) => {
      cardCollection.push(...cards);
    });
  });

  // Sort by national pokedex number to maintain order
  return cardCollection.sort((a, b) => {
    const aNum = a.nationalPokedexNumbers?.[0] ?? 0;
    const bNum = b.nationalPokedexNumbers?.[0] ?? 0;
    return aNum - bNum;
  });
}
