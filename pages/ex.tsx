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

type HomeProps = {
  cardCollection: PokemonTCG.Card[];
};

const Home: NextPage<HomeProps> = ({ cardCollection }) => {
  return (
    <>
      <Head>
        <title>Pokémon TCG</title>
        <meta
          name="description"
          content="'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter."
        />

        <meta property="og:title" content="Pokemon TCG" />
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
        <meta property="og:image:height" content="3000" />
        <meta property="og:url" content="https://pokemon-tcg.bermeo.dev/" />
        <meta property="og:locale" content="en_US" />
      </Head>
      <div>
        {/* {cubones.map((card: Card) => (
        <div key={card.id}> {card.name}</div>
      ))}{" "} */}
        Total: {cardCollection.length} cards |{" "}
        {Math.ceil(cardCollection.length / 9)} pages
        {/* {cardCollection.id} */}
        <Masonry
          columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          // spacing={{ xs: 1, md: 2, xl: 3 }}
        >
          {cardCollection.map((card, index) => (
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
                  loading="lazy"
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

export default Home;

export async function getStaticProps() {
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
