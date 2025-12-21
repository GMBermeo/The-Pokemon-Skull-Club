import { use, type JSX } from "react";
import type { Metadata } from "next";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Uninori's Art",
  description:
    "Browse Uninori's dynamic Pokémon card artwork collection. Experience their unique manga and anime-inspired art style that brings a fresh perspective to the Pokémon TCG. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "uninori",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Uninori's Pokémon Card Art",
    description:
      "Browse Uninori's dynamic Pokémon card artwork collection. Experience their unique manga and anime-inspired art style that brings a fresh perspective to the Pokémon TCG. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/uninori",
    section: "Artist Gallery",
    locale: "en_US",
  },
};

export function generateMetadata(): Metadata {
  return metadata;
}

async function getData(): Promise<PokemonTCG.ICard[]> {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: 'artist:"Uninori" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Uninori Page:", error);
    return [];
  }
}

export default function UninoriPage(): JSX.Element {
  const cards = use(getData());

  return (
    <Body>
      <Header
        title={"Uninori"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
