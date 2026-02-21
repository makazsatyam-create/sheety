import React from "react";
import HomeGameSection from "./HomeGameSection";
import SpribeData from "../../data/spribe.json";

function NewLaunch() {
  const games = Array.isArray(SpribeData) ? SpribeData : [];
  return <HomeGameSection title="New Launch" games={games} />;
}

export default NewLaunch;
