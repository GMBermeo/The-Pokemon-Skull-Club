import { JSX } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import {
  baseMetadata,
  cardBearingPokedexNumbers,
  getCardsByQuery,
  getSiteCardIndex,
} from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

// Refresh weekly (ISR); numbers without rare cards fall through to notFound().
export const revalidate = 604800;

interface Params {
  nationalPokedexNumber: string;
}

async function getData(pokedexNumber: string): Promise<PokemonTCG.ICard[]> {
  const response = await getCardsByQuery(
    `nationalPokedexNumbers:${pokedexNumber} -set.id:mcd* -rarity:*common* -rarity:*rainbow* -subtypes:V-UNION`,
    "-set.releaseDate"
  );
  return sortCardsByDateAndPokedex(response);
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<Params>;
}>): Promise<Metadata> {
  const resolvedParams: Params = await params;
  const cards = await getData(resolvedParams.nationalPokedexNumber);

  if (cards.length === 0) {
    return baseMetadata;
  }

  const pokemonName: string = cards[0].name.split(" ")[0];
  const flavorText: string = cards[0]?.flavorText ?? "";

  return {
    ...baseMetadata,
    // Point at the full Pokédex page so the near-duplicate /rares view does
    // not compete with it in search; the full page is the canonical one.
    alternates: {
      canonical: `/pokedex/${resolvedParams.nationalPokedexNumber}`,
    },
    title: `#${resolvedParams.nationalPokedexNumber} ${pokemonName} - Rare Pokémon Cards`,
    description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) rare Pokémon trading cards. ${flavorText}`,
    openGraph: {
      title: `#${resolvedParams.nationalPokedexNumber} ${pokemonName} - Rare Pokémon Cards`,
      description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) rare Pokémon trading cards. ${flavorText}`,
      url: `https://pokemon.bermeo.dev/pokedex/${resolvedParams.nationalPokedexNumber}`,
      section: pokemonName,
      images: cards[0]
        ? [
            {
              url: cards[0].images.large,
              width: 734,
              height: 1024,
              type: "image/png",
            },
          ]
        : [],
      locale: "en_US",
    },
  };
}

export async function generateStaticParams(): Promise<
  {
    nationalPokedexNumber: string;
  }[]
> {
  const index = await getSiteCardIndex();
  return cardBearingPokedexNumbers(index).map((number) => ({
    nationalPokedexNumber: number.toString(),
  }));
}

export default async function RarePokemonPage({
  params,
}: Readonly<{
  params: Promise<Params>;
}>): Promise<JSX.Element> {
  const resolvedParams: Params = await params;
  const cards: PokemonTCG.ICard[] = await getData(
    resolvedParams.nationalPokedexNumber
  );

  if (cards.length === 0) {
    notFound();
  }

  const pokemonName: string = cards[0].name.split(" ")[0];

  return (
    <Body>
      <Header
        title={pokemonName}
        subtitle={`#${resolvedParams.nationalPokedexNumber} · Rares`}
        totalCards={cards.length}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
