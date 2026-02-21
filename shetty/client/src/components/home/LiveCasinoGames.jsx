import React from "react";
import HomeGameSection from "./HomeGameSection";
import EvolutionData from "../../data/Evolution.json";
import EzugiData from "../../data/EZUGI.json";

function LiveCasinoGames() {
  const games = [
    ...(Array.isArray(EvolutionData) ? EvolutionData : []),
    ...(Array.isArray(EzugiData) ? EzugiData : []),
  ];
  return <HomeGameSection title="Live Casino Games" games={games} />;
}

export default LiveCasinoGames;
