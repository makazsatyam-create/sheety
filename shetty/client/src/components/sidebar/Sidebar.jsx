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

  const userInfo = useSelector((state) => state.auth?.userInfo);
  const displayName = userInfo?.name || userInfo?.userName || "User";
  const avatarLetter = (displayName.charAt(0) || "U").toUpperCase();

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

        <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-400">
          <span className="text-xs">MENU ITEMS</span>
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
