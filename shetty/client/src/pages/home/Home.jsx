import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DepositIcon from "../../assets/depositIcon.svg";
import WithdrawIcon from "../../assets/withdrawIcon.svg";
import Banner1 from "../../assets/banner1.webp";
import Banner2 from "../../assets/banner2.webp";
import NewLaunch from "../../components/home/NewLaunch";
import TrandingGames from "../../components/home/TrandingGames";
import RecomendedGames from "../../components/home/RecomendedGames";
import LiveCasinoGames from "../../components/home/LiveCasinoGames";
import SlotsGame from "../../components/home/SlotsGame";
import FooterInfo from "../../components/home/FooterInfo";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
