"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Akira Egawa's Art",
  description:
    "Explore Akira Egawa's stunning Pokémon card illustrations. Discover their unique art style, memorable card designs, and complete artwork portfolio for the Pokémon Trading Card Game. Features high-quality images and detailed information about each card.",
  keywords: [
    "pokemon",
    "tcg",
    "akira egawa",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Akira Egawa's Pokémon Card Art",
    description:
      "Explore Akira Egawa's stunning Pokémon card illustrations. Discover their unique art style, memorable card designs, and complete artwork portfolio for the Pokémon Trading Card Game. Features high-quality images and detailed information about each card.",
    url: "https://pokemon.bermeo.dev/art/akira",
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
        q: 'artist:"Akira Egawa" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Akira Egawa Page:", error);
    return [];
  }
}

export default async function AkiraEgawaPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Akira Egawa"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
