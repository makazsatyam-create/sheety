import React, { useEffect } from "react";
import cricketball from "../../assets/cricketball.png";
import liveEvent from "../../assets/liveEvent.gif";
import MatchNamesRow from "./MatchNamesRow";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCricketData,
  fetchCricketBatingData,
  setSelectedMatch,
} from "../../redux/reducer/cricketSlice";
export const cricketMatches = [
  {
    id: 1,
    name: "Twenty20 Big Bash",
    datetime: "14/12/25, 02:45 PM",
    tags: ["MO", "BM", "F"],
    odds: {
      team1: {
        back: { price: "3.10", volume: "36K" },
        lay: { price: "3.20", volume: "40K" },
      },
      draw: {
        back: { price: "1.04", volume: "329K" },
        lay: { price: "1.05", volume: "350K" },
      },
      team2: {
        back: { price: "85", volume: "675K" },
        lay: { price: "100", volume: "125K" },
      },
    },
  },

  {
    id: 2,
    name: "Women's Premier League",
    datetime: "09/01/26, 10:45 PM",
    tags: ["MO", "BM", "F"],
    odds: {
      team1: {
        back: { price: "1.55", volume: "45K" },
        lay: { price: "1.56", volume: "50K" },
      },
      draw: {
        back: { price: "4.20", volume: "30K" },
        lay: { price: "4.30", volume: "32K" },
      },
      team2: {
        back: { price: "2.78", volume: "14K" },
        lay: { price: "2.80", volume: "25K" },
      },
    },
  },

  {
    id: 3,
    name: "Knights Vs Garden Route Badgers",
    datetime: "15/01/26, 01:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "7.20", volume: "1167K" },
        lay: { price: "7.40", volume: "900K" },
      },
      draw: {
        back: { price: "3.60", volume: "300K" },
        lay: { price: "3.70", volume: "320K" },
      },
      team2: {
        back: { price: "1.15", volume: "4605K" },
        lay: { price: "1.16", volume: "3794K" },
      },
    },
  },

  {
    id: 4,
    name: "New Territories Tigers Vs Kowloon Lions",
    datetime: "17/01/26, 11:00 AM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "2.40", volume: "210K" },
        lay: { price: "2.44", volume: "225K" },
      },
      draw: {
        back: { price: "3.10", volume: "180K" },
        lay: { price: "3.15", volume: "190K" },
      },
      team2: {
        back: { price: "2.90", volume: "160K" },
        lay: { price: "2.95", volume: "170K" },
      },
    },
  },

  {
    id: 5,
    name: "Adelaide Strikers Vs Melbourne Renegades",
    datetime: "17/01/26, 11:30 AM",
    tags: ["MO", "BM", "F"],
    odds: {
      team1: {
        back: { price: "1.01", volume: "227038K" },
        lay: { price: "1.02", volume: "210000K" },
      },
      draw: {
        back: { price: "15", volume: "50K" },
        lay: { price: "16", volume: "55K" },
      },
      team2: {
        back: { price: "1000", volume: "302K" },
        lay: { price: "1100", volume: "290K" },
      },
    },
  },

  {
    id: 6,
    name: "Lahore Qalandars SRL Vs Islamabad United SRL",
    datetime: "17/01/26, 12:30 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.80", volume: "150K" },
        lay: { price: "1.82", volume: "165K" },
      },
      draw: {
        back: { price: "4.50", volume: "70K" },
        lay: { price: "4.60", volume: "75K" },
      },
      team2: {
        back: { price: "2.10", volume: "140K" },
        lay: { price: "2.12", volume: "150K" },
      },
    },
  },

  {
    id: 7,
    name: "Dhaka Capitals Vs Rangpur Riders",
    datetime: "17/01/26, 12:30 PM",
    tags: ["MO", "BM", "F"],
    odds: {
      team1: {
        back: { price: "7.20", volume: "1167K" },
        lay: { price: "7.80", volume: "717K" },
      },
      draw: {
        back: { price: "3.20", volume: "400K" },
        lay: { price: "3.30", volume: "420K" },
      },
      team2: {
        back: { price: "1.15", volume: "4605K" },
        lay: { price: "1.16", volume: "3794K" },
      },
    },
  },

  {
    id: 8,
    name: "West Indies T10 Vs England",
    datetime: "17/01/26, 12:50 PM",
    tags: ["P"],
    odds: {
      team1: {
        back: { price: "1.90", volume: "220K" },
        lay: { price: "1.95", volume: "230K" },
      },
      draw: {
        back: { price: "5.00", volume: "80K" },
        lay: { price: "5.10", volume: "85K" },
      },
      team2: {
        back: { price: "2.05", volume: "200K" },
        lay: { price: "2.08", volume: "215K" },
      },
    },
  },

  {
    id: 9,
    name: "Japan U19 Vs Sri Lanka U19",
    datetime: "17/01/26, 01:00 PM",
    tags: ["MO", "BM", "F"],
    odds: {
      team1: {
        back: { price: "100", volume: "1K" },
        lay: { price: "120", volume: "2K" },
      },
      draw: {
        back: { price: "170", volume: "3K" },
        lay: { price: "180", volume: "3.5K" },
      },
      team2: {
        back: { price: "1.01", volume: "144K" },
        lay: { price: "1.02", volume: "150K" },
      },
    },
  },

  {
    id: 10,
    name: "India U19 Vs Bangladesh U19",
    datetime: "17/01/26, 01:00 PM",
    tags: ["MO", "BM", "F"],
    odds: {
      team1: {
        back: { price: "1.55", volume: "45K" },
        lay: { price: "1.56", volume: "25K" },
      },
      draw: {
        back: { price: "3.80", volume: "18K" },
        lay: { price: "3.90", volume: "20K" },
      },
      team2: {
        back: { price: "2.78", volume: "14K" },
        lay: { price: "2.80", volume: "25K" },
      },
    },
  },
];

/** Map API match shape to the shape your UI expects */
function mapApiMatchToUI(apiMatch) {
  const [team1, draw, team2] = apiMatch.odds || [
    { home: "0", away: "0" },
    { home: "0", away: "0" },
    { home: "0", away: "0" },
  ];
  const tags = [];
  if (apiMatch.tv) tags.push("TV");
  if (apiMatch.bm) tags.push("BM");
  if (apiMatch.f) tags.push("F");
  return {
    id: apiMatch.id,
    name: apiMatch.match,
    title: apiMatch.title,
    datetime: apiMatch.date,
    inplay: !!apiMatch.inplay,
    tags: apiMatch.inplay ? ["LIVE", ...tags] : tags,
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

function Cricket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    matches: apiMatches,
    loader,
    error,
    selectedTitle,
  } = useSelector((state) => state.cricket);

  useEffect(() => {
    dispatch(fetchCricketData());
  }, [dispatch]);

  const matchesToShow = selectedTitle
    ? (apiMatches || []).filter((m) => m.title === selectedTitle)
    : apiMatches || [];
  const cricketMatches =
    matchesToShow.length > 0 ? matchesToShow.map(mapApiMatchToUI) : [];
  const handleRowClick = (match) => {
    dispatch(setSelectedMatch(match));
    dispatch(fetchCricketBatingData(match.id));
    navigate(`/cricket/preview?gameid=${match.id}`, { state: { match } });
  };

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      {/* <MatchNamesRow
        items={cricketMatches.map((m) => ({ id: m.id, name: m.name }))}
      /> */}
      <div
        className="hidden md:grid border border-[#04a0e2] icon-bg-colour rounded-[20px] items-center
          grid-cols-[1fr_70px_70px_70px_70px_70px_70px]"
      >
        <div className="flex items-center gap-2 flex-1">
          <img src={cricketball} alt="cricketball" className="w-9 h-9" />
          <span className="text-white text-[15px] font-[400]">CRICKET</span>
        </div>
        <div className="text-white text-center col-span-2">1</div>
        <div className="text-white text-center col-span-2">X</div>
        <div className="text-white text-center col-span-2">2</div>
      </div>

      <div className="border border-[#1c2b3a] mt-2 rounded-xl overflow-hidden overflow-x-auto">
        {cricketMatches.map((match) => {
          const datePill = formatMatchDatePill(match.datetime);
          return (
            <React.Fragment key={match.id}>
              {/* -------- DESKTOP VIEW -------- */}
              <div
                className="hidden md:grid grid-cols-[1fr_70px_70px_70px_70px_70px_70px] min-w-[600px]
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

export default Cricket;
