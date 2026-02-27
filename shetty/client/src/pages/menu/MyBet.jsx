import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuHeaderBox from "../../components/menu/MenuHeaderBox";
import ListIcon from "@mui/icons-material/List";
import { getCasinoBetHistory } from "../../redux/reducer/betReducer";

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
  const { casinoBetHistory, loading } = useSelector((state) => state.bet);
  const defaultTo = new Date().toISOString().split("T")[0];
  const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [filters, setFilters] = React.useState({
    from: defaultFrom,
    to: defaultTo,
  });

  useEffect(() => {
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
  }, [dispatch, userId, filters.from, filters.to]);

  const tableRows = useMemo(
    () => mapCasinoBetHistoryToRows(casinoBetHistory),
    [casinoBetHistory]
  );

  const filterFields = [
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
