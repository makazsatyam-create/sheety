import React from "react";
import CricketBattleimg from "../../assets/cricket_battle.webp";
function CricketBattle() {
  return (
    <div>
      <div>
        <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
          Cricket Battle
        </span>
        <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
          {/* Highlight segment */}
          <div className="absolute left-0 top-0 h-full w-[100px]  bg-cyan-400 rounded-full" />
        </div>
        <div>
          <img
            src={CricketBattleimg}
            alt="Cricket Battle"
            className="w-full mt-2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default CricketBattle;
