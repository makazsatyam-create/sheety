import React, { useState } from "react";
import title from "../../assets/title.svg";
import { CgCloseO } from "react-icons/cg";
import { RiWhatsappFill } from "react-icons/ri";
import {
  FiGift,
  FiBriefcase,
  FiCreditCard,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiFileText,
  FiAward,
  FiRepeat,
  FiList,
  FiSettings,
  FiBookOpen,
  FiUser,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import { MdOutlinePolicy } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCricketData,
  setSelectedTitle,
} from "../../redux/reducer/cricketSlice";
import {
  fetchSoccerData,
  setSelectedTitle as setSelectedSoccerTitle,
} from "../../redux/reducer/soccerSlice";
import {
  fetchTennisData,
  setSelectedTitle as setSelectedTennisTitle,
} from "../../redux/reducer/tennisSlice";
import { useEffect } from "react";
import cricketball from "../../assets/cricketball.png";
function Sidebar({ setSidebarOpen }) {
  const [openSport, setOpenSport] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { matches: cricketMatchesFromRedux, loader: cricketLoader } =
    useSelector((state) => state.cricket);
  const { soccerData: footballListFromRedux, soccerLoading: footballLoader } =
    useSelector((state) => state.soccer);
  const { data: tennisListFromRedux, tennisLoading: tennisLoader } =
    useSelector((state) => state.tennis);
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const displayName = userInfo?.name || userInfo?.userName || "User";
  const avatarLetter = (displayName.charAt(0) || "U").toUpperCase();

  const cricketList = cricketMatchesFromRedux || [];
  const cricketTitles = [
    ...new Set(cricketList.map((m) => m.title).filter(Boolean)),
  ];

  const footballList = footballListFromRedux || [];
  const footballTitles = [
    ...new Set(
      footballList
        .map((m) => m.title ?? m.league ?? m.tournament ?? m.match)
        .filter(Boolean)
    ),
  ];

  const tennisList = tennisListFromRedux || [];
  const tennisTitles = [
    ...new Set(tennisList.map((m) => m.title ?? m.cname).filter(Boolean)),
  ];

  useEffect(() => {
    if (openSport === "Cricket" && cricketList.length === 0) {
      dispatch(fetchCricketData());
    }
  }, [openSport, cricketList.length, dispatch]);

  useEffect(() => {
    if (openSport === "Football" && footballList.length === 0) {
      dispatch(fetchSoccerData());
    }
  }, [openSport, footballList.length, dispatch]);

  useEffect(() => {
    if (openSport === "Tennis" && tennisList.length === 0) {
      dispatch(fetchTennisData());
    }
  }, [openSport, tennisList.length, dispatch]);
  const sports = [
    { id: 2, name: "Cricket", emoji: "🏏" },
    { id: 3, name: "Football", emoji: "⚽" },
    { id: 4, name: "Tennis", emoji: "🎾" },
    { id: 5, name: "Kabaddi", emoji: "🤼" },
    { id: 6, name: "Basketball", emoji: "🏀" },
    { id: 7, name: "Baseball", emoji: "⚾" },
    { id: 8, name: "GreyHound", emoji: "🐕" },
    { id: 9, name: "Horse Race", emoji: "🏇" },
    { id: 10, name: "Volleyball", emoji: "🏐" },
    { id: 11, name: "Darts", emoji: "🎯" },
    { id: 12, name: "Futsal", emoji: "⚽" },
  ];

  const cricketLeagues = [
    "International Twenty20 Matches",
    "Ford Trophy",
    "Pakistan / Presidents Trophy",
    "Simulated Reality League / Big Bash League SRL",
    "Simulated Reality League / Pakistan Super League SRL",
    "Simulated Reality League / Premier League SRL",
    "Australia NCL Women",
    "Simulated Reality League / Caribbean Premier League SRL",
    "World Legends Pro League T20",
    "ICC Men's T20 World Cup",
    "Simulated Reality League / Super Smash SRL",
    "Simulated Reality League / SA T20 League SRL",
    "Other",
    "ICC World Cup Warm Up Matches",
  ];

  const otherMenu = [
    { id: 1, label: "Promotions", icon: FiGift },
    { id: 2, label: "My Bets", icon: FiBriefcase, path: "/my_bets" },
    { id: 3, label: "My Wallet", icon: FiCreditCard, path: "/my_wallet" },

    {
      id: 5,
      label: "Betting Profit & Loss",
      icon: FiTrendingUp,
      path: "/pl_statement",
    },
    {
      id: 6,
      label: "Turnover History",
      icon: FiRefreshCw,
      path: "/turnover_history",
    },
    {
      id: 7,
      label: "Account Statement",
      icon: FiFileText,
      path: "/account_statement",
    },
    {
      id: 8,
      label: "Bonus Statement",
      icon: FiAward,
      path: "/bonus_statement",
    },
    {
      id: 9,
      label: "Deposit Turnover",
      icon: FiRepeat,
      path: "/deposit_turnover",
    },

    { id: 10, label: "My Transaction", icon: FiList, path: "/my_transaction" },
    {
      id: 11,
      label: "Stake Settings",
      icon: FiSettings,
      path: "/stake_settings",
    },
    { id: 12, label: "Game Rules", icon: FiBookOpen },
    { id: 18, label: "Deposit", icon: FiCreditCard, path: "/deposit" },
    { id: 19, label: "Withdraw", icon: FiCreditCard, path: "/withdraw" },
    { id: 13, label: "My Profile", icon: FiUser, path: "/my_profile" },

    { id: 15, label: "Language : EN", icon: FiGlobe, arrow: true },
  ];

  const securityLogout = [
    { id: 1, label: "Security Settings", icon: MdOutlinePolicy },
    { id: 2, label: "Logout", icon: IoLogOut },
  ];

  return (
    <nav className="h-full w-full flex flex-col bg-[#fff] ">
      <div className="icon-bg-colour flex justify-center items-center h-12">
        <div className="text-2xl font-bold">
          <img src={title} alt="Logo" className="h-7" />
        </div>
        <CgCloseO
          className="absolute right-4 top-3 w-7 h-7 text-white md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center px-6 py-3 gap-2">
          <div className="rounded-full icon-bg-colour w-8 h-8 flex items-center justify-center text-[#fff] text-[12px] font-[600]">
            {avatarLetter}
          </div>
          <div className="text-[14px] font-[700] truncate">{displayName}</div>
        </div>

        {sports.map((sport) => {
          const isOpen = openSport === sport.name;
          const isCricket = sport.name === "Cricket";
          const isFootball = sport.name === "Football";
          const isTennis = sport.name === "Tennis";
          const hasRoute = isCricket || isFootball || isTennis;
          const isActive =
            (isCricket && location.pathname === "/cricket") ||
            (isFootball && location.pathname === "/football") ||
            (isTennis && location.pathname === "/tennis");

          return (
            <div key={sport.id} className="w-full">
              <button
                onClick={() => {
                  if (hasRoute) {
                    setOpenSport(isOpen ? null : sport.name);
                    if (isCricket) {
                      navigate("/cricket");
                      if (cricketList.length === 0)
                        dispatch(fetchCricketData());
                    } else if (isFootball) {
                      navigate("/football");
                      if (footballList.length === 0)
                        dispatch(fetchSoccerData());
                    } else if (isTennis) {
                      navigate("/tennis");
                      if (tennisList.length === 0) dispatch(fetchTennisData());
                    } else {
                      setSidebarOpen(false);
                    }
                  } else {
                    setOpenSport(isOpen ? null : sport.name);
                  }
                }}
                className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition ${isActive ? "activetab-bg" : ""}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center text-lg">
                  {sport.emoji}
                </div>
                <span className="text-sm font-[500] text-gray-800">
                  {sport.name}
                </span>
              </button>

              {isCricket && isOpen && (
                <div className="w-full border-l-2 border-[#f1dcfe] py-2 mb-2">
                  {cricketLoader && cricketList.length === 0 ? (
                    <span className="text-[13px] text-gray-500 block px-4">
                      Loading...
                    </span>
                  ) : cricketTitles.length === 0 ? (
                    <span className="text-[13px] text-gray-500 block px-4">
                      No titles
                    </span>
                  ) : (
                    cricketTitles.map((titleName) => (
                      <div
                        key={titleName}
                        className="w-full border-b border-[#f1dcfe]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setSelectedTitle(titleName));
                            navigate("/cricket");
                            setSidebarOpen(false);
                          }}
                          className="sidebar-title-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition whitespace-normal"
                        >
                          {titleName}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {isFootball && isOpen && (
                <div className="w-full border-l-2 border-[#f1dcfe] py-2 mb-2">
                  {footballLoader && footballList.length === 0 ? (
                    <span className="text-[13px] text-gray-500 block px-4">
                      Loading...
                    </span>
                  ) : footballTitles.length === 0 ? (
                    <span className="text-[13px] text-gray-500 block px-4">
                      No titles
                    </span>
                  ) : (
                    footballTitles.map((titleName) => (
                      <div
                        key={titleName}
                        className="w-full border-b border-[#f1dcfe]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setSelectedSoccerTitle(titleName));
                            navigate("/football");
                            setSidebarOpen(false);
                          }}
                          className="sidebar-title-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition whitespace-normal"
                        >
                          {titleName}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
              {isTennis && isOpen && (
                <div className="w-full border-l-2 border-[#f1dcfe] py-2 mb-2">
                  {tennisLoader && tennisList.length === 0 ? (
                    <span className="text-[13px] text-gray-500 block px-4">
                      Loading...
                    </span>
                  ) : tennisTitles.length === 0 ? (
                    <span className="text-[13px] text-gray-500 block px-4">
                      No titles
                    </span>
                  ) : (
                    tennisTitles.map((titleName) => (
                      <div
                        key={titleName}
                        className="w-full border-b border-[#f1dcfe]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setSelectedTennisTitle(titleName));
                            navigate("/tennis");
                            setSidebarOpen(false);
                          }}
                          className="sidebar-title-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition whitespace-normal"
                        >
                          {titleName}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-400">
          <span className="text-xs">OTHER MENU</span>
        </button>
        <div className="">
          {otherMenu.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                    setSidebarOpen?.(false);
                  }
                }}
                className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition ${isActive ? "activetab-bg" : ""}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center text-white">
                  <Icon size={14} />
                </div>
                <span className="text-xs font-[500] text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
                {item.arrow && <span className="text-gray-400">›</span>}
              </button>
            );
          })}
        </div>

        <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-400">
          <span className="text-xs">SECURITY & LOGOUT</span>
        </button>
        <div className="">
          {securityLogout.map((item) => {
            const Icon = item.icon;
            const isLogout = item.id === 2 && item.label === "Logout";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isLogout) {
                    localStorage.removeItem("auth");
                    navigate("/login", { replace: true });
                    setSidebarOpen?.(false);
                  }
                }}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition"
              >
                <div className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center text-white">
                  <Icon size={14} />
                </div>
                <span className="text-xs font-[500] text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
                {item.arrow && <span className="text-gray-400">›</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-2 ">
        <button className="w-full bg-[#071123] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-medium transition">
          <RiWhatsappFill />
          <span className="text-[10px] font-[700]">FOLLOW ON WHATSAPP</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
