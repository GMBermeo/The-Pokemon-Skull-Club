"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Yukihiro Tada's Art",
  description:
    "Browse Yukihiro Tada's serene Pokémon card artwork collection. Experience their unique style that creates peaceful environmental illustrations where Pokémon exist in harmony with their surroundings, from countryside scenes to tropical beaches. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "yukihiro tada",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Yukihiro Tada's Pokémon Card Art",
    description:
      "Browse Yukihiro Tada's serene Pokémon card artwork collection. Experience their unique style that creates peaceful environmental illustrations where Pokémon exist in harmony with their surroundings, from countryside scenes to tropical beaches. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/yukihiro-tada",
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
        q: 'artist:"Yukihiro Tada" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Yukihiro Tada Page:", error);
    return [];
  }
}

export default async function YukihiroTadaPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Yukihiro Tada"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
