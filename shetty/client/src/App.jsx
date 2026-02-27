import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/reducer/authReducer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/home/Home"));
const Inplay = lazy(() => import("./pages/Inplay/Inplay"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const TrandingGame = lazy(() => import("./components/inplay/TrandingGame"));
const Cricket = lazy(() => import("./pages/Inplay/Cricket"));
const Football = lazy(() => import("./pages/Inplay/Football"));
const Tennis = lazy(() => import("./pages/Inplay/Tennis"));
const PreviewPage1 = lazy(
  () => import("./components/matchPreview/PreviewPage1")
);
const PreviewPage1Football = lazy(
  () => import("./components/matchPreview/PreviewPage1Football")
);
const PreviewPage1Tennis = lazy(
  () => import("./components/matchPreview/PreviewPage1Tennis")
);
const MultiMarkets = lazy(() => import("./pages/mutliMarket/MultiMarkets"));
const MenuHeaderBox = lazy(() => import("./components/menu/MenuHeaderBox"));
const BetsTableRows = lazy(() => import("./components/menu/BetsTableRows"));
const Wallet = lazy(() => import("./components/menu/Wallet"));
const BettingProfitLoss = lazy(() => import("./pages/menu/BettingProfitLoss"));
const TurnoverHistory = lazy(() => import("./pages/menu/Turnover"));
const BonusStatement = lazy(() => import("./pages/menu/BonusSatement"));
const AccountStatement = lazy(() => import("./pages/menu/AccountStatement"));
const DepositTurnover = lazy(() => import("./pages/menu/DepositTurnover"));
const StakeSettings = lazy(() => import("./pages/menu/StakeSettings"));
const MyBet = lazy(() => import("./pages/menu/MyBet")); // lazy import
const MyTransaction = lazy(() => import("./pages/menu/MyTransaction")); // lazy import
const DepositPage = lazy(() => import("./pages/menu/DepositPage"));
const WithdrawPage = lazy(() => import("./pages/menu/WithdrawPage"));
const Casino = lazy(() => import("./pages/casino/Casino"));
const LaunchGame = lazy(() => import("./pages/casino/LaunchGame"));
const SportsGames = lazy(() => import("./pages/sports/SportsGames"));
const MyProfile = lazy(() => import("./pages/profile/MyProfile"));
const Preferences = lazy(() => import("./pages/profile/Preferences"));
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#04a0e2] border-t-transparent" />
    </div>
  );
}

function ProtectedRoute() {
  const isAuth = !!localStorage.getItem("auth");
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      dispatch(getUser());
    }
  }, [dispatch]);

  const sportLayout = (SportComponent) => (
    <div className="py-2 lg:px-2 flex gap-2 items-start">
      <div className="w-full lg:w-3/4 container-bg rounded-xl min-h-[80vh]">
        <SportComponent />
      </div>
      <div className="hidden lg:block w-1/4 container-bg rounded-sm sticky top-2">
        <TrandingGame />
      </div>
    </div>
  );

  const sportLayoutWithOutlet = () => (
    <div className="py-2 lg:px-2 flex gap-2 items-start">
      <div className="w-full lg:w-3/4 container-bg rounded-xl min-h-[80vh]">
        <Outlet />
      </div>
      <div className="hidden lg:block w-1/4 container-bg rounded-sm sticky top-2">
        <TrandingGame />
      </div>
    </div>
  );

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/launch-game/:gameuid" element={<LaunchGame />} />
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="inplay" element={<Inplay />} />
              <Route path="casino" element={<Casino />} />
              <Route path="saba" element={<SportsGames />} />
              <Route path="lucky" element={<SportsGames />} />
              <Route path="bti" element={<SportsGames />} />
              <Route path="multimarkets" element={<MultiMarkets />} />
              <Route path="cricket/preview" element={<PreviewPage1 />} />
              <Route path="cricket" element={sportLayoutWithOutlet()}>
                <Route index element={<Cricket />} />
              </Route>
              <Route
                path="football/preview"
                element={<PreviewPage1Football />}
              />
              <Route path="football" element={sportLayout(Football)} />
              <Route path="tennis/preview" element={<PreviewPage1Tennis />} />
              <Route path="tennis" element={sportLayout(Tennis)} />
              <Route path="my_bets" element={<MyBet />} />
              <Route path="my_wallet" element={<Wallet />} />
              <Route path="pl_statement" element={<BettingProfitLoss />} />
              <Route path="turnover_history" element={<TurnoverHistory />} />
              <Route path="bonus_statement" element={<BonusStatement />} />
              <Route path="account_statement" element={<AccountStatement />} />
              <Route path="deposit_turnover" element={<DepositTurnover />} />
              <Route path="stake_settings" element={<StakeSettings />} />
              <Route path="deposit" element={<DepositPage />} />
              <Route path="withdraw" element={<WithdrawPage />} />
              <Route path="my_transaction" element={<MyTransaction />} />
              <Route path="my_profile" element={<MyProfile />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
