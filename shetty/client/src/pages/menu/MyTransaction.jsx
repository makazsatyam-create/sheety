import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuHeaderBox from "../../components/menu/MenuHeaderBox";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Button } from "@mui/material";
import {
  getBetHistory,
  getDepositHistory,
  getWithdrawalHistory,
  getDepositRequests,
  getWithdrawalRequests,
  cancelDepositRequest,
  cancelWithdrawalRequest,
} from "../../redux/reducer/betReducer";

const PNL_COLUMNS = [
  { id: "transactionTime", label: "TRANSACTION TIME" },
  { id: "transactionId", label: "TRANSACTION ID" },
  { id: "transactionType", label: "TRANSACTION TYPE" },
  { id: "amount", label: "AMOUNT" },
  { id: "approvedAmount", label: "APPROVED AMOUNT" },
  { id: "transactionStatus", label: "TRANSACTION STATUS" },
  { id: "notes", label: "NOTES" },
  { id: "paymentMode", label: "PAYMENT MODE" },
  { id: "action", label: "ACTION" },
];

const TRANSACTION_TYPE_OPTIONS = ["All", "Deposit", "Withdraw"];
const TRANSACTION_STATUS_OPTIONS = [
  "All",
  "Approval Pending",
  "In Progress",
  "Initiated",
  "Approved",
  "Rejected",
  "Succeeded",
  "Failed",
  "Abandoned",
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

function MyTransaction() {
  const dispatch = useDispatch();
  const {
    betHistory,
    depositHistory,
    withdrawalHistory,
    depositRequests,
    withdrawalRequests,
    loading,
  } = useSelector((state) => state.bet);
  const [filters, setFilters] = useState({
    transactionType: "All",
    transactionStatus: "All",
    from: defaultFrom,
    to: defaultTo,
  });

  // Fetch all transaction data
  useEffect(() => {
    const params = { page: 1, limit: 100 };
    if (filters.from && filters.to) {
      params.startDate = filters.from;
      params.endDate = filters.to;
    }
    params.selectedVoid = "settel";
    dispatch(getBetHistory(params));
    dispatch(getDepositHistory(params));
    dispatch(getWithdrawalHistory(params));
    dispatch(getDepositRequests(params));
    dispatch(getWithdrawalRequests(params));
  }, [dispatch, filters.from, filters.to]);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleCancelRequest = useCallback(
    async (type, requestId) => {
      if (window.confirm(`Are you sure you want to cancel this ${type} request?`)) {
        if (type === "deposit") {
          await dispatch(cancelDepositRequest(requestId));
        } else {
          await dispatch(cancelWithdrawalRequest(requestId));
        }
        // Refresh requests after cancellation
        const params = { page: 1, limit: 100 };
        if (filters.from && filters.to) {
          params.startDate = filters.from;
          params.endDate = filters.to;
        }
        dispatch(getDepositRequests(params));
        dispatch(getWithdrawalRequests(params));
      }
    },
    [dispatch, filters.from, filters.to]
  );

  const filterFields = [
    {
      id: "transactionType",
      label: "Transaction Type",
      type: "select",
      value: filters.transactionType,
      options: TRANSACTION_TYPE_OPTIONS,
    },
    {
      id: "transactionStatus",
      label: "Transaction Status",
      type: "select",
      value: filters.transactionStatus,
      options: TRANSACTION_STATUS_OPTIONS,
    },
    { id: "from", label: "From", type: "date", value: filters.from },
    { id: "to", label: "To", type: "date", value: filters.to },
  ];

  // Map deposit/withdrawal history and requests to table rows
  const mapTransactionsToRows = useMemo(() => {
    const rows = [];
    const seenIds = new Set(); // Track seen transaction IDs to avoid duplicates

    // Process requests first (they have more detailed status information)
    // Add deposit requests
    if (depositRequests && depositRequests.length > 0) {
      depositRequests.forEach((request) => {
        if (
          filters.transactionType === "All" ||
          filters.transactionType === "Deposit"
        ) {
          const statusMap = {
            pending: "Initiated",
            approved: "Approved",
            rejected: "Rejected",
            abandoned: "Abandoned",
          };
          const status = statusMap[request.status] || request.status;

          if (
            filters.transactionStatus === "All" ||
            filters.transactionStatus === status ||
            (filters.transactionStatus === "Initiated" && request.status === "pending")
          ) {
            const rowId = request._id;
            if (!seenIds.has(rowId)) {
              seenIds.add(rowId);
              rows.push({
                transactionTime: formatDateTime(request.createdAt),
                transactionId: request._id,
                transactionType: "Deposit",
                amount: Number(request.amount).toFixed(2),
                approvedAmount: request.status === "approved" ? Number(request.amount).toFixed(2) : "-",
                transactionStatus: status,
                notes: request.remark || "-",
                paymentMode: request.paymentType || "-",
                action:
                  request.status === "pending" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleCancelRequest("deposit", request._id)}
                      sx={{
                        backgroundColor: "#ff4444",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#cc0000" },
                        textTransform: "none",
                        fontSize: "12px",
                        padding: "4px 12px",
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    "-"
                  ),
              });
            }
          }
        }
      });
    }

    // Add withdrawal requests
    if (withdrawalRequests && withdrawalRequests.length > 0) {
      withdrawalRequests.forEach((request) => {
        if (
          filters.transactionType === "All" ||
          filters.transactionType === "Withdraw"
        ) {
          const statusMap = {
            pending: "Initiated",
            approved: "Approved",
            rejected: "Rejected",
            abandoned: "Abandoned",
          };
          const status = statusMap[request.status] || request.status;

          if (
            filters.transactionStatus === "All" ||
            filters.transactionStatus === status ||
            (filters.transactionStatus === "Initiated" && request.status === "pending")
          ) {
            const rowId = request._id;
            if (!seenIds.has(rowId)) {
              seenIds.add(rowId);
              rows.push({
                transactionTime: formatDateTime(request.createdAt),
                transactionId: request._id,
                transactionType: "Withdraw",
                amount: Number(request.amount).toFixed(2),
                approvedAmount: request.status === "approved" ? Number(request.amount).toFixed(2) : "-",
                transactionStatus: status,
                notes: request.remark || "-",
                paymentMode: request.paymentType || "-",
                action:
                  request.status === "pending" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleCancelRequest("withdrawal", request._id)}
                      sx={{
                        backgroundColor: "#ff4444",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#cc0000" },
                        textTransform: "none",
                        fontSize: "12px",
                        padding: "4px 12px",
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    "-"
                  ),
              });
            }
          }
        }
      });
    }

    // Add deposit history (only show entries that don't correspond to existing requests)
    // History entries are created when requests are approved, so we skip them if a request exists
    if (depositHistory && depositHistory.length > 0) {
      depositHistory.forEach((deposit) => {
        if (
          filters.transactionType === "All" ||
          filters.transactionType === "Deposit"
        ) {
          if (
            filters.transactionStatus === "All" ||
            filters.transactionStatus === "Succeeded"
          ) {
            const rowId = deposit._id;
            // Check if there's a matching approved request (same amount and similar time)
            const hasMatchingRequest = depositRequests?.some(
              (req) =>
                req.status === "approved" &&
                req.amount === deposit.amount &&
                Math.abs(new Date(req.createdAt) - new Date(deposit.createdAt)) < 60000 // Within 1 minute
            );

            // Only add history entry if no matching request exists and not already seen
            if (!hasMatchingRequest && !seenIds.has(rowId)) {
              seenIds.add(rowId);
              rows.push({
                transactionTime: formatDateTime(deposit.createdAt),
                transactionId: deposit._id,
                transactionType: "Deposit",
                amount: Number(deposit.amount).toFixed(2),
                approvedAmount: Number(deposit.amount).toFixed(2),
                transactionStatus: "Succeeded",
                notes: deposit.remark || "-",
                paymentMode: "-",
                action: "-",
              });
            }
          }
        }
      });
    }

    // Add withdrawal history (only show entries that don't correspond to existing requests)
    if (withdrawalHistory && withdrawalHistory.length > 0) {
      withdrawalHistory.forEach((withdrawal) => {
        if (
          filters.transactionType === "All" ||
          filters.transactionType === "Withdraw"
        ) {
          if (
            filters.transactionStatus === "All" ||
            filters.transactionStatus === "Succeeded"
          ) {
            const rowId = withdrawal._id;
            // Check if there's a matching approved request (same amount and similar time)
            const hasMatchingRequest = withdrawalRequests?.some(
              (req) =>
                req.status === "approved" &&
                req.amount === withdrawal.amount &&
                Math.abs(new Date(req.createdAt) - new Date(withdrawal.createdAt)) < 60000 // Within 1 minute
            );

            // Only add history entry if no matching request exists and not already seen
            if (!hasMatchingRequest && !seenIds.has(rowId)) {
              seenIds.add(rowId);
              rows.push({
                transactionTime: formatDateTime(withdrawal.createdAt),
                transactionId: withdrawal._id,
                transactionType: "Withdraw",
                amount: Number(withdrawal.amount).toFixed(2),
                approvedAmount: Number(withdrawal.amount).toFixed(2),
                transactionStatus: "Succeeded",
                notes: withdrawal.remark || "-",
                paymentMode: "-",
                action: "-",
              });
            }
          }
        }
      });
    }

    // Sort by transaction time (most recent first)
    return rows.sort(
      (a, b) =>
        new Date(b.transactionTime) - new Date(a.transactionTime)
    );
  }, [
    depositHistory,
    withdrawalHistory,
    depositRequests,
    withdrawalRequests,
    filters.transactionType,
    filters.transactionStatus,
    handleCancelRequest,
  ]);

  const tableContent = useMemo(() => {
    // Transform bet history rows to match transaction table structure
    const betRows = (betHistory || []).map((bet) => {
      const type = deriveTransactionType(bet);
      // Only include bet rows if they match the transaction type filter
      if (
        filters.transactionType &&
        filters.transactionType !== "All" &&
        type !== filters.transactionType
      ) {
        return null;
      }
      return {
        transactionTime: formatDateTime(bet.date || bet.createdAt),
        transactionId: bet._id || "-",
        transactionType: type,
        amount: (Number(bet.price) || 0).toFixed(2),
        approvedAmount: (Number(bet.price) || 0).toFixed(2),
        transactionStatus: bet.status === 0 ? "Pending" : "Succeeded",
        notes: bet.eventName || "-",
        paymentMode: bet.marketName || bet.gameType || "-",
        action: "-",
      };
    }).filter(Boolean);

    const transactionRows = mapTransactionsToRows;
    return [...transactionRows, ...betRows];
  }, [betHistory, filters.transactionType, mapTransactionsToRows]);

  return (
    <MenuHeaderBox
      title="My Transactions"
      icon={
        <ReceiptLongIcon
          sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }}
        />
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

export default MyTransaction;
