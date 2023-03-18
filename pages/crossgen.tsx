import Head from "next/head";
import type { NextPage } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import Masonry from "@mui/lab/Masonry";

import { styled } from "@mui/material/styles";
import { Stack, Typography, Paper } from "@mui/material";
import { loadCards } from "../lib/loadCards";

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
        <meta property="og:image:height" content="3000" />
        <meta property="og:url" content="https://lands-of-mtg.bermeo.dev/" />
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
  //   const teste = await loadCards(112, 114);
  const pichuCleffaIgglybuff = await loadCards(172, 174);
  const crobat = await loadCards(169);
  const bellossom = await loadCards(182);
  const annihilape = await loadCards(979);
  const politoed = await loadCards(186);
  const slowking = await loadCards(199);
  const magnezone = await loadCards(462);
  const steelix = await loadCards(208);
  const tyrogue = await loadCards(236);
  const hitmontop = await loadCards(237);
  const lickilicky = await loadCards(463);
  const rhyperior = await loadCards(464);
  const happiny = await loadCards(440);
  const blissey = await loadCards(242);
  const tangrowth = await loadCards(465);
  const kingdra = await loadCards(230);
  const mimeJr = await loadCards(439);
  const mrRime = await loadCards(866);
  const scizor = await loadCards(212);
  const kleavor = await loadCards(900);
  const smoochum = await loadCards(238);
  const elekid = await loadCards(239);
  const electivire = await loadCards(466);
  const magby = await loadCards(240);
  const magmortar = await loadCards(467);
  const espeonUmbreon = await loadCards(196, 197);
  const leafeonGlaceon = await loadCards(470, 471);
  const sylveon = await loadCards(700);
  const porygon2 = await loadCards(233);
  const porygonZ = await loadCards(474);
  const munchlax = await loadCards(446);

  const cardCollection: PokemonTCG.Card[] = [
    // ...teste,
    ...pichuCleffaIgglybuff,
    ...crobat,
    ...bellossom,
    ...annihilape,
    ...politoed,
    ...slowking,
    ...magnezone,
    ...steelix,
    ...tyrogue,
    ...hitmontop,
    ...lickilicky,
    ...rhyperior,
    ...happiny,
    ...blissey,
    ...tangrowth,
    ...kingdra,
    ...mimeJr,
    ...mrRime,
    ...scizor,
    ...kleavor,
    ...smoochum,
    ...elekid,
    ...electivire,
    ...magby,
    ...magmortar,
    ...espeonUmbreon,
    ...leafeonGlaceon,
    ...sylveon,
    ...porygon2,
    ...porygonZ,
    ...munchlax,
  ];

  return {
    props: { cardCollection },
  };
}
