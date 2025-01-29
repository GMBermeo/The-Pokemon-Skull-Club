"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardDetails } from "@components";
import { baseMetadata, fetchPokemonCollection, retryWithBackoff } from "@lib";
import { Suspense } from "react";
import Link from "next/link";

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
  params: Promise<{ cardId: string }>;
}>): Promise<Metadata> {
  const resolvedParams = await params;
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
      description: fetchedCard?.flavorText ?? fetchedCard.id,
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
    const uniqueCardsMap: Map<string, PokemonTCG.Card> = new Map();

    const marowaks = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:[104 TO 105] -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const charizards = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:6 -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const pikachus = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:25 -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const lucarios = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:[447 TO 448] -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const sudowoodos = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:185 -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const totodiles = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:[158 TO 160] -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const psyduck = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:54 -set.id:mcd* -subtypes:V-UNION",
      })
    );
    const mewtwo = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:150 -set.id:mcd* -subtypes:V-UNION",
      })
    );

    const yukaMorii = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: 'artist:"Yuka Morii" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );
    const arita = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: 'artist:"Mitsuhiro Arita" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    const akira = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: 'artist:"Akira Egawa" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    const originalCollection: PokemonTCG.Card[] =
      await fetchPokemonCollection();
    [
      ...marowaks,
      ...charizards,
      ...pikachus,
      ...lucarios,
      ...mewtwo,
      ...psyduck,
      ...sudowoodos,
      ...totodiles,
      ...originalCollection,
      ...arita,
      ...akira,
      ...yukaMorii,
    ].forEach((card) => {
      uniqueCardsMap.set(card.id, card);
    });

    const arrayUniqueCards = Array.from(uniqueCardsMap.values());

    return arrayUniqueCards.map((card) => ({
      cardId: card.id,
    }));
    // return cards.map((card) => ({
    //   cardId: card.id,
    // }));
  } catch (error) {
    console.error("Error fetching Pokemon cards at Bones Page:", error);
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
