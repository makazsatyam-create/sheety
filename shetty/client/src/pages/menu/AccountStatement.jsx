import React, { useState, useEffect, useCallback } from "react";
import MenuHeaderBox from "../../components/menu/MenuHeaderBox";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistory } from "../../redux/reducer/betReducer";

const PNL_COLUMNS = [
  { id: "sno", label: "SNO" },
  { id: "date", label: "DATE" },
  { id: "credit", label: "CREDIT" },
  { id: "debit", label: "DEBIT" },
  { id: "balance", label: "BALANCE" },
  { id: "transactionId", label: "TRANSACTION ID" },
  { id: "sports", label: "SPORTS" },
  { id: "remark", label: "REMARK" },
];
const TRANSACTION_TYPE_OPTIONS = [
  "All",
  "Deposit",
  "Withdraw",
  "Settlement Deposit",
  "Settlement Withdraw",
  "Bet Settlement",
  "Casino Bets",
  "Rollback",
  "Voided",
  "Bonus Redeemed",
  "Bonus Rollback",
  "Refund",
];
const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

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
function AccountStatement() {
  const dispatch = useDispatch();
  const { transHistory, loading } = useSelector((state) => state.bet);
  const [filters, setFilters] = useState({
    transactionType: "All",
    from: defaultFrom,
    to: defaultTo,
  });
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
      credit: item.deposite,
      debit: item.withdrawl,
      balance: item.amount,
      transactionId: item.from || "-",
      sports: item.sports || "-",
      remark: item.remark || "-",
    })) || [];
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

  return (
    <MenuHeaderBox
      title="Account Statement"
      icon={
        <AccountBalanceIcon
          sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }}
        />
      }
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      tabs={[]}
      tableColumns={PNL_COLUMNS}
      tableContent={tableContent}
      tableEmptyMessage="No data Found."
      loading={loading}
    />
  );
}

export default AccountStatement;
