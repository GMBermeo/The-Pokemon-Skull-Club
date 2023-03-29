import Head from "next/head";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import Masonry from "@mui/lab/Masonry";

import { styled } from "@mui/material/styles";
import { Stack, Typography, Paper } from "@mui/material";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  border: "1px solid black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

type ArtistCollectionPageProps = {
  artistCollection: PokemonTCG.Card[];
};

const ArtistCollectionPage: NextPage<ArtistCollectionPageProps> = ({
  artistCollection,
}) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Bones Collection</title>
        <meta
          name="description"
          content="'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter."
        />
        {/* 
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
        <meta property="og:image:height" content="3000" /> */}
        <meta property="og:url" content="https://pokemon-tcg.bermeo.dev/" />
        <meta property="og:locale" content="en_US" />
      </Head>
      <div>
        {/* {cubones.map((card: Card) => (
        <div key={card.id}> {card.name}</div>
      ))}{" "} */}
        Total: {artistCollection?.length} cards |{" "}
        {Math.ceil(artistCollection?.length / 9)} pages
        {/* {artistCollection.id} */}
        <Masonry
          columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          // spacing={{ xs: 1, md: 2, xl: 3 }}
        >
          {artistCollection?.map((card, index) => (
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

export default ArtistCollectionPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { artist } = params!;
  const artistCollection: PokemonTCG.Card[] =
    await PokemonTCG.findCardsByQueries({
      q: `artist:*${artist}* nationalPokedexNumbers:[1 TO 151] -subtypes:V-UNION supertype:POKEMON`,
      orderBy: " -set.releaseDate, -hp, nationalPokedexNumbers, -number",
    });

  // const artistCollection = await loadCards(104, 105);
  // const artistCollection = await fetch(
  //   "https://api.pokemontcg.io/v2/cards?q=nationalPokedexNumbers:[104 TO 105]"
  // ).then((res) => res.json());

  //   console.log(artistCollection);

  return {
    props: { artistCollection },
  };
};

interface Params extends ParsedUrlQuery {
  artist: string;
}

export interface PathParams {
  params: { artist: string };
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths: PathParams[] = [
    { params: { artist: "hasuno" } },
    { params: { artist: "kawayoo" } },
    { params: { artist: "arita" } },
    { params: { artist: "morii" } },
    { params: { artist: "komiya" } },
    { params: { artist: "tokiya" } },
    { params: { artist: "sowsow" } },
    { params: { artist: "naoki" } },
    { params: { artist: "kagemaru" } },
    { params: { artist: "kusube" } },
    { params: { artist: "ariga" } },
    { params: { artist: "asako" } },
    { params: { artist: "nishida" } },
    { params: { artist: "kudo" } },
    { params: { artist: "adachi" } },
    { params: { artist: "egawa" } },
  ];
  // const postList: PostData[] = await GetPosts()
  return {
    paths: paths,
    fallback: "blocking",
  };
};
