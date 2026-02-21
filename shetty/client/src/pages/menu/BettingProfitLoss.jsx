import React, { useState, useCallback, useEffect, useMemo } from "react";
import MenuHeaderBox from "../../components/menu/MenuHeaderBox";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useDispatch, useSelector } from "react-redux";
import { getProLoss, getCasinoBetHistory } from "../../redux/reducer/betReducer";
const PNL_COLUMNS = [
  { id: "market", label: "MARKET" },
  { id: "startTime", label: "START TIME" },
  { id: "settledTime", label: "SETTLED TIME" },
  { id: "comm", label: "COMM." },
  { id: "netWin", label: "NET WIN" },
];

const STATEMENT_OPTIONS = [
  "Main Profit and Loss",
  "Speed Cash Profit and Loss",
];
const GAMES_OPTIONS = [
  "Sports",
  "Casino",
  "Live",
  "Tennis Game",
  "Soccer Game",
  "Cricket Game",

  "Sportsbook",
  "Preminum",
];
const defaultTo = new Date().toISOString().split("T")[0];
const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const DEFAULT_LIMIT = 20;

function BettingProfitLoss() {
  const [filters, setFilters] = useState({
    statementType: "Main Profit and Loss",
    selectGames: "Sports",
    from: defaultFrom,
    to: defaultTo,
  });
  const dispatch = useDispatch();
  const userId =
    useSelector((state) => state.auth?.userInfo?._id ?? state.auth?.userInfo?.id) ?? null;
  const { proLossHistory, casinoBetHistory, loading } = useSelector(
    (state) => state.bet
  );

  const isCasino = filters.selectGames === "Casino";

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const filterFields = [
    {
      id: "statementType",
      label: "Statement Type",
      type: "select",
      value: filters.statementType,
      options: STATEMENT_OPTIONS,
    },
    {
      id: "selectGames",
      label: "Select Games",
      type: "select",
      value: filters.selectGames,
      options: GAMES_OPTIONS,
    },
    { id: "from", label: "From", type: "date", value: filters.from },
    { id: "to", label: "To", type: "date", value: filters.to },
  ];

  useEffect(() => {
    if (isCasino) {
      if (!userId) return;
      dispatch(
        getCasinoBetHistory({
          userId,
          page: 1,
          limit: DEFAULT_LIMIT,
          startDate: filters.from,
          endDate: filters.to,
        })
      );
      return;
    }
    dispatch(
      getProLoss({
        startDate: filters.from,
        endDate: filters.to,
        limit: 10,
        page: 1,
        gameName: filters.selectGames || undefined,
      })
    );
  }, [dispatch, isCasino, userId, filters.from, filters.to, filters.selectGames]);

  const tableContent = useMemo(() => {
    if (isCasino) {
      return (casinoBetHistory || []).map((item) => ({
        market: item.game_name || item.game_round || "-",
        startTime: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "-",
        settledTime: item.processedAt
          ? new Date(item.processedAt).toLocaleString()
          : item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : "-",
        comm: 0,
        netWin: item.change ?? (item.win_amount - item.bet_amount) ?? 0,
      }));
    }
    return (
      proLossHistory?.map((item) => ({
        market: item.marketName,
        startTime: new Date(item.date).toLocaleString(),
        settledTime: new Date(item.date).toLocaleString(),
        comm: 0,
        netWin: item.myProfit,
      })) || []
    );
  }, [isCasino, casinoBetHistory, proLossHistory]);

  return (
    <MenuHeaderBox
      title="BETTING PROFIT & LOSS"
      icon={
        <TrendingUpIcon
          sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }}
        />
      }
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      tabs={[]}
      tableColumns={PNL_COLUMNS}
      tableContent={tableContent}
      tableEmptyMessage="No records available."
      tableLoading={loading}
    />
  );
}

export default BettingProfitLoss;
