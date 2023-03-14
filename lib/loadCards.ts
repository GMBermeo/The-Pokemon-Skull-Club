import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export async function loadCards(
  startPokemon: number,
  totalPokemons: number
): Promise<PokemonTCG.Card[]> {
  // const totalPokemons: number = 7;
  const generalFilter: string =
    "(-subtypes:EX AND -subtypes:V AND -subtypes:GX AND -subtypes:MEGA AND -subtypes:VMAX AND -subtypes:Baby AND -subtypes:Restored) -set.id:ru1";

  const subtypes = [
    "EX",
    "V",
    "GX",
    "MEGA",
    "VMAX",
    "Rapid Strike",
    "Single Strike",
    "Baby",
    "Restored",
    "TAG TEAM",
  ];
  const regions = ["alola*", "dark*", "galar*", "hisui*", "paldea*"];

  const paramsArray: PokemonTCG.Parameter[] = [];

  // Add the parameters for the first query
  for (let i = startPokemon; i <= totalPokemons; i++) {
    const params: PokemonTCG.Parameter = {
      q: `nationalPokedexNumbers:${i} ${generalFilter}`,
      pageSize: 1,
      orderBy: "-tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
    };
    paramsArray.push(params);
  }

  // Add the parameters for the remaining queries
  for (let subtype of subtypes) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} ${generalFilter} subtypes:${subtype}`,
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
        q: `nationalPokedexNumbers:${i} ${generalFilter} name:${region}`,
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
      b.hp?.localeCompare(a.hp!) ||
      b.set.releaseDate.localeCompare(a.set.releaseDate)
  );

  return cardCollection;
}
