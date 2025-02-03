import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

interface BotaoEbayProps {
  card: PokemonTCG.Card;
}

export const BotaoEbay = (props: Readonly<BotaoEbayProps>) => {
  return (
    <a
      target="_blank"
      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-md"
      href={`https://www.ebay.com/sch/i.html?_nkw=${props.card.name}+${props.card.id}&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339099221&customid=&toolid=10001&mkevt=1`}
    >
      Buy
    </a>
  );
};
