import {use, type JSX } from "react";
import type { Metadata } from "next";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, fetchPokemonCollection } from "@lib";

export function generateMetadata(): Metadata {
  return baseMetadata;
}

async function getData(): Promise<PokemonTCG.ICard[]> {
  try {
    const response = await fetchPokemonCollection();

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Home:", error);
    return []; // Return empty array as fallback
  }
}

export default function HomePage(): JSX.Element {
  const cards = use(getData());

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
