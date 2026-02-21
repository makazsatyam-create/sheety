import React from "react";
import HomeGameSection from "./HomeGameSection";
import JiliDataRaw from "../../data/jili.json";

function SlotsGame() {
  const raw = Array.isArray(JiliDataRaw)
    ? (Array.isArray(JiliDataRaw[0]) ? JiliDataRaw.flat() : JiliDataRaw)
    : [];
  const slots = raw.filter(
    (g) => g && (g.game_type === "Slot Game" || g.game_type === "Slot")
  );
  return <HomeGameSection title="Slots Games" games={slots} />;
}

export default SlotsGame;
