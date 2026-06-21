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

// Refresh weekly (ISR); numbers without cards fall through to notFound().
export const revalidate = 604800;

interface Params {
  nationalPokedexNumber: string;
}

async function getData(pokedexNumber: string): Promise<PokemonTCG.ICard[]> {
  const response = await getCardsByQuery(
    `nationalPokedexNumbers:${pokedexNumber} -set.id:mcd* -subtypes:V-UNION`,
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
  const artist: string = cards[0]?.artist ?? "";
  const rarity: string = cards[0]?.rarity ?? "";
  const setName: string = cards[0]?.set.name ?? "";
  const abilities: string =
    cards[0]?.abilities?.map((ability) => ability.name).join(", ") ?? "";
  const attacks: string =
    cards[0]?.attacks
      ?.map((attack) => `${attack.name} (${attack.damage} damage)`)
      .join(", ") ?? "";
  const weaknesses: string =
    cards[0]?.weaknesses
      ?.map((weakness) => `weak to ${weakness.type}`)
      .join(", ") ?? "";
  const resistances: string =
    cards[0]?.resistances
      ?.map((resistance) => `resistant to ${resistance.type}`)
      .join(", ") ?? "";
  const evolvesFrom: string = cards[0].evolvesFrom
    ? `evolves from ${cards[0].evolvesFrom}`
    : "";
  const evolvesTo: string = cards[0].evolvesTo?.[0]
    ? `evolves to ${cards[0].evolvesTo[0]}`
    : "";
  const hp: string = cards[0].hp ? `HP ${cards[0].hp}` : "";
  const set: string = cards[0].set.name ? `set ${cards[0].set.name}` : "";
  const subtypes: string = cards[0].subtypes?.join(", ") ?? "";
  const types: string = cards[0].types?.join(", ") ?? "";

  return {
    ...baseMetadata,
    alternates: {
      canonical: `/pokedex/${resolvedParams.nationalPokedexNumber}`,
    },
    title: `#${resolvedParams.nationalPokedexNumber} ${pokemonName} - Pokémon Cards`,
    description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) Pokémon trading cards. ${flavorText}`,
    keywords: [
      pokemonName,
      `#${resolvedParams.nationalPokedexNumber}`,
      flavorText,
      artist,
      rarity,
      setName,
      abilities,
      attacks,
      weaknesses,
      resistances,
      evolvesFrom,
      evolvesTo,
      hp,
      set,
      subtypes,
      types,
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
      description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) Pokémon trading cards. ${flavorText}`,
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
  // Prerender every Pokédex number that actually has cards. Others render
  // on demand and notFound() if empty, so thin pages never get indexed.
  const index = await getSiteCardIndex();
  return cardBearingPokedexNumbers(index).map((number) => ({
    nationalPokedexNumber: number.toString(),
  }));
}

export default async function PokemonPage({
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
        subtitle={`#${resolvedParams.nationalPokedexNumber}`}
        totalCards={cards.length}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
