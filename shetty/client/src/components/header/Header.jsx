import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import WhatsappIcon from "../../assets/whatsappicon.png";
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
      <div className="flex items-center justify-between h-12 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-800 rounded transition"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
          <div className="hidden lg:flex items-center gap-1">
            {menuitems.map((item) => (
              <span
                key={item.name}
                onClick={() => {
                  if (item.link) {
                    navigate(item.link);
                    setSelectedMenu(item.name);
                  }
                }}
                className={`text-[#ffffff] text-[12px] font-semibold py-1.5 px-3 cursor-pointer ${
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

        <div className="flex items-center gap-2">
          <img src={WhatsappIcon} alt="WhatsApp" className="rounded-full w-7" />
          <div className="flex flex-col">
            <div className="flex justify-center items-center gap-2 text-[#ffffff] text-[14px] font-semibold">
              <MdInfoOutline />
              <span>Bal:{balance}</span>
              <span className="text-[#f3bd42] font-[700]">{displayName}</span>
            </div>
            <div className="flex justify-center items-center gap-2 text-[#ffffff] text-[14px] font-semibold">
              <span>Exp:{exposure}</span>
              <span>Bonus:{bonus}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
