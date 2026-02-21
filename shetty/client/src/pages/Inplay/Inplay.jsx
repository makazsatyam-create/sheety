import React from "react";
import TrandingGame from "../../components/inplay/TrandingGame";
import All from "./All";
import Cricket, { cricketMatches } from "./Cricket";
import Football from "./Football";
import Tennis from "./Tennis";
import { useLocation } from "react-router-dom";
const teams = [
  { id: 1, name: "Sydney Sixers v Sydney Thunder" },
  { id: 2, name: "Royal Challengers Bengaluru W v Gujarat Giants W" },
  { id: 3, name: "MI Cape Town v Sunrisers Eastern Cape" },
  { id: 4, name: "Adelaide Strikers v Melbourne Renegades" },
  { id: 5, name: "Davidovich Fokina v Humbert" },
  { id: 6, name: "Women's Premier League" },
  { id: 7, name: "Twenty20 Big Bash" },
];

const games = [
  { id: 1, name: "All", emoji: "" },
  { id: 2, name: "Cricket", emoji: "🏏" },
  { id: 3, name: "Football", emoji: "⚽" },
  { id: 4, name: "Tennis", emoji: "🎾" },
  { id: 5, name: "Kabaddi", emoji: "🏟️" },
  { id: 6, name: "Basketball", emoji: "🏀" },
  { id: 7, name: "Baseball", emoji: "⚾" },
  { id: 8, name: "GreyHound", emoji: "🐕" },
  { id: 9, name: "Horse Race", emoji: "🏇" },
  { id: 10, name: "Volleyball", emoji: "🏐" },
  { id: 11, name: "Darts", emoji: "🎯" },
  { id: 12, name: "Futsal", emoji: "⚽" },
  { id: 13, name: "Table Tennis", emoji: "🏓" },
  { id: 14, name: "Binary", emoji: "📊" },
  { id: 15, name: "Politics", emoji: "🏛️" },
];

function Inplay() {
  const [selectedGame, setSelectedGame] = React.useState("All");
  const location = useLocation();
  React.useEffect(() => {
    if (location.pathname === "/cricket") {
      setSelectedGame("Cricket");
    } else if (location.state?.tab) {
      setSelectedGame(location.state.tab);
    }
  }, [location.pathname, location.state?.tab]);
  // Top row: show cricket match names when Cricket is selected, else default teams
  const topRowItems =
    selectedGame === "Cricket"
      ? cricketMatches.map((m) => ({ id: m.id, name: m.name }))
      : teams;

  return (
    <div className="py-2 lg:px-2 flex gap-2 items-start">
      <div className="w-full lg:w-3/4 container-bg rounded-xl min-h-[80vh]">
        {/* Horizontal match names row (demo: oval buttons) */}
        <div className="p-2 flex gap-2 overflow-x-scroll scrollbar-hide">
          {topRowItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl activetab-bg p-2 min-w-fit text-[#000000] text-sm font-[400] cursor-pointer hover:opacity-90"
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Sport tabs: All, Cricket, Football, ... */}
        <div>
          <div className="px-2 flex gap-2 overflow-x-scroll scrollbar-hide">
            {games.map((game) => (
              <div
                key={game.id}
                className={`rounded-full flex justify-center items-center ${selectedGame === game.name ? "activetab-bg text-[#000000] border border-[#01fafe]" : "text-[#ffffff] border border-[#ffffff]"} p-2 min-w-fit text-sm font-[500] cursor-pointer`}
                onClick={() => setSelectedGame(game.name)}
              >
                {game.emoji} {game.name}
              </div>
            ))}
          </div>
        </div>

        <div className="p-2">
          {selectedGame === "All" && <All onlyInplay />}
          {selectedGame === "Cricket" && <Cricket onlyInplay />}
          {selectedGame === "Football" && <Football onlyInplay />}
          {selectedGame === "Tennis" && <Tennis onlyInplay />}
        </div>
      </div>

      <div className="hidden lg:block w-1/4 container-bg rounded-sm sticky top-2">
        <div className="">
          <TrandingGame />
        </div>
      </div>
    </div>
  );
}

export default Inplay;
