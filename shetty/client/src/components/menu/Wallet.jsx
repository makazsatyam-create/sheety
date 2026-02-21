import React, { useState, useEffect } from "react";
import MenuHeaderBox from "./MenuHeaderBox";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistory } from "../../redux/reducer/betReducer";
import { getUser } from "../../redux/reducer/authReducer";
const WALLET_TABLE_COLUMNS = [
  { id: "date", label: "DATE", sortable: true },
  { id: "transaction", label: "TRANSACTION" },
  { id: "creditDebit", label: "CREDIT/DEBIT" },
  { id: "balance", label: "BALANCE", sortable: true },
  { id: "description", label: "DESCRIPTION" },
];
const walletFilterStyle = {
  margin: "10px 5px",
  padding: "5px 15px",
  color: "#01fafe",
  borderRadius: "20px",
  textTransform: "capitalize",
  width: "auto",
  fontWeight: 600,
  fontSize: "10px",
  letterSpacing: "2px",
};
const defaultTo = new Date().toISOString().split("T")[0];
const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];
function formatDate(d) {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function Wallet() {
  const dispatch = useDispatch();
  const { transHistory, loading } = useSelector((state) => state.bet);
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const availableBalance = (userInfo?.avbalance ?? 0).toFixed(2);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const [dateRange, setDateRange] = useState({
    from: defaultFrom,
    to: defaultTo,
  });
  const [filters, setFilters] = useState({
    transactionType: "All",
    from: defaultFrom,
    to: defaultTo,
  });
  const handleFilterChange = (id, value) => {
    setDateRange((prev) => ({ ...prev, [id]: value }));
  };
  useEffect(() => {
    dispatch(
      getTransactionHistory({
        startDate: filters.from,
        endDate: filters.to,
        limit: 10,
        page: 1,
      })
    );
  }, [dispatch, filters]);
  const tableContent =
    transHistory?.map((item, index) => ({
      sno: index + 1,
      date: formatDate(item.date),
      transaction:
        item.deposite > 0 ? "Credit" : item.withdrawl > 0 ? "Debit" : "-", // For TRANSACTION column
      creditDebit:
        item.deposite > 0
          ? `+${item.deposite.toLocaleString()}`
          : item.withdrawl > 0
            ? `-${item.withdrawl.toLocaleString()}`
            : "-", // For CREDIT/DEBIT column
      balance: item.amount?.toLocaleString() || "-",
      description: item.remark || "-",
    })) || [];
  return (
    <MenuHeaderBox
      title="MY WALLET"
      icon={
        <AccountBalanceWalletOutlinedIcon
          sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }}
        />
      }
      balanceLabel="AVAILABLE BALANCE"
      balanceValue={availableBalance}
      filterFields={[
        { id: "from", label: "From", type: "date", value: dateRange.from },
        { id: "to", label: "To", type: "date", value: dateRange.to },
      ]}
      filterFieldBoxSx={walletFilterStyle}
      onFilterChange={handleFilterChange}
      tabs={[]}
      tableContent={tableContent}
      tableColumns={WALLET_TABLE_COLUMNS}
      tableEmptyMessage="You don't have any transactions"
      loading={loading}
    />
  );
}

export default Wallet;
