import type { Metadata } from "next";
import Image from "next/image";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export const metadata: Metadata = {
  title: "Pokémon TCG",
  description:
    "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
  openGraph: {
    title: "Pokemon TCG",
    description:
      "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
    images: [
      {
        url: "https://lands-of-mtg.bermeo.dev/icons/favicon-3000x3000.png",
        width: 3000,
        height: 3000,
      },
    ],
  },
};

async function getCards() {
  const cardCollection: PokemonTCG.Card[] = await PokemonTCG.findCardsByQueries(
    {
      q: "nationalPokedexNumbers:25 supertype:pokemon (-set.id:mcd*)",
      orderBy: "-set.releaseDate, -hp, -number",
    }
  );
  return cardCollection;
}

export default async function PikachuPage() {
  const cardCollection = await getCards();

  return (
    <div className="p-4">
      <div className="text-white mb-4">
        Total: {cardCollection.length} cards |{" "}
        {Math.ceil(cardCollection.length / 9)} pages
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cardCollection.map((card, index) => (
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
              <Image
                src={card.images.small}
                alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                width={245}
                height={342}
                className="rounded-lg"
                priority={index < 4}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
