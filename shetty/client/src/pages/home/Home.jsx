import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCricketData,
  fetchCricketBatingData,
} from "../../redux/reducer/cricketSlice";
import {
  fetchSoccerData,
  fetchSoccerBatingData,
} from "../../redux/reducer/soccerSlice";
import {
  fetchTennisData,
  fetchTennisBatingData,
} from "../../redux/reducer/tennisSlice";
import DepositIcon from "../../assets/depositIcon.svg";
import WithdrawIcon from "../../assets/withdrawIcon.svg";
import Banner1 from "../../assets/banner1.webp";
import Banner2 from "../../assets/banner2.webp";
import cricketicon from "../../assets/cricketicon.webp";
import liveEvent from "../../assets/liveEvent.gif";
import NewLaunch from "../../components/home/NewLaunch";
import CricketBattleComp from "../../components/home/CricketBattle";
import TrandingGames from "../../components/home/TrandingGames";
import RecomendedGames from "../../components/home/RecomendedGames";
import LiveCasinoGames from "../../components/home/LiveCasinoGames";
import SlotsGame from "../../components/home/SlotsGame";
import FooterInfo from "../../components/home/FooterInfo";
import tennisball from "../../assets/tennisball.png";

function formatMatchTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
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
  if (isToday) return `Today ${time}`;
  if (isTomorrow) return `Tomorrow ${time}`;
  return d
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " ");
}

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matches: cricketMatches = [], loader: cricketLoading } = useSelector(
    (state) => state.cricket
  );
  const { soccerData: soccerMatches = [], soccerLoading } = useSelector(
    (state) => state.soccer
  );
  const { data: tennisMatches = [], tennisLoading } = useSelector(
    (state) => state.tennis
  );

  useEffect(() => {
    if (!(cricketMatches?.length > 0)) dispatch(fetchCricketData());
    if (!(soccerMatches?.length > 0)) dispatch(fetchSoccerData());
    if (!(tennisMatches?.length > 0)) dispatch(fetchTennisData());
  }, [dispatch, cricketMatches?.length, soccerMatches?.length, tennisMatches?.length]);

  const topMatches = useMemo(() => {
    const cricket = (cricketMatches || [])
      .filter((m) => m.inplay === true)
      .map((m) => ({
        id: m.id,
        sport: "CRICKET",
        league: m.title || "Cricket",
        teams: m.match || "—",
        time: formatMatchTime(m.date),
        badges: [m.inplay && "MO", m.bm && "BM", m.f && "F"].filter(Boolean),
        odds: (m.odds || []).slice(0, 3).map((o) => ({
          back: { price: o?.home ?? "—", volume: "—" },
          lay: { price: o?.away ?? "—", volume: "—" },
        })),
        raw: m,
      }));
    const soccer = (soccerMatches || [])
      .filter((m) => m.iplay === true)
      .map((m) => ({
        id: m.id,
        sport: "FOOTBALL",
        league: m.title || "Football",
        teams: m.match || "—",
        time: formatMatchTime(m.date),
        badges: [m.iplay && "MO", ...(m.channels || [])].filter(Boolean),
        odds: (m.odds || []).slice(0, 3).map((o) => ({
          back: { price: o?.home ?? "—", volume: "—" },
          lay: { price: o?.away ?? "—", volume: "—" },
        })),
        raw: m,
      }));
    return [...cricket, ...soccer].sort(
      (a, b) => new Date(a.raw?.date || 0) - new Date(b.raw?.date || 0)
    );
    const tennis = (tennisMatches || [])
      .filter((m) => m.iplay === true)
      .map((m) => ({
        id: m.id,
        sport: "TENNIS",
        league: m.title || "Tennis",
        teams: m.match || "—",
        time: formatMatchTime(m.date),
        badges: [m.iplay && "MO", ...(m.channels || [])].filter(Boolean),
        odds: (m.odds || []).slice(0, 3).map((o) => ({
          back: { price: o?.home ?? "—", volume: "—" },
          lay: { price: o?.away ?? "—", volume: "—" },
        })),
        raw: m,
      }));
    return [...cricket, ...soccer, ...tennis].sort(
      (a, b) => new Date(a.raw?.date || 0) - new Date(b.raw?.date || 0)
    );
  }, [cricketMatches, soccerMatches, tennisMatches]);

  const isLoading = cricketLoading || soccerLoading || tennisLoading;

  const handleMatchClick = (match) => {
    if (match.sport === "CRICKET") {
      dispatch(fetchCricketBatingData(match.id));
      navigate(`/cricket/preview?gameid=${match.id}`, {
        state: { match: match.raw },
      });
    } else if (match.sport === "FOOTBALL") {
      dispatch(fetchSoccerBatingData(match.id));
      navigate(`/football/preview?gameid=${match.id}`, {
        state: { match: match.raw },
      });
    } else if (match.sport === "TENNIS") {
      dispatch(fetchTennisBatingData(match.id));
      navigate(`/tennis/preview?gameid=${match.id}`, {
        state: { match: match.raw },
      });
    }
  };

  return (
    <div className="py-2 px-4">
      <div className="grid grid-cols-2 gap-1">
        <div
          onClick={() => navigate("/deposit")}
          className="flex justify-center items-center bg-[#008000] py-0.5 gap-1 border border-[#fff] rounded-sm cursor-pointer"
        >
          <img src={DepositIcon} alt="" />
          <span className="text-[#fff] text-[14px] font-[700]">DEPOSIT</span>
        </div>
        <div
          onClick={() => navigate("/withdraw")}
          className="flex justify-center items-center bg-[#fe6201] py-0.5 gap-1 border border-[#fff] rounded-sm cursor-pointer"
        >
          <img src={WithdrawIcon} alt="" />
          <span className="text-[#fff] text-[14px] font-[700]">WITHDRAW</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-0.5">
        <img
          src={Banner1}
          alt="Banner1"
          className="w-full mt-1 rounded-sm cursor-pointer"
        />
        <img
          src={Banner2}
          alt="Banner2"
          className="w-full mt-1 rounded-sm cursor-pointer"
        />
      </div>

      <div>
        <div>
          <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
            TOP MATCHES
          </span>
          <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
            <div className="absolute left-0 top-0 h-full w-[100px] bg-cyan-400 rounded-full" />
          </div>
        </div>
        {isLoading ? (
          <div className="table-bg mt-2 p-4 rounded-md min-w-[300px] text-white text-center">
            Loading...
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-scroll scrollbar-hide">
            {topMatches.map((match) => (
              <div
                key={`${match.sport}-${match.id}`}
                onClick={() => handleMatchClick(match)}
                className="home-match-card table-bg mt-2 p-4 rounded-md min-w-[300px] h-[220px] flex flex-col cursor-pointer hover:opacity-90 transition"
              >
                <div className="flex justify-between items-center shrink-0 min-h-[32px]">
                  <div className="flex items-center gap-1 min-h-[28px]">
                    <img
                      src={cricketicon}
                      alt=""
                      className="h-6 w-6 shrink-0"
                    />
                    <span className="icon-bg-primary text-[10px] font-[800]">
                      {match.sport}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-h-[28px]">
                    {match.badges.map((badge) => (
                      <span
                        key={badge}
                        className="bg-[#0d8893] w-6 h-6 font-[800] text-[10px] text-[#fff] rounded-full flex justify-center items-center shrink-0"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-h-0 flex flex-col mt-0.5">
                  <span className="home-match-card-league icon-bg-primary text-[11px] font-[800] block">
                    {match.league}{" "}
                  </span>
                  <div className="mt-2 flex justify-between items-start gap-2 min-h-0 shrink-0">
                    <div className="home-match-card-teams text-[#ffffff] text-[12px] font-[600] flex-1 min-w-0">
                      {match.teams}
                    </div>
                    <img src={liveEvent} alt="" className="w-8 shrink-0" />
                  </div>
                  <div className="text-[#ffffff] text-[10px] font-[500] shrink-0">
                    {match.time}
                  </div>
                </div>
                <div className="flex gap-1 mt-2 mt-auto shrink-0">
                  {match.odds.map((odd, idx) => (
                    <div
                      key={idx}
                      className="flex flex-1 min-w-0 rounded-2xl overflow-hidden border border-[#000000]/10 h-[38px]"
                    >
                      <div className="bg-[#b2d9ff] flex-1 flex flex-col min-w-0 justify-center items-center text-center py-1 px-0.5">
                        <span className="text-[11px] font-[700] text-[#000000] leading-none h-[14px] flex items-center justify-center truncate w-full">
                          {odd.back.price}
                        </span>
                        <span className="text-[8px] font-[500] text-[#000000] leading-none h-[12px] flex items-center justify-center truncate w-full">
                          {odd.back.volume}
                        </span>
                      </div>
                      <div className="bg-[#ffc3dc] flex-1 flex flex-col min-w-0 justify-center items-center text-center py-1 px-0.5">
                        <span className="text-[11px] font-[700] text-[#000000] leading-none h-[14px] flex items-center justify-center truncate w-full">
                          {odd.lay.price}
                        </span>
                        <span className="text-[8px] font-[500] text-[#000000] leading-none h-[12px] flex items-center justify-center truncate w-full">
                          {odd.lay.volume}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <CricketBattleComp />
        <NewLaunch />
        <RecomendedGames />
        <LiveCasinoGames />
        <SlotsGame />
        <FooterInfo />
      </div>
    </div>
  );
}

export default Home;
