import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

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
  const regions = ["alola*", "galar*", "hisui*", "paldea*"];

  const totalPokemons = finalPokemon ?? startPokemon;

  // const conflictFilter: string = `(-subtypes:${subtypes
  //   .map((subtype) => `${subtype}`)
  //   .join(" AND -subtypes:")})
  //   (-name:${regions.map((region) => `${region}`).join(" AND -name:")})`;

  const generalFilter: string =
    "-set.id:ru* -set.id:mcd* -set.id:ecard* -rarity:*rainbow* -subtypes:BREAK";

  const paramsArray: PokemonTCG.Parameter[] = [];

  // Add the parameters for the first query
  for (let i = startPokemon; i <= totalPokemons; i++) {
    const params: PokemonTCG.Parameter = {
      q: `nationalPokedexNumbers:${i} ${generalFilter}`,
      pageSize: 1,
      orderBy:
        "rarity, -tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
    };
    paramsArray.push(params);
  }

  // Add the parameters for subtypes
  for (let subtype of subtypes) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} ${generalFilter} subtypes:${subtype}`,
        pageSize: 1,
        orderBy:
          "rarity, -tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
      };
      paramsArray.push(params);
    }
  }

  // Add the parameters for regions
  for (let region of regions) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} ${generalFilter} name:${region}`,
        pageSize: 1,
        orderBy: "rarity, -tcgplayer.prices.high",
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
      a.set.releaseDate.localeCompare(b.set.releaseDate)
  );

  console.log(`Params:${paramsArray.length}, Cards:${cardCollection.length}`);

  return cardCollection;
}
