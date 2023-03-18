import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export async function loadCards(
  startPokemon: number,
  finalPokemon?: number
): Promise<PokemonTCG.Card[]> {
  const subtypes = ["EX hp:[200 TO *]", "V", "GX", "MEGA", "VMAX", "TAG"];
  const totalPokemons = finalPokemon ?? startPokemon;

  const regions = ["alola*", "galar*", "hisui*", "paldea*"];

  const generalFilter: string = `(-subtypes:${subtypes
    .map((subtype) => `${subtype}`)
    .join(" AND -subtypes:")})
    (-name:${regions.map((region) => `${region}`).join(" AND -name:")})`;

  const paramsArray: PokemonTCG.Parameter[] = [];

  // Add the parameters for the first query
  for (let i = startPokemon; i <= totalPokemons; i++) {
    const params: PokemonTCG.Parameter = {
      q: `nationalPokedexNumbers:${i} ${generalFilter} (-set.id:mcd* AND -set.id:ecard* AND -set.id:ru*)`,
      pageSize: 1,
      orderBy: "-tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
    };
    paramsArray.push(params);
  }

  // Add the parameters for the remaining queries
  for (let subtype of subtypes) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} subtypes:${subtype} -set.id:mcd*`,
        pageSize: 1,
        orderBy:
          "-tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
      };
      paramsArray.push(params);
    }
  }

  for (let region of regions) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} name:${region} -set.id:mcd*`,
        pageSize: 1,
        orderBy: "-tcgplayer.prices.high",
      };
      paramsArray.push(params);
    }
  }

  const cardCollection: PokemonTCG.Card[] = [];
  const cardIds = new Set<string>(); // Create a Set to track unique card IDs

  // Make the requests with the array of parameters
  for (let params of paramsArray) {
    const response = await PokemonTCG.findCardsByQueries(params);
    const card = response[0];
    if (card && !cardIds.has(card.id)) {
      // Check if the card ID is already in the Set
      cardCollection.push(card);
      cardIds.add(card.id); // Add the card ID to the Set
    }
  }

  // Sort the cardCollection array by nationalPokedexNumbers[0]
  cardCollection.sort(
    (a, b) =>
      a.nationalPokedexNumbers![0] - b.nationalPokedexNumbers![0] ||
      a.hp?.localeCompare(b.hp!) ||
      b.set.releaseDate.localeCompare(a.set.releaseDate)
  );

  return cardCollection;
}
