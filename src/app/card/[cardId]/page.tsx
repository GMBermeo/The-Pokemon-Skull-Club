import { JSX, Suspense, cache } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardDetails } from "@components";
import { baseMetadata, fetchPokemonCollection, retryWithBackoff } from "@lib";

interface Params {
  cardId: string;
}

// `cache` dedupes the fetch across `generateMetadata` and the page component,
// so each render (build-time or on-demand ISR) hits the API once, not twice.
const getData = cache(
  async (cardId: string): Promise<PokemonTCG.ICard | undefined> => {
    try {
      return await retryWithBackoff(() => PokemonTCG.findCardByID(cardId));
    } catch (error) {
      console.error(`Error fetching Pokemon cards at ${cardId} Page:`, error);
    }
  }
);

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<Params>;
}>): Promise<Metadata> {
  const resolvedParams: Params = await params;
  const fetchedCard: PokemonTCG.ICard | undefined = await getData(
    resolvedParams.cardId
  );

  if (!fetchedCard) {
    return { ...baseMetadata, robots: { index: false, follow: false } };
  }

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
  };

  return metadataObj;
}

export async function generateStaticParams(): Promise<
  {
    cardId: string;
  }[]
> {
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
        (result): result is PromiseFulfilledResult<PokemonTCG.ICard[]> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value)
      .flat()
      .filter(
        (card: PokemonTCG.ICard, index: number, self: PokemonTCG.ICard[]) =>
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
}>): Promise<JSX.Element> {
  const resolvedParams = await params;
  const card: PokemonTCG.ICard | undefined = await getData(
    resolvedParams.cardId
  );

  // Serve a real 404 (not a soft-404 with 200) so crawlers drop the URL
  // instead of indexing an empty shell and re-reading it forever.
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
    author: card.artist ? { "@type": "Person", name: card.artist } : undefined,
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
        <Suspense>
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
        </Suspense>
      </div>
    </Body>
  );
}
