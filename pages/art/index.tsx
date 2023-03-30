import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Container, List, ListItem, ListItemText } from "@mui/material";

type ArtistPageProps = {
  artists: string[];
};

const ArtistsPage: NextPage<ArtistPageProps> = ({ artists }) => {
  return (
    <>
      <Head>
        <title>Artists of Pokémon TCG</title>
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
      <Container maxWidth={"xs"}>
        <List>
          {artists.map((artist) => (
            <Link key={artist} href={`/art/${artist}`} passHref>
              <ListItem
                sx={{
                  border: 0.5,
                  borderColor: "#fff",
                  borderRadius: 1,
                  marginBottom: 1,
                }}
              >
                <ListItemText
                  primary={artist}
                  primaryTypographyProps={{
                    fontWeight: "light",
                    textTransform: "capitalize",
                    textAlign: "center",
                  }}
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Container>
    </>
  );
};

export default ArtistsPage;

export async function getStaticProps() {
  const artists: string[] = [
    "hasuno",
    "kawayoo",
    "arita",
    "morii",
    "komiya",
    "tokiya",
    "sowsow",
    "naoki",
    "kagemaru",
    "kusube",
    "ariga",
    "asako",
    "nishida",
    "kudo",
    "adachi",
    "egawa",
  ];

  return {
    props: { artists },
  };
}
