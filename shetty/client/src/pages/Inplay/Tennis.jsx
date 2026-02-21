import React, { useEffect } from "react";
import tennisball from "../../assets/tennisball.png";
import liveEvent from "../../assets/liveEvent.gif";
import MatchNamesRow from "./MatchNamesRow";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTennisData,
  fetchTennisBatingData,
  setSelectedMatch,
} from "../../redux/reducer/tennisSlice";

export const tennisMatches = [
  {
    id: 1,
    name: "Dimitrov Vs Tsonga",
    datetime: "17/01/26, 02:31 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.72", volume: "220K" },
        lay: { price: "1.75", volume: "235K" },
      },
      draw: {
        back: { price: "15.0", volume: "12K" },
        lay: { price: "16.0", volume: "14K" },
      },
      team2: {
        back: { price: "2.20", volume: "180K" },
        lay: { price: "2.24", volume: "195K" },
      },
    },
  },

  {
    id: 2,
    name: "Radovanovic, Tadija Vs Lulic, Nikola",
    datetime: "17/01/26, 03:35 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.48", volume: "310K" },
        lay: { price: "1.50", volume: "330K" },
      },
      draw: {
        back: { price: "18.0", volume: "9K" },
        lay: { price: "20.0", volume: "11K" },
      },
      team2: {
        back: { price: "2.85", volume: "140K" },
        lay: { price: "2.90", volume: "155K" },
      },
    },
  },

  {
    id: 3,
    name: "Kisantal, Botond Vs Mihailovic, Nikola",
    datetime: "17/01/26, 03:40 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "2.35", volume: "125K" },
        lay: { price: "2.40", volume: "135K" },
      },
      draw: {
        back: { price: "14.0", volume: "18K" },
        lay: { price: "15.0", volume: "20K" },
      },
      team2: {
        back: { price: "1.62", volume: "260K" },
        lay: { price: "1.65", volume: "275K" },
      },
    },
  },

  {
    id: 4,
    name: "Federer Vs Thimm",
    datetime: "17/01/26, 03:57 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.20", volume: "820K" },
        lay: { price: "1.22", volume: "860K" },
      },
      draw: {
        back: { price: "25.0", volume: "6K" },
        lay: { price: "30.0", volume: "8K" },
      },
      team2: {
        back: { price: "5.80", volume: "75K" },
        lay: { price: "6.00", volume: "82K" },
      },
    },
  },

  {
    id: 5,
    name: "Nadal Vs Zverev",
    datetime: "17/01/26, 03:58 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.95", volume: "360K" },
        lay: { price: "2.00", volume: "380K" },
      },
      draw: {
        back: { price: "12.0", volume: "22K" },
        lay: { price: "13.0", volume: "25K" },
      },
      team2: {
        back: { price: "1.90", volume: "350K" },
        lay: { price: "1.94", volume: "365K" },
      },
    },
  },

  {
    id: 6,
    name: "Raonic Vs Nishikori",
    datetime: "17/01/26, 04:07 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.68", volume: "280K" },
        lay: { price: "1.72", volume: "300K" },
      },
      draw: {
        back: { price: "16.0", volume: "15K" },
        lay: { price: "17.0", volume: "18K" },
      },
      team2: {
        back: { price: "2.30", volume: "190K" },
        lay: { price: "2.36", volume: "205K" },
      },
    },
  },

  {
    id: 7,
    name: "Di Girolami, Tilwith Vs Borg, Christian",
    datetime: "17/01/26, 04:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "2.10", volume: "160K" },
        lay: { price: "2.15", volume: "175K" },
      },
      draw: {
        back: { price: "14.5", volume: "19K" },
        lay: { price: "15.5", volume: "21K" },
      },
      team2: {
        back: { price: "1.75", volume: "240K" },
        lay: { price: "1.78", volume: "255K" },
      },
    },
  },

  {
    id: 8,
    name: "Negritu C Vs Soriano Barrera A",
    datetime: "17/01/26, 04:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.88", volume: "210K" },
        lay: { price: "1.92", volume: "225K" },
      },
      draw: {
        back: { price: "13.0", volume: "20K" },
        lay: { price: "14.0", volume: "23K" },
      },
      team2: {
        back: { price: "2.00", volume: "195K" },
        lay: { price: "2.05", volume: "210K" },
      },
    },
  },

  {
    id: 9,
    name: "Etty, Edward Vs Verwerft, Lars G",
    datetime: "17/01/26, 04:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "2.55", volume: "135K" },
        lay: { price: "2.60", volume: "150K" },
      },
      draw: {
        back: { price: "17.0", volume: "10K" },
        lay: { price: "18.0", volume: "12K" },
      },
      team2: {
        back: { price: "1.52", volume: "320K" },
        lay: { price: "1.55", volume: "340K" },
      },
    },
  },

  {
    id: 10,
    name: "Muller Vs Van Assche",
    datetime: "17/01/26, 04:45 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.65", volume: "290K" },
        lay: { price: "1.68", volume: "305K" },
      },
      draw: {
        back: { price: "16.0", volume: "14K" },
        lay: { price: "17.0", volume: "16K" },
      },
      team2: {
        back: { price: "2.45", volume: "170K" },
        lay: { price: "2.50", volume: "185K" },
      },
    },
  },
];

/** Map API match shape to UI shape */
function mapTennisMatchToUI(apiMatch) {
  const odds = apiMatch.odds || [];
  const team1 = odds[0] || { home: "0", away: "0" };
  const draw = odds[1] || { home: "0", away: "0" };
  const team2 = odds[2] || { home: "0", away: "0" };
  const isLive = !!(apiMatch.iplay ?? apiMatch.inplay);
  return {
    id: apiMatch.id,
    name: apiMatch.match ?? apiMatch.name ?? "Match",
    datetime: apiMatch.date ?? apiMatch.datetime ?? "",
    inplay: isLive,
    tags: isLive ? ["LIVE"] : (apiMatch.channels ?? ["P"]).slice(0, 3),
    odds: {
      team1: {
        back: { price: team1.home, volume: "–" },
        lay: { price: team1.away, volume: "–" },
      },
      draw: {
        back: { price: draw.home, volume: "–" },
        lay: { price: draw.away, volume: "–" },
      },
      team2: {
        back: { price: team2.home, volume: "–" },
        lay: { price: team2.away, volume: "–" },
      },
    },
  };
}

/** Format date for the non-live pill: "Today" / "05:45 PM" style */
function formatMatchDatePill(dateStr) {
  if (!dateStr) return { dateLabel: "—", time: "—" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { dateLabel: "—", time: String(dateStr) };
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  let dateLabel = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
  if (isToday) dateLabel = "Today";
  else if (isTomorrow) dateLabel = "Tomorrow";
  return { dateLabel, time };
}

const OddBox = ({ price, volume, type }) => {
  const bg = type === "back" ? "bg-[#b2d9ff]" : "bg-[#ffc3dc]";
  return (
    <div
      className={`min-w-14 h-8 rounded-full flex flex-col items-center justify-center ${bg}`}
    >
      <span className="text-[#090909] text-[13px] font-[900]">{price}</span>
      <span className="text-[#090909] text-[9px] font-[600]">{volume}</span>
    </div>
  );
};

function Tennis({ onlyInplay }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: apiMatches,
    tennisLoading: loader,
    selectedTitle,
  } = useSelector((state) => state.tennis);

  useEffect(() => {
    if (!(Array.isArray(apiMatches) && apiMatches.length > 0)) {
      dispatch(fetchTennisData());
    }
  }, [dispatch, apiMatches?.length]);

  const rawList = selectedTitle
    ? (apiMatches || []).filter(
        (m) => (m.title ?? m.cname ?? "") === selectedTitle
      )
    : apiMatches || [];
  const matchesToShow =
    rawList.length > 0
      ? rawList.map(mapTennisMatchToUI)
      : Array.isArray(apiMatches) && apiMatches.length > 0
        ? []
        : tennisMatches;

  // When onlyInplay: show only live; otherwise show all with live first
  const matchesToShowSorted = onlyInplay
    ? matchesToShow.filter((m) => m.inplay)
    : [...matchesToShow].sort((a, b) => {
        if (a.inplay && !b.inplay) return -1;
        if (!a.inplay && b.inplay) return 1;
        return 0;
      });

  const handleRowClick = (match) => {
    const matchForPreview = {
      id: match.id,
      name: match.name,
      date: match.datetime ?? match.date ?? "",
    };
    dispatch(setSelectedMatch(matchForPreview));
    dispatch(fetchTennisBatingData(match.id));
    navigate(`/tennis/preview?gameid=${match.id}`, {
      state: { match: matchForPreview },
    });
  };

  return (
    <div className="w-full">
      {/* <MatchNamesRow
        items={matchesToShowSorted.map((m) => ({ id: m.id, name: m.name }))}
      /> */}
      <div
        className="border border-[#04a0e2] icon-bg-colour rounded-[20px]
        flex items-center
        md:grid md:grid-cols-[1fr_70px_70px_70px_70px_70px_70px]"
      >
        <div className="flex items-center gap-2 flex-1">
          <img src={tennisball} alt="tennisball" className="w-9 h-9" />
          <span className="text-white text-[15px] font-[400]">TENNIS</span>
        </div>
        <div className="hidden md:block text-white text-center col-span-2">
          1
        </div>
        <div className="hidden md:block text-white text-center col-span-2">
          X
        </div>
        <div className="hidden md:block text-white text-center col-span-2">
          2
        </div>
      </div>

      <div className="border border-[#1c2b3a] mt-2 rounded-xl overflow-hidden">
        {matchesToShowSorted.map((match) => {
          const datePill = formatMatchDatePill(match.datetime);
          return (
            <React.Fragment key={match.id}>
              {/* -------- DESKTOP VIEW -------- */}
              <div
                className="hidden md:grid grid-cols-[1fr_70px_70px_70px_70px_70px_70px]
                  bg-[#1c2b3a] items-center border-b border-[#24384d] p-1 mb-0.5 rounded-[10px]
                  cursor-pointer hover:bg-[#24384d] transition-colors"
                onClick={() => handleRowClick(match)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleRowClick(match)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 items-center">
                    {match.inplay ? (
                      <img
                        src={liveEvent}
                        alt="live"
                        className="h-5 hidden md:block"
                      />
                    ) : (
                      <div className="hidden md:flex flex-col items-center justify-center rounded-lg bg-[#24384d] px-2 py-1 min-w-[60px]">
                        <span className="text-white text-[10px] font-[600] leading-tight">
                          {datePill.dateLabel}
                        </span>
                        <span className="text-white text-[10px] font-[600] leading-tight">
                          {datePill.time}
                        </span>
                      </div>
                    )}
                    <div className="max-w-[200px]">
                      <p className="text-white text-[12px] font-[700] truncate">
                        {match.name}
                      </p>
                      <p className="text-white text-[10px]">{match.datetime}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#0d8893] text-white rounded-full w-6 h-6 text-[10px] flex items-center justify-center"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center col-span-2 gap-1">
                  <OddBox {...match.odds.team1.back} type="back" />
                  <OddBox {...match.odds.team1.lay} type="lay" />
                </div>
                <div className="flex justify-center col-span-2 gap-1">
                  <OddBox {...match.odds.draw.back} type="back" />
                  <OddBox {...match.odds.draw.lay} type="lay" />
                </div>
                <div className="flex justify-center col-span-2 gap-1">
                  <OddBox {...match.odds.team2.back} type="back" />
                  <OddBox {...match.odds.team2.lay} type="lay" />
                </div>
              </div>

              {/* -------- MOBILE VIEW -------- */}
              <div
                className="md:hidden p-3 bg-[#1c2b3a] border-b border-[#24384d] rounded-[10px] space-y-3 mb-0.5
                  cursor-pointer hover:bg-[#24384d] transition-colors"
                onClick={() => handleRowClick(match)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleRowClick(match)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    {match.inplay ? (
                      <>
                        <img
                          src={liveEvent}
                          alt="live"
                          className="h-6 hidden lg:block"
                        />
                        <div className="max-w-[200px]">
                          <p className="text-white text-[12px] font-[700] truncate">
                            {match.name}
                          </p>
                          <p className="text-white text-[10px] flex items-center gap-1">
                            {match.datetime}
                            <img
                              src={liveEvent}
                              alt="live"
                              className="h-4 block lg:hidden"
                            />
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-[#24384d] px-2 py-1 min-w-[60px]">
                          <span className="text-white text-[10px] font-[600] leading-tight">
                            {datePill.dateLabel}
                          </span>
                          <span className="text-white text-[10px] font-[600] leading-tight">
                            {datePill.time}
                          </span>
                        </div>
                        <div className="max-w-[200px]">
                          <p className="text-white text-[12px] font-[700] truncate">
                            {match.name}
                          </p>
                          <p className="text-white text-[10px]">
                            {match.datetime}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#0d8893] text-white rounded-full w-6 h-6 text-[10px] flex items-center justify-center"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end overflow-x-auto gap-1 min-w-0">
                  <div className="flex justify-center gap-1">
                    <OddBox {...match.odds.team1.back} type="back" />
                    <OddBox {...match.odds.team1.lay} type="lay" />
                  </div>
                  <div className="flex justify-center gap-1">
                    <OddBox {...match.odds.draw.back} type="back" />
                    <OddBox {...match.odds.draw.lay} type="lay" />
                  </div>
                  <div className="flex justify-center gap-1">
                    <OddBox {...match.odds.team2.back} type="back" />
                    <OddBox {...match.odds.team2.lay} type="lay" />
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Tennis;
