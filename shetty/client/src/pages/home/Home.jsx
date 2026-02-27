import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import DepositIcon from "../../assets/depositIcon.svg";
import WithdrawIcon from "../../assets/withdrawIcon.svg";
import Banner1 from "../../assets/banner1.webp";
import Banner2 from "../../assets/banner2.webp";
import Banner3 from "../../assets/banner3.webp";
import Banner4 from "../../assets/banner4.webp";
import NewLaunch from "../../components/home/NewLaunch";
import CricketBattleComp from "../../components/home/CricketBattle";
import RecomendedGames from "../../components/home/RecomendedGames";
import LiveCasinoGames from "../../components/home/LiveCasinoGames";
import SlotsGame from "../../components/home/SlotsGame";

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

      {/* Desktop Banners - hidden on mobile */}
      <div className="hidden lg:grid grid-cols-2 gap-1 mt-0.5">
        <img
          src={Banner1}
          alt="Banner1"
          onClick={() => navigate("/deposit")}
          className="w-full mt-1 rounded-sm cursor-pointer"
        />
        <img
          src={Banner2}
          alt="Banner2"
          onClick={() => navigate("/deposit")}
          className="w-full mt-1 rounded-sm cursor-pointer"
        />
      </div>

      {/* Mobile Banners - hidden on desktop */}
      <div className="grid lg:hidden grid-cols-2 gap-1 mt-0.5">
        <img
          src={Banner3}
          alt="Banner3"
          onClick={() => navigate("/deposit")}
          className="w-full mt-1 rounded-sm cursor-pointer"
        />
        <img
          src={Banner4}
          alt="Banner4"
          onClick={() => navigate("/deposit")}
          className="w-full mt-1 rounded-sm cursor-pointer"
        />
      </div>

      {/* Bonus Banner - same line: text + emojis left, Claim Now right (hidden on desktop) */}
      <div
        className="check-bonus-tab lg:hidden"
        onClick={() => navigate("/check-bonuses")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/check-bonuses");
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="bonus-content">
          <span className="bonus-text">Check your Bonuses 💰 😍</span>
          <button
            type="button"
            className="check-bonus-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/check-bonuses");
            }}
          >
            Claim Now
          </button>
        </div>
      </div>

      <div>
        {/* Top match card styles – design per reference image */}
        <style jsx>{`
          .top-matches-ctn {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 4px 0;
          }
          .top-matches-ctn::-webkit-scrollbar {
            display: none;
          }

          .top-matches-ctn .top-match-card {
            background: #212e44;
            border-radius: 8px;
            padding: 10px 12px 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex !important;
            align-items: stretch;
            justify-content: space-between;
            min-height: 160px;
            flex-direction: column;
            min-width: 280px;
            flex: 0 0 auto;
          }
          @media screen and (max-width: 720px) {
            .top-matches-ctn .top-match-card {
              min-width: 85%;
            }
          }

          .top-matches-ctn .top-match-card .match-info {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
            margin-bottom: 8px;
          }
          .top-matches-ctn .top-match-card .match-info .category-and-live {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: space-between;
          }
          .top-matches-ctn .top-match-card .match-info .top-match-sport-icon {
            width: 18px;
            height: 18px;
            object-fit: contain;
          }
          .top-matches-ctn
            .top-match-card
            .match-info
            .competition-name-top-matches {
            font-size: 12px;
            font-weight: 700;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }
          .top-matches-ctn .top-match-card .match-info .top-match-badge {
            background: #0d8893;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .top-matches-ctn .top-match-card .match-info .top-match-league {
            font-size: 11px;
            font-weight: 600;
            color: #22d3ee;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .top-matches-ctn .top-match-card .match-info .top-match-title-row {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }
          .top-matches-ctn .top-match-card .match-info .top-match-teams {
            font-size: 14px;
            font-weight: 700;
            color: #fff;
            line-height: 1.2;
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .top-matches-ctn .top-match-card .match-info .top-match-live-gif {
            width: 24px;
            height: 14px;
            object-fit: contain;
            flex-shrink: 0;
          }
          .top-matches-ctn
            .top-match-card
            .match-info
            .date-display-top-matches {
            font-size: 11px;
            color: #e5e7eb;
            font-weight: 500;
          }

          .top-matches-ctn .top-match-card .odds-section {
            display: flex;
            gap: 6px;
            align-items: stretch;
            width: 100%;
            justify-content: space-between;
          }
          .top-matches-ctn .top-match-card .odds-section .team-odds {
            flex: 1;
            min-width: 0;
          }
          /* One pill per pair: wrapper has pill shape, two halves inside */
          .top-matches-ctn
            .top-match-card
            .odds-section
            .team-odds
            .exch-odd-view {
            display: flex;
            flex-direction: row;
            gap: 0;
            width: 100%;
            min-height: 40px;
            border-radius: 12px;
            overflow: hidden;
          }
          .top-matches-ctn .top-match-card .odds-section .odd-pill {
            flex: 1;
            min-width: 0;
            border-radius: 0;
            padding: 6px 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .team-odds
            .exch-odd-view
            .back-odd {
            border-radius: 30px 0 0 30px !important;
          }
          .top-matches-ctn .top-match-card .odds-section .back-odd.odd-pill {
            background: #b2d9ff;
            border: none;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .team-odds
            .exch-odd-view
            .lay-odd {
            border-radius: 0 30px 30px 0 !important;
          }
          .top-matches-ctn .top-match-card .odds-section .lay-odd.odd-pill {
            background: #ffc3dc;
            border: none;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .team-odds
            .exch-odd-view
            .odd-locked-left {
            border-radius: 30px 0 0 30px !important;
          }
          .top-matches-ctn .top-match-card .odds-section .odd-locked-left {
            background: #b2d9ff;
            border: none;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .team-odds
            .exch-odd-view
            .odd-locked-right {
            border-radius: 0 30px 30px 0 !important;
          }
          .top-matches-ctn .top-match-card .odds-section .odd-locked-right {
            background: #ffc3dc;
            border: none;
          }
          .top-matches-ctn .top-match-card .odds-section .top-match-lock-icon {
            width: 16px;
            height: 16px;
            color: #9ca3af;
            opacity: 1;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .exch-odd-button-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-width: 0;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .exch-odd-button-content
            .price {
            font-size: 14px;
            font-weight: 700;
            color: #000;
            line-height: 1.1;
          }
          .top-matches-ctn
            .top-match-card
            .odds-section
            .exch-odd-button-content
            .size {
            font-size: 10px;
            color: #1f2937;
            font-weight: 500;
            line-height: 1.1;
            margin-top: 2px;
          }
        `}</style>

        {/* Bonus Banner - teal banner, same line: text + emojis left, yellow Claim Now right */}
        <style jsx>{`
          .check-bonus-tab {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background: #008c95;
            min-height: 48px;
            border: 1px solid #fff;
            border-radius: 16px;
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset;
            cursor: pointer;
            transition:
              transform 0.2s,
              box-shadow 0.2s;
            margin: 10px 5px 0;
            width: calc(100% - 10px);
            padding: 10px 16px;
            box-sizing: border-box;
            overflow: hidden;
          }

          .check-bonus-tab:active {
            transform: scale(0.98);
          }

          .check-bonus-tab .bonus-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            width: 100%;
            min-width: 0;
            flex-wrap: nowrap;
            box-sizing: border-box;
          }

          .check-bonus-tab .bonus-text {
            color: #7dd3fc;
            font-size: 14px;
            font-weight: 600;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          @keyframes global-blink {
            0%,
            100% {
              opacity: 1;
              background-color: rgb(255, 218, 20);
            }
            50% {
              opacity: 0.85;
              background-color: rgb(255, 235, 120);
            }
          }

          .check-bonus-tab .check-bonus-btn {
            color: #000;
            font-weight: 700;
            font-size: 14px;
            border: none;
            padding: 8px 20px;
            border-radius: 10px;
            cursor: pointer;
            background-color: rgb(255, 218, 20);
            flex-shrink: 0;
            animation: global-blink 2s ease-in-out infinite;
          }

          .check-bonus-tab .check-bonus-btn:hover {
            background-color: rgb(255, 205, 0);
          }

          @media screen and (max-width: 480px) {
            .check-bonus-tab {
              padding: 8px 12px;
              min-height: 44px;
            }
            .check-bonus-tab .bonus-text {
              font-size: 13px;
            }
            .check-bonus-tab .check-bonus-btn {
              padding: 6px 14px;
              font-size: 13px;
            }
          }

          @media screen and (min-width: 1024px) {
            .check-bonus-tab {
              display: none !important;
            }
          }
        `}</style>

        <CricketBattleComp />
        <NewLaunch />
        <RecomendedGames />
        <LiveCasinoGames />
        <SlotsGame />
      </div>
    </div>
  );
}

export default Home;
