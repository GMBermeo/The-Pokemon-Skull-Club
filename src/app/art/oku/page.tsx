"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Oku's Art",
  description:
    "Browse Oku's dynamic Pokémon card artwork collection. Experience their unique style that emphasizes dramatic light and shadow contrasts, creating intense battle scenes and atmospheric environments, as showcased in their debut with Scizor. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "oku",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Oku's Pokémon Card Art",
    description:
      "Browse Oku's dynamic Pokémon card artwork collection. Experience their unique style that emphasizes dramatic light and shadow contrasts, creating intense battle scenes and atmospheric environments, as showcased in their debut with Scizor. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/oku",
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
        q: 'artist:"Oku" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Oku Page:", error);
    return [];
  }
}

export default async function OkuPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Oku"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
