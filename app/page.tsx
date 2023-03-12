import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";

import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { Label } from "@mui/icons-material";

// import { Card, Response } from "../types/response";

// async function getCards() {
//   let cubone = await fetch("https://api.pokemontcg.io/v2/cards?q=name:cubone");
//   let marowak = await fetch(
//     "https://api.pokemontcg.io/v2/cards?q=name:marowak"
//   );

//   const cuboneResponse: Response = await cubone.json();
//   return { data: cuboneResponse.data };
// }

async function getCardsUsingSDK() {
  // const paramsV2: PokemonTCG.Parameter = { q: "name:cubone" };
  const paramsV2: PokemonTCG.Parameter = {
    q: "nationalPokedexNumbers:[1 TO 151]",
  };

  const cartasv2 = await PokemonTCG.findCardsByQueries(paramsV2);

  return cartasv2;
}

export default async function Page() {
  // const returnedCartasV2 = use(getCardsUsingSDK());

  const returnedCartasV2 = await getCardsUsingSDK();

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    border: "1px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <div>
      {/* {cubones.map((card: Card) => (
        <div key={card.id}> {card.name}</div>
      ))}{" "} */}
      Total: {returnedCartasV2.length}
      {/* {returnedCartasV2.id} */}
      <Masonry columns={3} spacing={1}>
        {returnedCartasV2.map((item, index) => (
          <Stack key={index}>
            <Label>{index + 1}</Label>
            <img
              src={`${item.images.small}?w=162&auto=format`}
              srcSet={`${item.images.small}?w=162&auto=format&dpr=2 2x`}
              alt={item.id}
              loading="lazy"
              style={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
            />
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
  );
}
