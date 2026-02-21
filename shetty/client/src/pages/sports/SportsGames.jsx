import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SabaGames from "../../data/saba.json";
import LuckyGames from "../../data/lucky.json";
import BtiGames from "../../data/bti.json";
import "../casino/Casino.css";

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

  const handleGameClick = (game) => {
    if (!game.game_uid) return;
    const query = game.game_type
      ? `?gameType=${encodeURIComponent(game.game_type)}`
      : "";
    navigate(`/launch-game/${game.game_uid}${query}`);
  };

  return (
    <div className="casino-container">
      <div
        className="flex-row"
        style={{
          justifyContent: "space-between",
          height: "32px",
          backgroundColor: "#071123",
          borderRadius: "25px",
          border: "1px solid #04a0e2",
        }}
      >
        <h1
          className="casino-filter-text"
          style={{
            fontSize: "13px",
            color: "#fff",
            fontWeight: "900",
            marginLeft: "5px",
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ padding: "8px 0" }}>
        {games.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "gray",
            }}
          >
            <p style={{ fontSize: "18px" }}>No games yet</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Add games in client/src/data/{sport || "saba"}.json (game_uid, game_type)
              game_uid and game_type
            </p>
          </div>
        ) : (
          <div className="casino-game-grid">
            {games.map((game) => (
              <div
                key={game.game_uid || `${game.provider}-${game.id}`}
                onClick={() => handleGameClick(game)}
                className="casino-game-card"
                style={{ cursor: game.game_uid ? "pointer" : "not-allowed" }}
              >
                <img
                  src={game.icon}
                  alt={game.game_name}
                  className="casino-game-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200x267/31425f/ffffff?text=Game";
                  }}
                />
                <div style={{ marginTop: "4px", textAlign: "center" }}>
                  <span
                    style={{
                      color: "white",
                      fontSize: "12px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {game.game_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SportsGames;
