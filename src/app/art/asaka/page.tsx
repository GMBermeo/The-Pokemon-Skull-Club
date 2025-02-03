"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Asako Ito's Crocheted Pokémon Art",
  description:
    "Explore Asako Ito's enchanting Pokémon card artwork collection featuring unique amigurumi (3D crochet) illustrations. Known for transforming Pokémon into adorable crocheted creatures, Ito brings a distinctive and charming style to the Pokémon Trading Card Game with her handcrafted designs.",
  keywords: [
    "pokemon",
    "tcg",
    "asako ito",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
    "crochet",
    "amigurumi",
    "handcrafted",
    "cute pokemon",
  ],
  openGraph: {
    title: "Asako Ito's Crocheted Pokémon Card Art",
    description:
      "Discover the magical world of Asako Ito's crocheted Pokémon card illustrations. Each card features a uniquely crafted amigurumi design, bringing Pokémon to life through the art of 3D crochet. Experience these charming and innovative card illustrations that have captured the hearts of collectors worldwide.",
    url: "https://pokemon.bermeo.dev/art/asaka",
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
        q: 'artist:"Asako Ito" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Asako Ito Page:", error);
    return [];
  }
}

export default async function AsakoItoPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Asako Ito"}
        subtitle={"Pokémon Card Artist - Amigurumi Specialist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
