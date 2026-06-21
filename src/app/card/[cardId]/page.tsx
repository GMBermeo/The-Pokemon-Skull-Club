import { JSX } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardDetails } from "@components";
import { baseMetadata, getCardById, getSiteCardIndex } from "@lib";

// Refresh card data (prices, new printings) weekly while staying static.
export const revalidate = 604800;

interface Params {
  cardId: string;
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<Params>;
}>): Promise<Metadata> {
  const resolvedParams: Params = await params;
  const fetchedCard = await getCardById(resolvedParams.cardId);

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
    alternates: { canonical: `/card/${fetchedCard.id}` },
    title: `${fetchedCard.name} (${fetchedCard.set.name})`,
    description:
      fetchedCard.flavorText ??
      `${fetchedCard.name} - ${fetchedCard.supertype} from ${fetchedCard.set.name} (${fetchedCard.set.series}), ${fetchedCard.set.releaseDate}. Illustrated by ${fetchedCard.artist}.`,
    openGraph: {
      type: "article",
      title: `${fetchedCard.name} (${fetchedCard.set.name})`,
      description: `${fetchedCard?.flavorText ?? ""} ${fetchedCard.id} - ${fetchedCard.set.name}: ${fetchedCard.set.series}. ${fetchedCard.set.releaseDate}. Art: ${fetchedCard.artist}`.trim(),
      url: `https://pokemon.bermeo.dev/card/${fetchedCard.id}`,
      section: fetchedCard.name,
      images: [
        {
          url: fetchedCard.images.large,
          width: 734,
          height: 1024,
          alt: `${fetchedCard.name} card illustrated by ${fetchedCard.artist}`,
          type: "image/png",
        },
      ],
      locale: "en_US",
    },
    keywords: [
      fetchedCard.name,
      fetchedCard.supertype,
      fetchedCard.rarity ?? "",
      fetchedCard.set.name,
      fetchedCard.set.series,
      fetchedCard.set.id,
      fetchedCard.id,
      "pokemon",
      "tcg",
      "pokemon tcg",
      ...transformedArrayStrings,
    ].filter(Boolean),
  };

  return metadataObj;
}

export async function generateStaticParams(): Promise<{ cardId: string }[]> {
  const cards = await getSiteCardIndex();
  return cards.map((card) => ({ cardId: card.id }));
}

export default async function CardPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>): Promise<JSX.Element> {
  const resolvedParams = await params;
  const card: PokemonTCG.ICard | undefined = await getCardById(
    resolvedParams.cardId
  );

  if (!card) {
    notFound();
  }

  const cardJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: card.name,
    identifier: card.id,
    url: `https://pokemon.bermeo.dev/card/${card.id}`,
    image: card.images.large,
    description: card.flavorText ?? `${card.name} - ${card.set.name}`,
    author: card.artist
      ? { "@type": "Person", name: card.artist }
      : undefined,
    isPartOf: { "@type": "CreativeWorkSeries", name: card.set.name },
    datePublished: card.set.releaseDate,
    about: { "@type": "Thing", name: card.supertype },
    offers: card.tcgplayer?.prices?.normal?.market
      ? {
          "@type": "Offer",
          priceCurrency: "USD",
          price: card.tcgplayer.prices.normal.market,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <Body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cardJsonLd) }}
      />
      <div className="max-w-screen-lg">
        <div className="font-bold space-y-2 mb-4 justify-between flex xs:flex-col md:flex-row w-full">
          <Link href="/">
            <h1 className="text-4xl">{card.name}</h1>{" "}
          </Link>
          <h2 className="text-lg">{card.id}</h2>
        </div>
        <h3 className="text-md mb-4">
          {card.flavorText ?? card.abilities?.[0]?.name}
        </h3>
        <CardDetails card={card} />
      </div>
    </Body>
  );
}
