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
      <div className="flex items-center justify-between h-14 px-2 sm:px-3 lg:px-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1 hover:bg-gray-800 rounded transition flex-shrink-0"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>

          {/* Both Logos with responsive visibility */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Logo - visible on mobile, hidden on desktop */}
            <img
              src={MobileLogo}
              alt="Mobile Logo"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain lg:hidden"
            />
            {/* Desktop Logo - hidden on mobile, visible on desktop */}
            <img
              src={DesktopLogo}
              alt="Desktop Logo"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain hidden lg:block"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 ml-2">
            {menuitems.map((item) => (
              <span
                key={item.name}
                onClick={() => {
                  if (item.link) {
                    navigate(item.link);
                    setSelectedMenu(item.name);
                  }
                }}
                className={`text-[#ffffff] text-[12px] font-semibold py-1.5 px-3 cursor-pointer whitespace-nowrap ${
                  location.pathname === item.link
                    ? "icon-colour-primary rounded-2xl active-text-colour border-t-2 border-t-[#fff]"
                    : ""
                } ${!item.link ? "opacity-70 cursor-default" : ""}`}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <img
            src={WhatsappIcon}
            alt="WhatsApp"
            className="rounded-full w-5 sm:w-6 lg:w-7 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex justify-center items-center gap-1 sm:gap-2 text-[#ffffff] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">
              <MdInfoOutline className="flex-shrink-0" />
              <span className="truncate">Bal:{balance}</span>
              <span className="text-[#f3bd42] font-[700] truncate max-w-[60px] sm:max-w-[80px] lg:max-w-none">
                {displayName}
              </span>
            </div>
            <div className="flex justify-center items-center gap-1 sm:gap-2 text-[#ffffff] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">
              <span className="truncate">Exp:{exposure}</span>
              <span className="truncate">Bonus:{bonus}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
