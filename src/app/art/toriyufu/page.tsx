"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "toriyufu's Art",
  description:
    "Browse toriyufu's dynamic Pokémon card artwork collection. Experience their unique style that emphasizes movement through thematic action lines, as showcased in their debut illustrations of Entei and Aegislash ex. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "toriyufu",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "toriyufu's Pokémon Card Art",
    description:
      "Browse toriyufu's dynamic Pokémon card artwork collection. Experience their unique style that emphasizes movement through thematic action lines, as showcased in their debut illustrations of Entei and Aegislash ex. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/toriyufu",
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
        q: 'artist:"toriyufu" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at toriyufu Page:", error);
    return [];
  }
}

export default async function ToriyufuPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"toriyufu"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
