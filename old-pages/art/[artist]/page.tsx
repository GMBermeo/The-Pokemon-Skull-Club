"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { generalFilter } from "@lib";

/* export const metadata: Metadata = {
  title: "Bones Collection",
  description:
    "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
  openGraph: {
    url: "https://pokemon-tcg.bermeo.dev/",
    locale: "en_US",
  },
}; */

interface PageProps {
  params: {
    artist: string;
  };
}

async function getArtistCollection(artist: string) {
  const artistCollection: PokemonTCG.Card[] =
    await PokemonTCG.findCardsByQueries({
      q: `artist:*${artist}* nationalPokedexNumbers:[1 TO 151] supertype:POKEMON ${generalFilter}`,
      orderBy: " -set.releaseDate, -hp, nationalPokedexNumbers, -number",
    });
  return artistCollection;
}

export async function generateStaticParams() {
  return [
    { artist: "hasuno" },
    { artist: "kawayoo" },
    { artist: "arita" },
    { artist: "morii" },
    { artist: "komiya" },
    { artist: "tokiya" },
    { artist: "sowsow" },
    { artist: "naoki" },
    { artist: "kagemaru" },
    { artist: "kusube" },
    { artist: "ariga" },
    { artist: "asako" },
    { artist: "nishida" },
    { artist: "kudo" },
    { artist: "adachi" },
    { artist: "egawa" },
  ];
}

export default async function ArtistCollectionPage({
  params,
}: Readonly<{
  params: Promise<{ artist: string }>;
}>) {
  const artistCollection = await getArtistCollection((await params).artist);

  return (
    <div className="p-4">
      <div className="text-white mb-4">
        Total: {artistCollection?.length} cards |{" "}
        {Math.ceil(artistCollection?.length / 9)} pages
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {artistCollection?.map((card, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="text-white text-sm font-normal">
              #{card?.nationalPokedexNumbers![0]} (index: {index + 1}) page:
              {Math.ceil(index / 9)}
            </div>

            <div className="text-white text-xs">
              $ {card.tcgplayer?.prices.normal?.high} / ${" "}
              {card.tcgplayer?.prices.normal?.market} / ${" "}
              {card.tcgplayer?.prices.holofoil?.high} / ${" "}
              {card.tcgplayer?.prices.holofoil?.market}
            </div>

            <a
              href={card.images.large}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={card.images.small}
                alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                className="rounded-lg w-full"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
