"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
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
  openGraph: {
    title: "Pokémon Dogs Collection",
    description:
      "A comprehensive collection of all dog-like Pokémon cards from the Pokémon Trading Card Game. From Growlithe to Mabosstiff, discover all the canine companions throughout the generations.",
    url: "https://pokemon.bermeo.dev/dogs",
    section: "Dogs",
    locale: "en_US",
    // images: [
    //   {
    //     url: "https://pokemon.bermeo.dev/opengraph/dogs.jpg",
    //     width: 1400,
    //     height: 700,
    //     alt: "Pokémon Dogs Collection",
    //     type: "image/jpeg",
    //   },
    // ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData() {
  try {
    const dogPokemonNumbers = [
      58,
      59, // Growlithe, Arcanine
      209,
      210, // Snubbull, Granbull
      228,
      229, // Houndour, Houndoom
      235, // Smeargle
      261,
      262, // Poochyena, Mightyena
      309,
      310, // Electrike, Manectric
      447,
      448, // Riolu, Lucario
      506,
      507,
      508, // Lillipup, Herdier, Stoutland
      676, // Furfrou
      744,
      745, // Rockruff, Lycanroc
      835,
      836, // Yamper, Boltund
      888,
      889, // Zacian, Zamazenta
      926,
      927, // Fidough, Dachsbun
      942,
      943, // Maschiff, Mabosstiff
      971,
      972, // Greavard, Houndstone
      1014, // Okidogi
    ];

    const allCards: PokemonTCG.Card[] = [];

    // Fetch cards for each Pokémon number individually
    for (const pokedexNumber of dogPokemonNumbers) {
      const response = await retryWithBackoff(() =>
        PokemonTCG.findCardsByQueries({
          q: `nationalPokedexNumbers:${pokedexNumber} -set.id:mcd* -subtypes:V-UNION`,
          orderBy: "-set.releaseDate",
        })
      );
      allCards.push(...response);
    }

    return sortCardsByDateAndPokedex(allCards);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Dogs Page:", error);
    return [];
  }
}

export default async function DogsPage() {
  const cards = await getData();

  return (
    <Body className="bg-amber-50 dark:bg-amber-950 text-amber-950">
      <Header
        title={"Pokémon Dogs"}
        subtitle={"All Dog-like Pokémon Cards"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
