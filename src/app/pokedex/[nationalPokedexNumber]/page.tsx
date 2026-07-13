import { JSX, Suspense, cache } from "react";
import { Metadata } from "next";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

interface Params {
  nationalPokedexNumber: string;
}

// `cache` dedupes the fetch across `generateMetadata` and the page component,
// so each render hits the API once instead of twice.
const getData = cache(
  async (pokedexNumber: string): Promise<PokemonTCG.ICard[]> => {
    try {
      const response = await retryWithBackoff(() =>
        PokemonTCG.findCardsByQueries({
          q: `nationalPokedexNumbers:${pokedexNumber} -set.id:mcd* -subtypes:V-UNION `,
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
);

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<Params>;
}>): Promise<Metadata> {
  const resolvedParams: Params = await params;
  const cards = await getData(resolvedParams.nationalPokedexNumber);

  // An empty result is a thin page: tell crawlers not to index it so it stops
  // burning ISR reads on re-crawls, while the route still resolves for users.
  if (cards.length === 0) {
    return { ...baseMetadata, robots: { index: false, follow: true } };
  }

  const pokemonName: string = cards[0].name.split(" ")[0];
  const flavorText: string = cards[0]?.flavorText ?? "";

  return {
    ...baseMetadata,
    alternates: {
      canonical: `/pokedex/${resolvedParams.nationalPokedexNumber}`,
    },
    title: `#${resolvedParams.nationalPokedexNumber} ${pokemonName} - Pokémon Cards`,
    description: `Explore all ${pokemonName} (#${resolvedParams.nationalPokedexNumber}) Pokémon trading cards. ${flavorText}`,
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
  // Generate static params for all 1025 pokemons
  const pokemonNumbers: string[] = Array.from({ length: 1025 }, (_, i) =>
    (i + 1).toString()
  );

  return pokemonNumbers.map((number) => ({
    nationalPokedexNumber: number,
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
  const pokemonName: string =
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
