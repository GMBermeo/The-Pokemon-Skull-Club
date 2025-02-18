"use server";
import { Suspense } from "react";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

interface Params {
  nationalPokedexNumber: string;
}

async function getData(pokedexNumber: string): Promise<PokemonTCG.Card[]> {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: `nationalPokedexNumbers:${pokedexNumber} -set.id:mcd* -rarity:*rainbow* -rarity:*common* -subtypes:V-UNION `,
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      `Error fetching Pokemon cards for Pokedex #${pokedexNumber}:`,
      error
    );
    return [];
  }
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

  const pokemonName = cards[0].name.split(" ")[0]; // Get base name without modifiers

  return {
    ...baseMetadata,
    title: `#${resolvedParams.nationalPokedexNumber} ${pokemonName} - Pokémon Cards`,
    description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) Pokémon trading cards. View different variants, artworks, and special editions.`,
    keywords: [
      pokemonName,
      `#${resolvedParams.nationalPokedexNumber}`,
      "pokemon",
      "tcg",
      "pokemon tcg",
      ...cards
        .map((card) => card.artist)
        .filter((artist): artist is string => !!artist),
      ...cards.map((card) => card.rarity ?? ""),
      ...cards
        .map((card) => card.set.name)
        .filter((name): name is string => !!name),
    ],
    openGraph: {
      title: `#${resolvedParams.nationalPokedexNumber} ${pokemonName} - Pokémon Cards`,
      description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) Pokémon trading cards. View different variants, artworks, and special editions.`,
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

export async function generateStaticParams() {
  // Generate static params for the first 151 Pokemon plus some special ones
  const baseNumbers = Array.from({ length: 151 }, (_, i) => (i + 1).toString());
  const specialNumbers = ["447", "448", "185", "158", "159", "160"];

  return [...baseNumbers, ...specialNumbers].map((number) => ({
    nationalPokedexNumber: number,
  }));
}

export default async function PokemonPage({
  params,
}: Readonly<{
  params: Promise<{ nationalPokedexNumber: string }>;
}>) {
  const resolvedParams = await params;
  const cards = await getData(resolvedParams.nationalPokedexNumber);
  const pokemonName =
    cards[0]?.name.split(" ")[0] ||
    `Pokemon #${resolvedParams.nationalPokedexNumber}`;

  return (
    <Body>
      <Suspense>
        {cards.length === 0 ? (
          <div>No cards found for this Pokémon.</div>
        ) : (
          <>
            <Header
              title={pokemonName}
              subtitle={`#${resolvedParams.nationalPokedexNumber}`}
              totalCards={cards.length}
            />
            <CardGrid cardCollection={cards} />
          </>
        )}
      </Suspense>
    </Body>
  );
}
