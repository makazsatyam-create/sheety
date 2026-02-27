import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SabaGames from "../../data/saba.json";
import LuckyGames from "../../data/lucky.json";
import BtiGames from "../../data/bti.json";
import sabaPhoto from "../../assets/saba.jpg";
import btiPhoto from "../../assets/bti.png";
import luckyPhoto from "../../assets/luckysports.png";
import "../casino/Casino.css";

const SPORT_IMAGES = {
  saba: sabaPhoto,
  lucky: luckyPhoto,
  bti: btiPhoto,
};

const SPORT_DATA = {
  saba: { games: SabaGames || [], title: "SABA" },
  lucky: { games: LuckyGames || [], title: "LUCKY" },
  bti: { games: BtiGames || [], title: "BTI" },
};

function SportsGames() {
  const location = useLocation();
  const navigate = useNavigate();
  const sport = (location.pathname || "").replace("/", "").toLowerCase();

  const { games, title } = useMemo(() => {
    return SPORT_DATA[sport] || { games: [], title: sport.toUpperCase() };
  }, [sport]);

  const sportImage = SPORT_IMAGES[sport];
  const firstGame = games.length > 0 ? games[0] : null;

  const handleLaunch = () => {
    if (!firstGame?.game_uid) return;
    const query = firstGame.game_type
      ? `?gameType=${encodeURIComponent(firstGame.game_type)}`
      : "";
    navigate(`/launch-game/${firstGame.game_uid}${query}`);
  };

  return (
    <div className="casino-container">
      <div className="casino-game-grid">
        <div
          className="casino-game-card"
          onClick={handleLaunch}
        >
          <img
            src={sportImage}
            alt={title}
            className="casino-game-image"
          />
        </div>
      </div>
    </div>
  );
}

export default SportsGames;
