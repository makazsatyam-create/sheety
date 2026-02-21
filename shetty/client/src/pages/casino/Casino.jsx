import React, { useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import EvolutionGames from "../../data/Evolution.json";
import SpribeGames from "../../data/spribe.json";
import JiliGamesRaw from "../../data/jili.json";
import InoutGames from "../../data/inout.json";
import EzugiGames from "../../data/EZUGI.json";
import "./Casino.css";
import { useNavigate } from "react-router-dom";

// jili.json can be nested array; flatten if needed
const JiliGames = Array.isArray(JiliGamesRaw?.[0])
  ? JiliGamesRaw.flat()
  : JiliGamesRaw || [];

function Casino() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameType, setSelectedGameType] = useState("ALL");
  const [selectedProvider, setSelectedProvider] = useState("spribe");
  const navigate = useNavigate();

  const evolutionGames = useMemo(() => {
    return EvolutionGames.filter((game) => game.provider === "evolutionlive");
  }, []);

  const gamesByProvider = useMemo(
    () => ({
      spribe: (SpribeGames || []).filter(
        (g) => (g.provider || "").toLowerCase() === "spribe"
      ),
      jili: (JiliGames || []).filter(
        (g) => (g.provider || "").toLowerCase() === "jili"
      ),
      inout: (InoutGames || []).filter(
        (g) => (g.provider || "").toLowerCase() === "inout"
      ),
      evolution: evolutionGames,
      ezugi: (EzugiGames || []).filter(
        (g) => (g.provider || "").toLowerCase() === "ezugi"
      ),
    }),
    [evolutionGames]
  );

  const currentGames = useMemo(() => {
    return gamesByProvider[selectedProvider] || [];
  }, [gamesByProvider, selectedProvider]);

  const handleGameClick = (game) => {
    navigate(`/launch-game/${game.game_uid}`);
  };

  const gameTypes = useMemo(() => {
    if (selectedProvider !== "evolution") {
      const types = new Set(["ALL"]);
      currentGames.forEach((game) => {
        const gt = (game.game_type || "").trim();
        if (gt) types.add(gt);
      });
      return ["ALL", ...[...types].filter((t) => t !== "ALL").sort()];
    }
    const types = new Set();
    currentGames.forEach((game) => {
      const name = (game.game_name || "").toLowerCase();
      if (name.includes("32 cards") || name.includes("32card"))
        types.add("32 Cards");
      else if (name.includes("baccarat")) types.add("Baccarat");
      else if (name.includes("blackjack")) types.add("Blackjack");
      else if (name.includes("dragon tiger")) types.add("Dragon Tiger");
      else if (name.includes("roulette")) types.add("Roulette");
      else if (name.includes("sic bo") || name.includes("sicbo"))
        types.add("Sicbo");
      else if (name.includes("teen patti")) types.add("Teen Patti");
      else if (name.includes("poker")) types.add("Poker");
      else if (
        name.includes("crazy") ||
        name.includes("funky") ||
        name.includes("mega") ||
        name.includes("dream") ||
        name.includes("fun")
      )
        types.add("Fun");
    });
    const typeOrder = [
      "32 Cards",
      "Baccarat",
      "Blackjack",
      "Dragon Tiger",
      "Fun",
      "Poker",
      "Roulette",
      "Sicbo",
      "Teen Patti",
    ];
    const ordered = ["ALL"];
    typeOrder.forEach((t) => {
      if (types.has(t)) ordered.push(t);
    });
    return ordered;
  }, [selectedProvider, currentGames]);

  const filteredGames = useMemo(() => {
    let filtered = currentGames;

    if (selectedGameType !== "ALL") {
      if (selectedProvider === "evolution") {
        filtered = filtered.filter((game) => {
          const name = (game.game_name || "").toLowerCase();
          if (selectedGameType === "Baccarat") return name.includes("baccarat");
          if (selectedGameType === "Blackjack")
            return name.includes("blackjack");
          if (selectedGameType === "Roulette") return name.includes("roulette");
          if (selectedGameType === "Poker") return name.includes("poker");
          if (selectedGameType === "Dragon Tiger")
            return name.includes("dragon tiger");
          if (selectedGameType === "Sicbo")
            return name.includes("sic bo") || name.includes("sicbo");
          if (selectedGameType === "Teen Patti")
            return name.includes("teen patti");
          if (selectedGameType === "32 Cards")
            return name.includes("32 cards") || name.includes("32card");
          if (selectedGameType === "Fun")
            return (
              name.includes("crazy") ||
              name.includes("funky") ||
              name.includes("mega") ||
              name.includes("dream") ||
              name.includes("fun")
            );
          return true;
        });
      } else {
        filtered = filtered.filter(
          (game) => (game.game_type || "").trim() === selectedGameType
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((game) =>
        (game.game_name || "").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [currentGames, selectedGameType, selectedProvider, searchQuery]);

  const providers = [
    { id: "evolution", name: "EVOLUTION" },
    { id: "ezugi", name: "EZUGI" },
    { id: "spribe", name: "SPRIBE" },
    { id: "jili", name: "JILI" },
    { id: "inout", name: "INOUT" },
  ];

  return (
    <div className="casino-container">
      {/* Header with CASINO title and Search */}
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
          CASINO
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            borderRadius: "100px",
            marginRight: "2px",
            border: "1px solid #01fafe",
          }}
        >
          <input
            type="text"
            placeholder="Search games"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "4px 30px 4px 28px", // space for both icons
              color: "#fff",
              borderRadius: "40px",
              border: "1px solid rgba(1, 250, 254, 0.5)",
              outline: "none",
              fontSize: "13px",
              background: "transparent",
            }}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
              }}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Provider Tabs - Using casino-provider-block */}
      <div
        className="flex-row provider-ctn scrollbar-hide"
        style={{ borderRadius: "8px", overflow: "hidden" }}
      >
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`casino-provider-block ${selectedProvider === provider.id ? "selected" : ""} ${provider.className || ""}`}
            onClick={() => {
              setSelectedProvider(provider.id);
              setSelectedGameType("ALL");
            }}
          >
            <span className="casino-filter-text">{provider.name}</span>
          </div>
        ))}
      </div>

      {/* Game Type Filters - Using casino-category-card */}
      <div
        className="flex-row scrollbar-hide"
        style={{ gap: "8px", padding: "4px 0" }}
      >
        {gameTypes.map((type) => (
          <div
            key={type}
            className={`casino-category-card ${selectedGameType === type ? "selected" : ""}`}
            onClick={() => setSelectedGameType(type)}
          >
            {type === "ALL" && (
              <svg
                className={`casino-category-icon ${selectedGameType === type ? "selected" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
            <span className="casino-category-text">{type}</span>
          </div>
        ))}
      </div>

      {/* Games Grid */}
      <div style={{ padding: "8px 0" }}>
        {filteredGames.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "gray" }}
          >
            <p style={{ fontSize: "18px" }}>No games found</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="casino-game-grid">
            {filteredGames.map((game) => (
              <div
                key={game.game_uid || `${game.provider}-${game.id}`}
                onClick={() => handleGameClick(game)}
                className="casino-game-card"
                style={{ cursor: "pointer" }}
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

export default Casino;
