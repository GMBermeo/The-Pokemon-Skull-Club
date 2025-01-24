import type { NextPage } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Metadata } from "next";

// Define metadata using Next.js 15 approach
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
        width: 3001,
        height: 3001,
      },
    ],
  },
};

type HomeProps = {
  cardCollection: PokemonTCG.Card[];
};

const Home: NextPage<HomeProps> = ({ cardCollection }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 text-white">
        Total: {cardCollection.length} cards |{" "}
        {Math.ceil(cardCollection.length / 9)} pages
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cardCollection.map((card, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className="text-white text-sm font-normal">
              #{card?.nationalPokedexNumbers![0]} (index: {index + 1}) page:
              {Math.ceil(index / 9)}
            </p>

            <p className="text-white text-xs">
              $ {card.tcgplayer?.prices.normal?.high} / ${" "}
              {card.tcgplayer?.prices.normal?.market} / ${" "}
              {card.tcgplayer?.prices.holofoil?.high} / ${" "}
              {card.tcgplayer?.prices.holofoil?.market}
            </p>

            <a
              href={card.images.large}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity"
            >
              <img
                src={card.images.small}
                alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                loading="lazy"
                className="rounded-lg w-full"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

// Convert to Next.js 15 data fetching
export async function generateStaticProps() {
  const crossgen: number[] = [
    172, 173, 174, 182, 979, 186, 199, 462, 208, 236, 237, 463, 464, 440, 242,
    465, 230, 439, 866, 212, 900, 238, 239, 466, 240, 467, 196, 197, 470, 471,
    700, 233, 474, 446,
  ];

  const crossgenQuery = crossgen
    .map((num) => `OR nationalPokedexNumbers:${num}`)
    .join(" ");

  const cardCollection: PokemonTCG.Card[] = await PokemonTCG.findCardsByQueries(
    {
      q: `(nationalPokedexNumbers:[1 TO 151] ${crossgenQuery}) subtypes:EX hp:[200 TO *]`,
      orderBy: "nationalPokedexNumbers, -hp, -set.releaseDate, -number",
    }
  );

  return {
    props: { cardCollection },
  };
}
