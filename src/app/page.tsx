"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, fetchPokemonCollection } from "@lib";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata;
}

async function getData(): Promise<PokemonTCG.Card[]> {
  try {
    const response = await fetchPokemonCollection();

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Home:", error);
    return []; // Return empty array as fallback
  }
}

export default async function HomePage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"151 Original Pokémons and it's Variants"}
        subtitle={"A Private Collection"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
