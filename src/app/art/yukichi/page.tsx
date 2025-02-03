"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Shimaris Yukichi's Art",
  description:
    "Browse Shimaris Yukichi's adorable Pokémon card artwork collection. Experience their unique style that emphasizes the cute and round aspects of Pokémon, set against simple yet effective backgrounds that highlight their charming expressions. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "shimaris yukichi",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Shimaris Yukichi's Pokémon Card Art",
    description:
      "Browse Shimaris Yukichi's adorable Pokémon card artwork collection. Experience their unique style that emphasizes the cute and round aspects of Pokémon, set against simple yet effective backgrounds that highlight their charming expressions. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/shimaris-yukichi",
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
        q: 'artist:"Shimaris Yukichi" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      "Error fetching Pokemon cards at Shimaris Yukichi Page:",
      error
    );
    return [];
  }
}

export default async function ShimarisYukichiPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Shimaris Yukichi"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
