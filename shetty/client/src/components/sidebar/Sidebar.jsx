import React, { useState } from "react";
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

import { IoLogOut } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import sabaImg from "../../assets/saba.jpg";
import luckyImg from "../../assets/luckysports.png";
import btiImg from "../../assets/bti.png";
import MobileImg from "../../assets/shetty-logo-mobile.png";
import DesktopImg from "../../assets/shetty-logo-desktop.png";

const sportsMenu = [
  { id: "saba", label: "Saba", path: "/saba", image: sabaImg },
  { id: "lucky", label: "Lucky", path: "/lucky", image: luckyImg },
  { id: "bti", label: "BTI", path: "/bti", image: btiImg },
];

function Sidebar({ setSidebarOpen }) {
  const [openSport, setOpenSport] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.auth?.userInfo);
  const displayName = userInfo?.name || userInfo?.userName || "User";
  const avatarLetter = (displayName.charAt(0) || "U").toUpperCase();

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

    { id: 18, label: "Deposit", icon: FiCreditCard, path: "/deposit" },
    { id: 19, label: "Withdraw", icon: FiCreditCard, path: "/withdraw" },
    { id: 13, label: "My Profile", icon: FiUser, path: "/my_profile" },
  ];

  const securityLogout = [{ id: 2, label: "Logout", icon: IoLogOut }];

  return (
    <nav className="h-full w-full flex flex-col bg-gradient-to-b from-[#0a1a2f] to-[#0f1e34]">
      {/* Logo Section */}
      <div className="icon-bg-colour border-b border-[#2a3a50] shadow-lg">
        <div className="relative flex items-center justify-center h-20 px-3">
          {/* Desktop Logo - full width */}
          <img
            src={DesktopImg}
            alt="Logo"
            className="hidden lg:block w-full h-full object-contain py-2 px-2"
          />
          {/* Mobile Logo - full width */}
          <img
            src={MobileImg}
            alt="Logo"
            className="block lg:hidden w-full h-full object-contain py-2 px-2"
          />
          {/* Close Button */}
          <CgCloseO
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-white md:hidden cursor-pointer flex-shrink-0"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Rest of the sidebar content remains the same */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex items-center px-6 py-3 gap-2">
          <div className="rounded-full icon-bg-colour w-8 h-8 flex items-center justify-center text-[#fff] text-[12px] font-[600]">
            {avatarLetter}
          </div>
          <div className="text-[14px] font-[700] truncate">{displayName}</div>
        </div>

        <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-400">
          <span
            className="text-xs font-bold text-black"
            style={{ fontWeight: 700 }}
          >
            SPORTS
          </span>
        </button>
        <div className="">
          {sportsMenu.map((item) => {
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
                className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition ${
                  isActive ? "activetab-bg" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-[700] text-white">
                      {item.label.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-[500] text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-400">
          <span
            className="text-xs font-bold text-black"
            style={{ fontWeight: 700 }}
          >
            MENU ITEMS
          </span>
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
          <span
            className="text-xs font-bold text-black"
            style={{ fontWeight: 700 }}
          >
            SECURITY & LOGOUT
          </span>
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

      <div className="p-2">
        <button className="w-full bg-gradient-to-r from-[#0f1e34] to-[#1a2a40] hover:from-[#1a2a40] hover:to-[#0f1e34] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 border border-[#2a3a50] hover:border-[#3b82f6] group">
          <RiWhatsappFill className="text-[#25D366] group-hover:scale-110 transition-transform duration-300" />
          <span className="text-[10px] font-[700] tracking-wider">
            FOLLOW ON WHATSAPP
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
