import type { JSX } from "react";
import Image from "next/image";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";

type CardGridProps = {
  cardCollection: PokemonTCG.ICard[];
};

const TCG_SMALL_WIDTH = 245;
const TCG_SMALL_HEIGHT = 342;
const SIZES =
  "(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw";

function formatPrice(price?: number | null): string | null {
  return price ? `$${price.toFixed(2)}` : null;
}

export function CardGrid({
  cardCollection,
}: Readonly<CardGridProps>): JSX.Element {
  const totalCards = cardCollection.length;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 list-none p-0 m-0">
      {cardCollection.map((card, index) => {
        const indexCarta = totalCards - index;
        const isLcpCandidate = index < 6;
        const normalHigh = formatPrice(card.tcgplayer?.prices?.normal?.high);
        const normalMarket = formatPrice(card.tcgplayer?.prices?.normal?.market);
        const foilHigh = formatPrice(card.tcgplayer?.prices?.holofoil?.high);
        const foilMarket = formatPrice(
          card.tcgplayer?.prices?.holofoil?.market
        );

        const priceDisplay = [
          normalHigh && `h: ${normalHigh}`,
          normalMarket && `m: ${normalMarket}`,
          foilHigh && `foil.h: ${foilHigh}`,
          foilMarket && `foil.m: ${foilMarket}`,
        ]
          .filter(Boolean)
          .join(" | ");

        const altText = `${card.name} card${
          card.set?.name ? ` from ${card.set.name}` : ""
        }${card.artist ? ` illustrated by ${card.artist}` : ""}${
          card.flavorText ? `. ${card.flavorText}` : ""
        }`;

        return (
          <li key={card.id} className="flex flex-col gap-2 max-w-full">
            <div className="text-white text-sm font-normal flex justify-between">
              <p>
                {card?.nationalPokedexNumbers?.[0] &&
                  `#${card.nationalPokedexNumbers[0]}`}{" "}
                ({card.number}/{card.set.printedTotal})
              </p>
              <p>
                ©{card.set.releaseDate.slice(0, 4)} [{indexCarta}/{totalCards}]
              </p>
            </div>

            {priceDisplay && (
              <p className="text-white text-xs">{priceDisplay}</p>
            )}

            <a
              href={`/card/${card.id}`}
              rel="noopener"
              aria-label={`View details for ${card.name}`}
              className="transition-opacity mt-auto"
            >
              <Image
                src={card.images.small}
                alt={altText}
                width={TCG_SMALL_WIDTH}
                height={TCG_SMALL_HEIGHT}
                sizes={SIZES}
                loading={isLcpCandidate ? "eager" : "lazy"}
                fetchPriority={isLcpCandidate ? "high" : "low"}
                priority={isLcpCandidate}
                unoptimized
                className="rounded-lg w-full h-auto"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
