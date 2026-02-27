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
    {
      id: 30,
      game_name: "Forest Arrow",
      game_uid: "458bd34bc83e34501df7e7f96626df6b",
      game_type: "Instant",
      provider: "inout",
      icon: "https://bulkapi.in/Inout/INOUT_forest-arrow.png",
    },
    {
      id: 31,
      game_name: "Chicken Road",
      game_uid: "2126c5c458316ba1f2df65b387b60408",
      game_type: "Instant",
      provider: "inout",
      icon: "https://bulkapi.in/Inout/INOUT_chicken-road.png",
    },
    {
      id: 33,
      game_name: "Squid Gamebler",
      game_uid: "2bd203129afe1059923b45d7bd5de143",
      game_type: "Instant",
      provider: "inout",
      icon: "https://bulkapi.in/Inout/INOUT_squid-gamebler.png",
    },
    {
      id: 56,
      game_name: "Lightning Dragon Tiger",
      game_uid: "d8da3c5c99a593a44c97325e7ba83838",
      game_type: "CasinoLive",
      provider: "evolutionlive",
      icon: "https://bulkapi.in/EVO_Video/LightningDT00001.png",
    },
    {
      id: 37,
      game_name: "Dragon Tiger",
      game_uid: "efdb52994fbfe97efcbd878dbd697ebb",
      game_type: "CasinoLive",
      provider: "ezugi",
      icon: "https://bulkapi.in/EZUGI/EZUGI_150.png",
    },
  ];
  const allGames = [...additionalGames, ...games];
  return <HomeGameSection title="Recomended Games" games={allGames} />;
}

export default RecomendedGames;
