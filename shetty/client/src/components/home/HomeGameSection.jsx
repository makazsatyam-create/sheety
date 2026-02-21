import React from "react";
import { useNavigate } from "react-router-dom";

const MAX_GAMES = 15;

/**
 * Reusable home section: title + horizontal scroll of game cards.
 * Each game links to /launch-game/:game_uid
 * @param {string} title - Section title
 * @param {Array<{ game_uid: string, game_name: string, icon: string }>} games - From JSON (sliced to MAX_GAMES)
 */
function HomeGameSection({ title, games = [] }) {
  const navigate = useNavigate();
  const list = Array.isArray(games) ? games.slice(0, MAX_GAMES) : [];

  if (list.length === 0) return null;

  return (
    <div className="mt-4">
      <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
        {title}
      </span>
      <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
        <div className="absolute left-0 top-0 h-full w-[100px] bg-cyan-400 rounded-full" />
      </div>
      <div className="flex gap-2 overflow-x-scroll scrollbar-hide mt-2">
        {list.map((game) => (
          <button
            key={game.game_uid}
            type="button"
            onClick={() => navigate(`/launch-game/${game.game_uid}`)}
            className="flex-shrink-0 rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title={game.game_name}
          >
            <img
              src={game.icon}
              alt={game.game_name}
              className="w-[100px] h-[133px] object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomeGameSection;
