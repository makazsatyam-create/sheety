import React from "react";
import HomeGameSection from "./HomeGameSection";
import InoutData from "../../data/inout.json";

function RecomendedGames() {
  const games = Array.isArray(InoutData) ? InoutData : [];
  return <HomeGameSection title="Recomended Games" games={games} />;
}

export default RecomendedGames;
