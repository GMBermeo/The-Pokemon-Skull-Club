import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export function sleep(): Promise<void> {
  //   if (!process.env.IS_BUILD) {
  return Promise.resolve();
  //   }
  const ms = Math.floor(1123.5 * (Math.random() + 2));
  console.log(`😴Building: ${ms}ms💤`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadCards(
  totalPokemons: number
): Promise<PokemonTCG.Card[]> {
  // const totalPokemons: number = 7;
  const generalFilter: string =
    "(-rarity:holo AND -rarity:promo AND -rarity:rare) -set.id:ru1";
  const rarityFilter: string =
    "(-rarity:holo AND -rarity:promo AND -rarity:rare)";

  const subtypes = ["EX", "V", "GX", "MEGA", "VMAX"];
  const names = ["alola", "dark", "galar", "hisui", "paldea"];

  const paramsArray: PokemonTCG.Parameter[] = [];

  // Add the parameters for the first query
  for (let i = 1; i <= totalPokemons; i++) {
    const params: PokemonTCG.Parameter = {
      q: `nationalPokedexNumbers:${i}`,
      pageSize: 1,
      orderBy: "-tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
    };
    paramsArray.push(params);
  }

  // Add the parameters for the remaining queries
  for (let subtype of subtypes) {
    for (let i = 1; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} subtypes:${subtype}`,
        pageSize: 1,
        orderBy:
          "-tcgplayer.prices.normal.high, -tcgplayer.prices.holofoil.high",
      };
      paramsArray.push(params);
      await sleep();
    }
  }

  for (let name of names) {
    for (let i = 1; i <= totalPokemons; i++) {
      const params: PokemonTCG.Parameter = {
        q: `nationalPokedexNumbers:${i} ${generalFilter} name:${name}`,
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
      // Add a type assertion to ensure that nationalPokedexNumbers is always defined
      const nationalPokedexNumbers = card.nationalPokedexNumbers as number[];
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
