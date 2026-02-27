import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import WhatsappIcon from "../../assets/whatsappicon.png";
import MobileLogo from "../../assets/shetty-logo-mobile.png";
import DesktopLogo from "../../assets/shetty-logo-desktop.png";
import { MdInfoOutline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const menuitems = [
  { name: "Home", link: "/home" },
  { name: "Casino", link: "/casino" },
];

function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedmenu, setSelectedMenu] = useState("Home");

  const userInfo = useSelector((state) => state.auth?.userInfo);

  const balance = (userInfo?.avbalance ?? 0).toFixed(2);
  const exposure = (userInfo?.exposure ?? 0).toFixed(2);
  const displayName = userInfo?.name || userInfo?.userName || "User";
  const bonus = (userInfo?.bonus ?? 0).toFixed(2);

  return (
    <header className="sticky top-0 z-30 table-bg border-b border-gray-800">
      <div className="flex items-center justify-between h-14 px-3 lg:px-6">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1 hover:bg-gray-800 rounded transition flex-shrink-0"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>

          {/* LOGOS WRAPPER */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop Logo FIRST */}
            <img
              src={DesktopLogo}
              alt="Desktop Logo"
              className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto object-contain"
            />

            {/* Mobile Logo SECOND */}
            <img
              src={MobileLogo}
              alt="Mobile Logo"
              className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            {menuitems.map((item) => (
              <span
                key={item.name}
                onClick={() => {
                  if (item.link) {
                    navigate(item.link);
                    setSelectedMenu(item.name);
                  }
                }}
                className={`text-white text-sm font-semibold py-1.5 px-3 cursor-pointer whitespace-nowrap transition ${
                  location.pathname === item.link
                    ? "rounded-2xl border-t-2 border-white"
                    : "hover:text-gray-300"
                }`}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* WhatsApp */}
          <img
            src={WhatsappIcon}
            alt="WhatsApp"
            className="w-6 sm:w-7 lg:w-8 h-auto rounded-full flex-shrink-0"
          />

          {/* USER INFO */}
          <div className="flex flex-col text-white text-xs sm:text-sm font-semibold leading-tight">
            <div className="flex items-center gap-2">
              <MdInfoOutline />
              <span>Bal: {balance}</span>
              <span className="text-[#f3bd42] truncate max-w-[90px]">
                {displayName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Exp: {exposure}</span>
              <span>Bonus: {bonus}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
