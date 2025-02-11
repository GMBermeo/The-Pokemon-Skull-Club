"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Yoriyuki Ikegami's Art",
  description:
    "Browse Yoriyuki Ikegami's beautiful Pokémon card artwork collection. Experience their unique style that incorporates stunning floral settings and natural environments, as showcased in their debut with Gardenia's Vigor. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "yoriyuki ikegami",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Yoriyuki Ikegami's Pokémon Card Art",
    description:
      "Browse Yoriyuki Ikegami's beautiful Pokémon card artwork collection. Experience their unique style that incorporates stunning floral settings and natural environments, as showcased in their debut with Gardenia's Vigor. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/ikegami",
    section: "Artist Gallery",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData() {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: 'artist:"Yoriyuki Ikegami" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      "Error fetching Pokemon cards at Yoriyuki Ikegami Page:",
      error
    );
    return [];
  }
}

export default async function YoriyukiIkegamiPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Yoriyuki Ikegami"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
