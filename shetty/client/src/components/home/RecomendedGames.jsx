import React from "react";
import HomeGameSection from "./HomeGameSection";
import InoutData from "../../data/inout.json";

function RecomendedGames() {
  const games = Array.isArray(InoutData) ? InoutData : [];
  const additionalGames = [
    {
      id: 13,
      game_name: "TowerX",
      game_uid: "5fa811450c40fda4caba581f6f10f2aa",
      game_type: "XGames",
      icon: "https://bulkapi.in/smart_soft/683fee631b4d58c4b7c00370_TowerX.webp",
    },
  ];
  const allGames = [...additionalGames, ...games];
  return <HomeGameSection title="Recomended Games" games={allGames} />;
}

export default RecomendedGames;
