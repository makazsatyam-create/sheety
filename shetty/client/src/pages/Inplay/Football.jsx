import React, { useEffect } from "react";
import football from "../../assets/football.png";
import liveEvent from "../../assets/liveEvent.gif";
import MatchNamesRow from "./MatchNamesRow";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSoccerData,
  fetchSoccerBatingData,
  setSelectedMatch,
} from "../../redux/reducer/soccerSlice";

export const footballMatches = [
  {
    id: 1,
    name: "CAF African Nations Cup",
    datetime: "01/01/26, 01:29 AM",
    tags: ["BM"],
    odds: {
      team1: {
        back: { price: "2.40", volume: "120K" },
        lay: { price: "2.44", volume: "130K" },
      },
      draw: {
        back: { price: "3.10", volume: "95K" },
        lay: { price: "3.15", volume: "100K" },
      },
      team2: {
        back: { price: "3.60", volume: "80K" },
        lay: { price: "3.70", volume: "85K" },
      },
    },
  },

  {
    id: 2,
    name: "Immigration FC Vs Negeri Sembilan",
    datetime: "17/01/26, 02:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "6.60", volume: "3K" },
        lay: { price: "9.40", volume: "68K" },
      },
      draw: {
        back: { price: "1.61", volume: "54K" },
        lay: { price: "1.72", volume: "42K" },
      },
      team2: {
        back: { price: "3.45", volume: "1K" },
        lay: { price: "3.85", volume: "52K" },
      },
    },
  },

  {
    id: 3,
    name: "Shan United Vs Thitsar Arman FC",
    datetime: "17/01/26, 02:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.85", volume: "210K" },
        lay: { price: "1.90", volume: "225K" },
      },
      draw: {
        back: { price: "3.50", volume: "140K" },
        lay: { price: "3.60", volume: "150K" },
      },
      team2: {
        back: { price: "4.80", volume: "90K" },
        lay: { price: "5.00", volume: "95K" },
      },
    },
  },

  {
    id: 4,
    name: "Ayeyawady United Vs Yangon United",
    datetime: "17/01/26, 02:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "3.20", volume: "160K" },
        lay: { price: "3.30", volume: "170K" },
      },
      draw: {
        back: { price: "3.10", volume: "180K" },
        lay: { price: "3.15", volume: "185K" },
      },
      team2: {
        back: { price: "2.25", volume: "210K" },
        lay: { price: "2.30", volume: "220K" },
      },
    },
  },

  {
    id: 5,
    name: "HNK Gorica Vs Zalaegerszeg TE",
    datetime: "17/01/26, 03:00 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "2.05", volume: "130K" },
        lay: { price: "2.10", volume: "145K" },
      },
      draw: {
        back: { price: "3.40", volume: "110K" },
        lay: { price: "3.50", volume: "120K" },
      },
      team2: {
        back: { price: "3.90", volume: "95K" },
        lay: { price: "4.00", volume: "100K" },
      },
    },
  },

  {
    id: 6,
    name: "Ispe FC Vs Yadanarbon FC",
    datetime: "17/01/26, 03:00 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "6.60", volume: "3K" },
        lay: { price: "9.40", volume: "68K" },
      },
      draw: {
        back: { price: "1.61", volume: "54K" },
        lay: { price: "1.72", volume: "42K" },
      },
      team2: {
        back: { price: "3.45", volume: "1K" },
        lay: { price: "3.85", volume: "52K" },
      },
    },
  },

  {
    id: 7,
    name: "Maharlika Taguig FC Vs Kaya FC",
    datetime: "17/01/26, 03:15 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "8.50", volume: "12K" },
        lay: { price: "9.00", volume: "15K" },
      },
      draw: {
        back: { price: "4.20", volume: "40K" },
        lay: { price: "4.30", volume: "45K" },
      },
      team2: {
        back: { price: "1.35", volume: "350K" },
        lay: { price: "1.38", volume: "370K" },
      },
    },
  },

  {
    id: 8,
    name: "Aris Vs Asteras Tripolis",
    datetime: "17/01/26, 03:27 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.75", volume: "240K" },
        lay: { price: "1.80", volume: "260K" },
      },
      draw: {
        back: { price: "3.60", volume: "120K" },
        lay: { price: "3.70", volume: "130K" },
      },
      team2: {
        back: { price: "5.40", volume: "90K" },
        lay: { price: "5.60", volume: "95K" },
      },
    },
  },

  {
    id: 9,
    name: "Arba Minch Ketema Vs Defense Force",
    datetime: "17/01/26, 03:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "2.85", volume: "160K" },
        lay: { price: "2.90", volume: "170K" },
      },
      draw: {
        back: { price: "3.00", volume: "150K" },
        lay: { price: "3.05", volume: "155K" },
      },
      team2: {
        back: { price: "2.75", volume: "165K" },
        lay: { price: "2.80", volume: "175K" },
      },
    },
  },

  {
    id: 10,
    name: "Orlando Pirates Vs Marumo Gallants",
    datetime: "17/01/26, 03:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.60", volume: "420K" },
        lay: { price: "1.62", volume: "440K" },
      },
      draw: {
        back: { price: "3.80", volume: "180K" },
        lay: { price: "3.90", volume: "190K" },
      },
      team2: {
        back: { price: "6.20", volume: "70K" },
        lay: { price: "6.40", volume: "75K" },
      },
    },
  },
];

/** Map API match shape to the shape the UI expects */
function mapSoccerMatchToUI(apiMatch) {
  const [team1, draw, team2] = apiMatch.odds || [
    { home: "0", away: "0" },
    { home: "0", away: "0" },
    { home: "0", away: "0" },
  ];
  const isLive = !!(apiMatch.inplay ?? apiMatch.iplay);
  return {
    id: apiMatch.id ?? apiMatch.gmid,
    name: apiMatch.match ?? apiMatch.name ?? apiMatch.teams ?? "Match",
    datetime: apiMatch.date ?? apiMatch.datetime ?? "",
    inplay: isLive,
    tags: isLive
      ? ["LIVE"]
      : (apiMatch.channels ?? apiMatch.tags ?? ["P"]).slice(0, 3),
    odds: {
      team1: {
        back: { price: team1?.home ?? "0", volume: "–" },
        lay: { price: team1?.away ?? "0", volume: "–" },
      },
      draw: {
        back: { price: draw?.home ?? "0", volume: "–" },
        lay: { price: draw?.away ?? "0", volume: "–" },
      },
      team2: {
        back: { price: team2?.home ?? "0", volume: "–" },
        lay: { price: team2?.away ?? "0", volume: "–" },
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

function getMatchTitle(m) {
  return m.title ?? m.league ?? m.tournament ?? m.match ?? "";
}

function Football({ onlyInplay }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    soccerData: apiMatches,
    soccerLoading: loader,
    selectedTitle,
  } = useSelector((state) => state.soccer);

  useEffect(() => {
    if (!(Array.isArray(apiMatches) && apiMatches.length > 0)) {
      dispatch(fetchSoccerData());
    }
  }, [dispatch, apiMatches?.length]);

  const rawList = selectedTitle
    ? (apiMatches || []).filter((m) => getMatchTitle(m) === selectedTitle)
    : apiMatches || [];
  const matchesToShow =
    rawList.length > 0
      ? rawList.map(mapSoccerMatchToUI)
      : Array.isArray(apiMatches) && apiMatches.length > 0
        ? []
        : footballMatches;

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
    dispatch(fetchSoccerBatingData(match.id));
    navigate(`/football/preview?gameid=${match.id}`, {
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
          <img src={football} alt="football" className="w-9 h-9" />
          <span className="text-white text-[15px] font-[400]">FOOTBALL</span>
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

export default Football;
