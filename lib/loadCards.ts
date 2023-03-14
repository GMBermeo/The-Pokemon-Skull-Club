import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export function sleep(): Promise<void> {
  if (!process.env.IS_BUILD) {
    return Promise.resolve();
  }
  const ms = Math.floor(123.5 * (Math.random() + 2));
  console.log(`😴Building: ${ms}ms💤`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadCards(
  startPokemon: number,
  totalPokemons: number
): Promise<PokemonTCG.Card[]> {
  // const totalPokemons: number = 7;
  const generalFilter: string =
    "(-rarity:holo AND -rarity:promo AND -rarity:rare) -set.id:ru1";
  const rarityFilter: string =
    "(-rarity:holo AND -rarity:promo AND -rarity:rare)";

  const subtypes = ["EX", "V", "GX", "MEGA", "VMAX"];
  const regions = ["alola*", "dark*", "galar*", "hisui*", "paldea*"];

  const paramsArray: PokemonTCG.Parameter[] = [];

  // Add the parameters for the first query
  for (let i = startPokemon; i <= totalPokemons; i++) {
    const params: PokemonTCG.Parameter = {
      q: `nationalPokedexNumbers:${i}`,
      pageSize: 1,
      orderBy: "-tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
    };
    paramsArray.push(params);
  }

  // Add the parameters for the remaining queries
  for (let subtype of subtypes) {
    for (let i = startPokemon; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} subtypes:${subtype}`,
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
        q: `nationalPokedexNumbers:${i} name:${region}`,
        pageSize: 1,
        orderBy: "tcgplayer.prices.high",
      };
      paramsArray.push(params);
    }
  }

  const cardCollection = [];

  // Make the requests with the array of parameters
  for (let params of paramsArray) {
    const response = await PokemonTCG.findCardsByQueries(params);
    const card = response[0];
    if (card) {
      cardCollection.push(card);
      await sleep();
    }
  }

  // Sort the cardCollection array by nationalPokedexNumbers[0]
  cardCollection.sort(
    (a, b) => a.nationalPokedexNumbers![0] - b.nationalPokedexNumbers![0]
  );

  return cardCollection;
}
