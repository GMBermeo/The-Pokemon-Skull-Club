import { JSX } from "react";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

type CardGridProps = {
  cardCollection: PokemonTCG.Card[];
};

export function CardGrid({
  cardCollection,
}: Readonly<CardGridProps>): JSX.Element {
  // Server-side calculations
  const totalCards: number = cardCollection.length;
  // const totalPages = Math.ceil(totalCards / 4);

  // Format price function
  const formatPrice = (price?: number | null): string | null => {
    return price ? `$${price.toFixed(2)}` : null;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cardCollection.map((card, index) => {
        const indexCarta: number = totalCards - index;
        // Server-side price formatting
        const normalHigh: string | null = formatPrice(
          card.tcgplayer?.prices?.normal?.high
        );
        const normalMarket: string | null = formatPrice(
          card.tcgplayer?.prices?.normal?.market
        );
        const foilHigh: string | null = formatPrice(
          card.tcgplayer?.prices?.holofoil?.high
        );
        const foilMarket: string | null = formatPrice(
          card.tcgplayer?.prices?.holofoil?.market
        );

        // Build price display string
        const priceDisplay = [
          normalHigh && `h: ${normalHigh}`,
          normalMarket && `m: ${normalMarket}`,
          foilHigh && `foil.h: ${foilHigh}`,
          foilMarket && `foil.m: ${foilMarket}`,
        ]
          .filter(Boolean)
          .join(" | ");

        return (
          <div key={card.id} className="flex flex-col gap-2">
            <div className="text-white text-sm font-normal flex justify-between">
              <p>
                #{card?.nationalPokedexNumbers![0]} ({card.number}/
                {card.set.printedTotal})
              </p>
              <p>
                [{indexCarta}/{totalCards}]
              </p>
            </div>

            {priceDisplay && (
              <p className="text-white text-xs">{priceDisplay}</p>
            )}

            <a
              href={`/card/${card.id}`}
              target="_blank"
              rel="noopener noreferrer"
              // Removed hover effect since it's now server-side
              className="transition-opacity mt-auto"
            >
              <img
                src={card.images.small}
                alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                loading="lazy"
                className="rounded-lg w-full"
              />
            </a>
          </div>
        );
      })}
    </div>
  );
}
