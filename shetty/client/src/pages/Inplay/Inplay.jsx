import React from "react";
import TrandingGame from "../../components/inplay/TrandingGame";
import { useNavigate } from "react-router-dom";
import sabaImg from "../../assets/saba.jpg";
import btiImg from "../../assets/bti.png";
import luckyImg from "../../assets/luckysports.png";

const sportsProviders = [
  { id: "saba", name: "Saba", path: "/saba", icon: sabaImg },
  { id: "bti", name: "BTI", path: "/bti", icon: btiImg },
  { id: "lucky", name: "Lucky", path: "/lucky", icon: luckyImg },
];

function Inplay() {
  const navigate = useNavigate();

  return (
    <div className="py-2 lg:px-2 flex gap-2 items-start">
      <div className="w-full lg:w-3/4 container-bg rounded-xl min-h-[80vh]">
        <div className="p-2 flex flex-col gap-2">
          {sportsProviders.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => navigate(provider.path)}
              className="w-full rounded-xl activetab-bg border border-[#01fafe] p-3 flex items-center gap-3 cursor-pointer hover:opacity-90 text-left"
            >
              <img
                src={provider.icon}
                alt={provider.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-[#000000] text-base font-[600]">
                {provider.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden lg:block w-1/4 container-bg rounded-sm sticky top-2">
        <TrandingGame />
      </div>
    </div>
  );
}

export default Inplay;
