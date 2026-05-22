import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";

export function sortCardsByDateAndPokedex(
  cards: PokemonTCG.ICard[]
): PokemonTCG.ICard[] {
  return cards.sort((a: PokemonTCG.ICard, b: PokemonTCG.ICard) => {
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

export function sortCardsByDexNumber(
  cards: PokemonTCG.ICard[]
): PokemonTCG.ICard[] {
  return cards.sort((a: PokemonTCG.ICard, b: PokemonTCG.ICard) => {
    return (
      (a.nationalPokedexNumbers?.[0] ?? 0) -
      (b.nationalPokedexNumbers?.[0] ?? 0)
    );
  });
}
