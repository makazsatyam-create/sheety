import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuHeaderBox from "../../components/menu/MenuHeaderBox";
import HistoryIcon from "@mui/icons-material/History";
import { getBetHistory } from "../../redux/reducer/betReducer";

const PNL_COLUMNS = [
  { id: "eventDate", label: "EVENT DATE" },
  { id: "transactionType", label: "TRANSACTION TYPE" },
  { id: "eventName", label: "Event Name" },
  { id: "marketType", label: "MARKET TYPE" },
  { id: "amount", label: "AMOUNT" },
  { id: "turnoverBalance", label: "TURNOVER BALANCE" },
];

const TRANSACTION_TYPE_OPTIONS = [
  "All",
  "Bet Placement",
  "Bet Settlement",
  "Casino Bet Settlement",
  "Sport Book Bet Settlement",
  "Void Bet Settlement",
];

const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const formatDateTime = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const defaultFrom = formatDate(weekAgo);
const defaultTo = formatDate(today);

function deriveTransactionType(row) {
  const isCasino = (row.betType || row.gameName || "")
    .toString()
    .toLowerCase()
    .includes("casino");
  if (row.status === 0)
    return isCasino ? "Casino Bet Placement" : "Bet Placement";
  if (row.status === 1) return "Void Bet Settlement";
  return isCasino ? "Casino Bet Settlement" : "Sport Book Bet Settlement";
}

function mapBetHistoryToTurnoverRows(betHistory = [], transactionTypeFilter) {
  const rows = [];
  let balance = 0;
  const sorted = [...betHistory].sort(
    (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
  );
  for (const row of sorted) {
    const type = deriveTransactionType(row);
    if (
      transactionTypeFilter &&
      transactionTypeFilter !== "All" &&
      type !== transactionTypeFilter
    )
      continue;
    const stake = Number(row.price) || 0;
    balance += stake;
    rows.push({
      eventDate: formatDateTime(row.date || row.createdAt),
      transactionType: type,
      eventName: row.eventName || "-",
      marketType: row.marketName || row.gameType || "-",
      amount: stake,
      turnoverBalance: balance.toFixed(2),
    });
  }
  return rows;
}

function TurnoverHistory() {
  const dispatch = useDispatch();
  const { betHistory, loading } = useSelector((state) => state.bet);
  const [filters, setFilters] = useState({
    transactionType: "All",
    from: defaultFrom,
    to: defaultTo,
  });

  useEffect(() => {
    const params = { page: 1, limit: 100 };
    if (filters.from && filters.to) {
      params.startDate = filters.from;
      params.endDate = filters.to;
    }
    params.selectedVoid = "settel";
    dispatch(getBetHistory(params));
  }, [dispatch, filters.from, filters.to]);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const filterFields = [
    {
      id: "transactionType",
      label: "Transaction Type",
      type: "select",
      value: filters.transactionType,
      options: TRANSACTION_TYPE_OPTIONS,
    },
    { id: "from", label: "From", type: "date", value: filters.from },
    { id: "to", label: "To", type: "date", value: filters.to },
  ];

  const tableContent = useMemo(
    () =>
      mapBetHistoryToTurnoverRows(betHistory || [], filters.transactionType),
    [betHistory, filters.transactionType]
  );

  return (
    <MenuHeaderBox
      title="TURNOVER HISTORY"
      icon={
        <HistoryIcon sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }} />
      }
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      tabs={[]}
      tableColumns={PNL_COLUMNS}
      tableContent={loading ? null : tableContent}
      tableEmptyMessage={loading ? "Loading..." : "No records available."}
    />
  );
}

export default TurnoverHistory;
