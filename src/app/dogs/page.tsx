import type { JSX } from "react";
import type { Metadata } from "next";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { buildMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

export const metadata: Metadata = buildMetadata({
  path: "/dogs",
  title: "Pokémon Dogs Collection",
  description:
    "A comprehensive collection of all dog-like Pokémon cards from the Pokémon Trading Card Game. From Growlithe to Mabosstiff, discover all the canine companions throughout the generations.",
  keywords: [
    "pokemon",
    "tcg",
    "dogs",
    "growlithe",
    "arcanine",
    "houndour",
    "houndoom",
    "pokemon dogs",
    "zacian",
    "zamazenta",
  ],
});

const DOG_POKEMON_NUMBERS = [
  58, 59, 209, 210, 228, 229, 235, 261, 262, 309, 310, 447, 448, 506, 507, 508,
  676, 744, 745, 835, 836, 888, 889, 926, 927, 942, 943, 971, 972, 1014,
];

async function getData(): Promise<PokemonTCG.ICard[]> {
  try {
    const results = await Promise.all(
      DOG_POKEMON_NUMBERS.map((pokedexNumber) =>
        retryWithBackoff(() =>
          PokemonTCG.findCardsByQueries({
            q: `nationalPokedexNumbers:${pokedexNumber} -set.id:mcd* -subtypes:V-UNION`,
            orderBy: "-set.releaseDate",
          })
        )
      )
    );
    return sortCardsByDateAndPokedex(results.flat());
  } catch (error) {
    console.error("Error fetching Pokemon cards at Dogs Page:", error);
    return [];
  }
}

export default async function DogsPage(): Promise<JSX.Element> {
  const cards = await getData();

  return (
    <Body className="bg-amber-50 dark:bg-amber-950 text-amber-950">
      <Header
        title="Pokémon Dogs"
        subtitle="All Dog-like Pokémon Cards"
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
