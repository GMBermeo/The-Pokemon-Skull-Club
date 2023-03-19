import Head from "next/head";
import type { NextPage } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import Masonry from "@mui/lab/Masonry";

import { styled } from "@mui/material/styles";
import { Stack, Typography, Paper } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  border: "1px solid black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

type KawayooCollectionPageProps = {
  kawayooCollection: PokemonTCG.Card[];
};

const KawayooCollectionPage: NextPage<KawayooCollectionPageProps> = ({
  kawayooCollection,
}) => {
  return (
    <>
      <Head>
        <title>Bones Collection</title>
        <meta
          name="description"
          content="'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter."
        />
        {/* 
        <meta property="og:title" content="The Lands of Magic the Gathering" />
        <meta
          property="og:description"
          content="'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter."
        />
        <meta
          property="og:image"
          content={
            "https://lands-of-mtg.bermeo.dev/icons/favicon-3000x3000.png"
          }
        />
        <meta property="og:image:width" content="3000" />
        <meta property="og:image:height" content="3000" /> */}
        <meta property="og:url" content="https://pokemon-tcg.bermeo.dev/" />
        <meta property="og:locale" content="en_US" />
      </Head>
      <div>
        {/* {cubones.map((card: Card) => (
        <div key={card.id}> {card.name}</div>
      ))}{" "} */}
        Total: {kawayooCollection.length} cards |{" "}
        {Math.ceil(kawayooCollection.length / 9)} pages
        {/* {kawayooCollection.id} */}
        <Masonry
          columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          // spacing={{ xs: 1, md: 2, xl: 3 }}
        >
          {kawayooCollection.map((card, index) => (
            <Stack key={index}>
              <Typography color={"white"} fontSize={14} fontWeight={1}>
                #{card?.nationalPokedexNumbers![0]} (index: {index + 1}) page:
                {Math.ceil(index / 9)}
              </Typography>

              <Typography color={"white"} fontSize={10}>
                $ {card.tcgplayer?.prices.normal?.high} / ${" "}
                {card.tcgplayer?.prices.normal?.market} / ${" "}
                {card.tcgplayer?.prices.holofoil?.high} / ${" "}
                {card.tcgplayer?.prices.holofoil?.market}
              </Typography>
              <a
                href={card.images.large}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={card.images.small}
                  alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                  style={{
                    borderRadius: 8,
                  }}
                />
              </a>
            </Stack>
          ))}
        </Masonry>
        {/* {returnedCartasV2.map((carta: PokemonTCG.Card) => (
        <div key={carta.id}>
          {" "}
          {carta.id}
          <img src={carta.images.small}></img>
        </div>
      ))}{" "} */}
      </div>
    </>
  );
};

export default KawayooCollectionPage;

export async function getServerSideProps() {
  const kawayooCollection: PokemonTCG.Card[] =
    await PokemonTCG.findCardsByQueries({
      q: "artist:Kawayoo supertype:Pokémon",
      orderBy: "rarity, nationalPokedexNumbers, -hp, -set.releaseDate, -number",
    });

  // const kawayooCollection = await loadCards(104, 105);
  // const kawayooCollection = await fetch(
  //   "https://api.pokemontcg.io/v2/cards?q=nationalPokedexNumbers:[104 TO 105]"
  // ).then((res) => res.json());

  //   console.log(kawayooCollection);

  return {
    props: { kawayooCollection },
  };
}
