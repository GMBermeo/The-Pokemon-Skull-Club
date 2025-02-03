"use server";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardDetails } from "@components";
import { baseMetadata, fetchPokemonCollection, retryWithBackoff } from "@lib";

interface Params {
  cardId: string;
}

async function getData(cardId: string): Promise<PokemonTCG.Card | undefined> {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardByID(cardId)
    );

    return response;
  } catch (error) {
    console.error(`Error fetching Pokemon cards at ${cardId} Page:`, error);
  }
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<Params>;
}>): Promise<Metadata> {
  const resolvedParams: Params = await params;
  const fetchedCard: PokemonTCG.Card | undefined = await getData(
    resolvedParams.cardId
  );

  if (!fetchedCard) {
    return baseMetadata;
  }

  const transformedArrayStrings: string[] = [
    ...(fetchedCard.types ?? []),
    fetchedCard.hp,
    ...(fetchedCard.retreatCost ?? []),
    ...(fetchedCard.attacks?.map((attack) => attack.name) ?? []),
    ...(fetchedCard.weaknesses?.map((weakness) => weakness.type) ?? []),
    ...(fetchedCard.resistances?.map((resistance) => resistance.type) ?? []),
    fetchedCard.evolvesFrom,
    ...(fetchedCard.evolvesTo ?? []),
    ...(fetchedCard.abilities?.map((ability) => ability.name) ?? []),
    fetchedCard.artist,
  ].filter((item): item is string => !!item);

  const metadataObj: Metadata = {
    ...baseMetadata,
    title: fetchedCard.name,
    description: fetchedCard.supertype,
    openGraph: {
      title: fetchedCard.name,
      description: `${fetchedCard?.flavorText}. ${fetchedCard.id} - ${fetchedCard.set.name}: ${fetchedCard.set.series}. ${fetchedCard.set.releaseDate}. Art: ${fetchedCard.artist}`,
      url: `https://pokemon.bermeo.dev/card/${fetchedCard.id}`,
      section: fetchedCard.name,
      images: [
        {
          url: fetchedCard.images.large,
          width: 734,
          height: 1024,
          type: "image/png",
        },
      ],
      locale: "en_US",
    },
    keywords: [
      fetchedCard.name,
      fetchedCard.supertype,
      fetchedCard.rarity,
      fetchedCard.set.name,
      fetchedCard.set.series,
      fetchedCard.set.id,
      fetchedCard.id,
      fetchedCard.rarity,
      fetchedCard.set.name,
      fetchedCard.set.series,
      fetchedCard.set.id,
      "pokemon",
      "tcg",
      "pokemon tcg",
      ...transformedArrayStrings,
    ],
  };

  return metadataObj;
}

export async function generateStaticParams() {
  try {
    const artistQueries = [
      'artist:"Akira Egawa"',
      'artist:"Yuka Morii"',
      'artist:"Mitsuhiro Arita"',
      'artist:"Asako Ito"',
      'artist:"Mékayu"',
      'artist:"mingo"',
      'artist:"osare"',
      'artist:"Rond"',
      'artist:"Saboteri"',
      'artist:"Uninori"',
      'artist:"Shimaris Yukichi"',
      'artist:"Yukihiro Tada"',
      'artist:"Yuriko Akase"',
    ];

    const pokemonQueries = [
      "nationalPokedexNumbers:[1 TO 25]",
      "nationalPokedexNumbers:[26 TO 50]",
      "nationalPokedexNumbers:[51 TO 100]",
      "nationalPokedexNumbers:[101 TO 125]",
      "nationalPokedexNumbers:[126 TO 151]",
      "nationalPokedexNumbers:[447 TO 448]",
      "nationalPokedexNumbers:185",
      "nationalPokedexNumbers:[158 TO 160]",
    ];

    const subtypeQueries = [
      "subtypes:EX",
      "subtypes:MEGA",
      "subtypes:BREAK",
      "subtypes:VMAX",
      "subtypes:Baby",
    ];

    const staticCards = await Promise.allSettled([
      ...artistQueries.map((artistQuery) =>
        retryWithBackoff(() =>
          PokemonTCG.findCardsByQueries({
            q: `${artistQuery} -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION`,
          })
        )
      ),
      ...pokemonQueries.map((pokedexQuery) =>
        retryWithBackoff(() =>
          PokemonTCG.findCardsByQueries({
            q: `${pokedexQuery} -set.id:mcd* -subtypes:V-UNION`,
          })
        )
      ),
      ...subtypeQueries.map((subtypeQuery) =>
        retryWithBackoff(() =>
          PokemonTCG.findCardsByQueries({
            q: `${subtypeQuery} -set.id:mcd* -subtypes:V-UNION`,
          })
        )
      ),
      fetchPokemonCollection(),
    ]);

    // Filter for successful promises and flatten their values
    const filteredStaticCards = staticCards
      .filter(
        (result): result is PromiseFulfilledResult<PokemonTCG.Card[]> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value)
      .flat()
      .filter(
        (card: PokemonTCG.Card, index: number, self: PokemonTCG.Card[]) =>
          index === self.findIndex((t) => t.id === card.id)
      );

    return filteredStaticCards.map((card) => ({
      cardId: card.id,
    }));
  } catch (error) {
    console.error("Error fetching static Pokemon cards:", error);
    return [];
  }
}

export default async function CardPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  const resolvedParams = await params;
  const card: PokemonTCG.Card | undefined = await getData(
    resolvedParams.cardId
  );

  return (
    <Body>
      <div className="max-w-screen-lg">
        <Suspense>
          {!card ? (
            <div>Card not found.</div>
          ) : (
            <>
              <div className="font-bold space-y-2 mb-4 justify-between flex xs:flex-col md:flex-row w-full">
                <Link href="/">
                  <h1 className="text-4xl">{card.name}</h1>{" "}
                </Link>
                <h2 className="text-lg">{card.id}</h2>
              </div>
              <h3 className="text-md mb-4">
                {card.flavorText ?? card.abilities?.[0].name}
              </h3>
              <CardDetails card={card} />
            </>
          )}
        </Suspense>
      </div>
    </Body>
  );
}
