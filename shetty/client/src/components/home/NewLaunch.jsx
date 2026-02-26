import React from "react";
import HomeGameSection from "./HomeGameSection";
import SpribeData from "../../data/spribe.json";

function NewLaunch() {
  // Get games from JSON
  const jsonGames = Array.isArray(SpribeData) ? SpribeData : [];

  // Add additional games
  const additionalGames = [
    {
      id: 37,
      game_name: "Dragon Tiger",
      game_uid: "efdb52994fbfe97efcbd878dbd697ebb",
      game_type: "CasinoLive",
      provider: "ezugi",
      icon: "https://bulkapi.in/EZUGI/EZUGI_150.png",
    },
    {
      id: 29,
      game_name: "Chicken Road 2.0",
      game_uid: "562b299961b0ec40f252a832453c67b0",
      game_type: "Instant",
      provider: "inout",
      icon: "https://bulkapi.in/Inout/INOUT_chicken-road-2-0.png",
    },
  ];

  // Combine both arrays
  const allGames = [...additionalGames, ...jsonGames];

  return <HomeGameSection title="New Launch" games={allGames} />;
}

export default NewLaunch;
