import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export function sortCardsByDateAndPokedex(
  cards: PokemonTCG.Card[]
): PokemonTCG.Card[] {
  return cards.sort((a: PokemonTCG.Card, b: PokemonTCG.Card) => {
    // First compare by release date (newest first)
    const dateComparison =
      new Date(b.set.releaseDate).getTime() -
      new Date(a.set.releaseDate).getTime();

    // If dates are equal, sort by Pokédex number
    if (dateComparison === 0) {
      return (
        (b.nationalPokedexNumbers?.[0] ?? 0) -
        (a.nationalPokedexNumbers?.[0] ?? 0)
      );
    }

    return dateComparison;
  });
}
