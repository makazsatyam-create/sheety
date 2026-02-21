import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuHeaderBox from "../../components/menu/MenuHeaderBox";
import BetsTableRows from "../../components/menu/BetsTableRows";
import ListIcon from "@mui/icons-material/List";
import { getBetHistory, getCasinoBetHistory } from "../../redux/reducer/betReducer";

const DEFAULT_LIMIT = 20;
const PNL_COLUMNS = [
  { id: "placeDate", label: "DATE" },
  { id: "eventName", label: "EVENT" },
  { id: "market", label: "MARKET" },
  { id: "betOn", label: "SELECTION" },
  { id: "betType", label: "TYPE" },
  { id: "odds", label: "ODDS", align: "right" },
  { id: "amount", label: "STAKE", align: "right" },
  { id: "result", label: "STATUS" },
  { id: "winnings", label: "PAYOUT", align: "right" },
];

function formatDate(d) {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusToResult(status) {
  switch (status) {
    case 0:
      return "Open"; // Unsettled
    case 1:
      return "Won"; // Settled & Won
    case 2:
      return "Lost"; // Settled & Lost
    case 3:
      return "Void"; // Void
    default:
      return "-";
  }
}

function mapBetHistoryToRows(betHistory = [], currentBetStatus) {
  const isVoidFilter = currentBetStatus === "Void";
  return betHistory.map((row) => ({
    id: row._id || row.betId || row.id,
    placeDate: formatDate(row.date),
    eventName: row.eventName || "-",
    market: row.marketName || "-",
    betOn: row.teamName || "-",
    betType: (() => {
      const raw = (row.betType || row.otype || "").toString().toLowerCase();
      if (raw === "back") return "Back";
      if (raw === "lay") return "Lay";
      return row.betType || row.otype || "-";
    })(),
    odds: row.xValue,
    amount: row.price,
    result: statusToResult(row.status, isVoidFilter),
    winnings: row.profitLossChange,
  }));
}

function mapCasinoBetHistoryToRows(casinoBetHistory = []) {
  return casinoBetHistory.map((row) => ({
    id: row._id || row.game_round || row.id,
    placeDate: formatDate(row.createdAt),
    eventName: row.game_name || "-",
    market: row.game_round || "-",
    betOn: row.game_name || "-",
    betType: "Casino",
    odds: "-",
    amount: row.bet_amount,
    result: row.change > 0 ? "Won" : row.change < 0 ? "Lost" : "Open",
    winnings: row.win_amount ?? row.change,
  }));
}

function MyBets() {
  const dispatch = useDispatch();
  const userId =
    useSelector((state) => state.auth?.userInfo?._id ?? state.auth?.userInfo?.id) ?? null;
  const {
    betHistory,
    casinoBetHistory,
    loading,
    pagination,
    casinoPagination,
  } = useSelector((state) => state.bet);
  const defaultTo = new Date().toISOString().split("T")[0];
  const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [filters, setFilters] = React.useState({
    betStatus: "Open",
    selectGames: "Cricket Game",
    from: defaultFrom,
    to: defaultTo,
  });

  const isCasino = filters.selectGames === "Casino";

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

    const params = {
      page: 1,
      limit: DEFAULT_LIMIT,
    };
    if (filters.from && filters.to) {
      params.startDate = filters.from;
      params.endDate = filters.to;
    }
    // Map UI option -> API selectedVoid (so Open/Void/Settled show correctly)
    if (filters.betStatus === "Settled") params.selectedVoid = "settel";
    else if (filters.betStatus === "Void") params.selectedVoid = "void";
    else params.selectedVoid = "unsettle"; // Open
    if (filters.selectGames) params.selectedGame = filters.selectGames;

    dispatch(getBetHistory(params));
  }, [
    dispatch,
    isCasino,
    userId,
    filters.betStatus,
    filters.selectGames,
    filters.from,
    filters.to,
  ]);

  const tableRows = useMemo(() => {
    if (isCasino) {
      return mapCasinoBetHistoryToRows(casinoBetHistory);
    }
    // First filter out any bets that shouldn't be shown when filter is Void
    let filteredBets = betHistory;
    if (filters.betStatus === "Void") {
      filteredBets = betHistory.filter((bet) => bet.status === 2);
    }
    return mapBetHistoryToRows(filteredBets);
  }, [isCasino, casinoBetHistory, betHistory, filters.betStatus]);

  const filterFields = [
    {
      id: "betStatus",
      label: "Bet Status",
      type: "select",
      value: filters.betStatus,
      options: ["Open", "Settled", "Void"],
    },
    {
      id: "selectGames",
      label: "Select Games",
      type: "select",
      value: filters.selectGames,
      options: ["Casino", "Live", "Tennis Game", "Cricket Game", "Soccer Game"],
    },
    { id: "from", label: "From", type: "date", value: filters.from },
    { id: "to", label: "To", type: "date", value: filters.to },
  ];

  const handleFilterChange = (id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <MenuHeaderBox
      title="MY BETS"
      icon={
        <ListIcon sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }} />
      }
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      tableContent={tableRows} // <-- pass the array
      tableColumns={PNL_COLUMNS} // optional, if you have column definitions
      tableEmptyMessage="No bets found."
      tableLoading={loading}
    />
  );
}

export default MyBets;
