import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiCreditCard,
  FiBriefcase,
  FiFileText,
  FiTrendingUp,
  FiRefreshCw,
  FiRepeat,
  FiList,
  FiSettings,
  FiLock,
  FiUser,
} from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";

const REPORT_ITEMS = [
  { id: "deposit", label: "Deposit", icon: FiCreditCard, path: "/deposit" },
  { id: "withdraw", label: "Withdraw", icon: FiCreditCard, path: "/withdraw" },
  { id: "my_bets", label: "My Bets", icon: FiBriefcase, path: "/my_bets" },
  {
    id: "account_statement",
    label: "Account Statement",
    icon: FiFileText,
    path: "/account_statement",
  },
  {
    id: "pl_statement",
    label: "P/L Statement",
    icon: FiTrendingUp,
    path: "/pl_statement",
  },
  {
    id: "my_transaction",
    label: "My Transactions",
    icon: FiList,
    path: "/my_transaction",
  },
  {
    id: "turnover_history",
    label: "Turnover History",
    icon: FiRefreshCw,
    path: "/turnover_history",
  },
  {
    id: "deposit_turnover",
    label: "Deposit Turnover",
    icon: FiRepeat,
    path: "/deposit_turnover",
  },
  {
    id: "stake_settings",
    label: "Stake Settings",
    icon: FiSettings,
    path: "/stake_settings",
  },
  {
    id: "change_password",
    label: "Change Password",
    icon: FiLock,
    path: "/my_profile",
    state: { tab: "password" },
  },
  {
    id: "my_profile",
    label: "My Profile",
    icon: FiUser,
    path: "/my_profile",
  },
];

function Preferences() {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth?.userInfo);

  const balance = (userInfo?.avbalance ?? 0).toFixed(2);
  const exposure = (userInfo?.exposure ?? 0).toFixed(2);
  const bonus = (userInfo?.bonus ?? 0).toFixed(2);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  return (
    <div className="px-4 py-3 pb-24 space-y-4">
      {/* Top balance cards */}
      <div className="space-y-2">
        <div className="w-full rounded-xl bg-[#01fafe] text-[#0a0d15] px-4 py-3 flex items-center justify-between shadow border border-white border-[1px] h-16">
          <div
            className="text-sm"
            style={{ fontFamily: "Lato, sans-serif", fontWeight: 500 }}
          >
            Available Balance
          </div>
          <div
            className="text-lg font-extrabold "
            style={{ fontFamily: "Lato, sans-serif", fontWeight: 500 }}
          >
            {balance}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded-xl shadow"
            style={{
              background: "#01fafe",
              textAlign: "center",
              color: "#0a0d15",
              border: "1px solid #fff",
              borderRadius: "8px",
              height: "64px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "17px",
            }}
          >
            <span className="text-base font-extrabold leading-tight">
              {exposure}
            </span>
            <span
              className="text-[11px] font-semibold tracking-wide"
              style={{ fontFamily: "Lato, sans-serif", fontWeight: 500 }}
            >
              Exposure Credited
            </span>
          </div>

          <div
            className="rounded-xl shadow"
            style={{
              background: "#01fafe",
              textAlign: "center",
              color: "#0a0d15",
              border: "1px solid #fff",
              borderRadius: "8px",
              height: "64px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "17px",
            }}
          >
            <span className="text-base font-extrabold leading-tight">
              {bonus}
            </span>
            <span
              className="text-[11px] font-semibold tracking-wide"
              style={{ fontFamily: "Lato, sans-serif", fontWeight: 500 }}
            >
              Bonus Rewarded
            </span>
          </div>
        </div>
      </div>

      {/* Reports menu heading */}
      <div className="pt-1">
        <div className="text-center text-xs font-semibold tracking-[0.16em] text-slate-200 uppercase">
          Reports Menu
        </div>
      </div>

      {/* Responsive reports grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {REPORT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path, item.state ? { state: item.state } : {})}
              className="w-full rounded-2xl bg-slate-100 px-3 py-3 flex items-center justify-between shadow hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#01d0e5] flex items-center justify-center text-white">
                  <Icon size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-900 text-left">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl bg-[#00b4c8] py-3 flex items-center justify-center gap-2 text-white font-semibold text-sm shadow hover:bg-[#00a0b2] transition-colors"
        >
          <IoLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Preferences;
