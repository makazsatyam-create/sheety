import React, { useState, useEffect } from "react";
import { Box, Dialog, IconButton, Typography, Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const STAKE_OPTIONS = [
  "100",
  "200",
  "500",
  "1,000",
  "2,000",
  "5,000",
  "10,000",
  "25,000",
];

// Normalize market title to backend gameType for formula selection
function normalizeGameType(marketTitle, isFancy) {
  if (isFancy) return "Fancy";
  const t = (marketTitle || "").trim();
  if (t === "Match Odds" || t === "Tied Match" || t === "Winner") return t;
  const u = t.toUpperCase().replace(/\s+/g, "_");
  if (u === "MATCH_ODDS") return "Match Odds";
  if (u === "TIED_MATCH") return "Tied Match";
  if (["OVER_UNDER_05", "OVER_UNDER_15", "OVER_UNDER_25"].includes(u)) return u;
  if (t === "Bookmaker" || t === "Bookmaker IPL CUP") return t;
  if (t === "Toss" || t === "1st 6 over") return t;
  if (u === "BOOKMAKER_IPL_CUP") return "Bookmaker IPL CUP";
  return "Match Odds"; // default same as Match Odds / Tied Match
}

export default function BetSlipModal({
  open,
  onClose,
  matchName = "Zimbabwe v Oman",
  initialOdd = 1.03,
  variant = "modal",
  leagueTitle = "Cricket Match",
  onClearSelection,
  amount: controlledAmount,
  onAmountChange,
  side = "back",
  onPlaceBet,
  placeBetLoading = false,
  isFancy = false,
  marketTitle = "",
}) {
  const isInline = variant === "inline";
  const [oddValue, setOddValue] = useState(String(initialOdd));
  const [internalAmount, setInternalAmount] = useState("");
  const isControlled =
    controlledAmount !== undefined && typeof onAmountChange === "function";
  const amount = isControlled ? String(controlledAmount || "") : internalAmount;
  const setAmount = isControlled
    ? (v) => {
        const n = Number(String(v).replace(/,/g, "")) || 0;
        onAmountChange(n);
      }
    : setInternalAmount;

  const stake = Number(amount.replace(/,/g, "")) || 0;
  const odd = Number(oddValue) || 0;
  const gameType = normalizeGameType(marketTitle, isFancy);

  // Same formulas as backend betController (gameType switch)
  let profitOrLiability = 0;
  switch (gameType) {
    case "Fancy":
      profitOrLiability =
        side === "back" ? stake * (odd / 100) : stake;
      break;
    case "Match Odds":
    case "Tied Match":
    case "Winner":
    case "OVER_UNDER_05":
    case "OVER_UNDER_15":
    case "OVER_UNDER_25":
    case "Toss":
    case "1st 6 over":
      profitOrLiability = stake * (odd - 1);
      break;
    case "Bookmaker":
    case "Bookmaker IPL CUP":
      profitOrLiability = stake * (odd / 100);
      break;
    default:
      profitOrLiability = stake * (odd - 1);
  }

  const profitLoss =
    side === "lay" ? -profitOrLiability : profitOrLiability;
  const profitLossStr =
    (profitLoss >= 0 ? "+" : "-") + Math.abs(profitLoss).toFixed(2);
  const totalAmount = stake.toFixed(2);

  useEffect(() => {
    if (isInline) {
      setOddValue(String(initialOdd ?? "").trim() || "0");
    } else if (open) {
      setOddValue(String(initialOdd ?? "").trim() || "0");
    }
  }, [open, initialOdd, isInline]);

  const addStake = (value) => {
    const clean = value.replace(/,/g, "");
    const current = Number(amount.replace(/,/g, "")) || 0;
    const next = current + Number(clean);
    setAmount(String(next));
  };

  const handleMinStake = () => setAmount("100");
  const handleMaxStake = () => setAmount("25000");
  const handleEditStake = () => {
    const newAmount = prompt("Enter stake amount:", amount || "0");
    if (newAmount !== null) {
      const num = Number(newAmount.replace(/,/g, "")) || 0;
      setAmount(String(num));
    }
  };
  const handleClear = () => {
    setAmount("");
    if (onAmountChange && isControlled) onAmountChange(0);
  };

  const handleAmountInputChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    setAmount(digitsOnly);
    if (isControlled && digitsOnly === "") onAmountChange(0);
  };

  const handleOddDecrement = () => {
    const num = Number(oddValue) || 0;
    const step = isFancy ? 1 : 0.01;
    const next = Math.max(isFancy ? 1 : 0.01, num - step);
    setOddValue((isFancy ? Math.round(next) : Number(next.toFixed(2))).toString());
  };
  const handleOddIncrement = () => {
    const num = Number(oddValue) || 0;
    const step = isFancy ? 1 : 0.01;
    const next = num + step;
    setOddValue((isFancy ? Math.round(next) : Number(next.toFixed(2))).toString());
  };

  const content = (
    <>
      <div className={`body-ctn ${side === "back" ? "bs-back-bet" : ""}`}>
        <div className="bet-body">
          <div
            className="header-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              fontSize: "14px",
              lineHeight: "20px",
              height: "40px",
              alignItems: "center",
              padding: "0 4px",
              boxSizing: "border-box",
              borderRadius: "10px 10px 0 0",
              background:
                side === "back"
                  ? "#B2D9FF"
                  : side === "lay"
                    ? "#ffc3dc"
                    : "#01fafe",
              borderTop:
                side === "back"
                  ? "2px solid #04a0e2"
                  : side === "lay"
                    ? "2px solid #e91e8c"
                    : "2px solid transparent",
              borderLeft:
                side === "back"
                  ? "2px solid #04a0e2"
                  : side === "lay"
                    ? "2px solid #e91e8c"
                    : "2px solid transparent",
              borderRight:
                side === "back"
                  ? "2px solid #04a0e2"
                  : side === "lay"
                    ? "2px solid #e91e8c"
                    : "2px solid transparent",
              borderBottom: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "50px",
                color: "#000",
              }}
            >
              <Typography
                sx={{
                  lineHeight: "21px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {leagueTitle}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "13.7px",
                  textAlign: "left",
                }}
              >
                {matchName}
              </Typography>
            </div>
            <IconButton
              onClick={isInline ? onClearSelection || (() => {}) : onClose}
              size="small"
              sx={{
                color: "#071123",
                width: "26px",
                height: "26px",
                bgcolor: "#fff",
                borderRadius: "100%",
                marginTop: "5px",
                opacity: 1,
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.2)" },
              }}
            >
              <CloseIcon
                fontSize="small"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "inherit",
                  alignItems: "inherit",
                }}
              />
            </IconButton>
          </div>

          <div className="bet-card">
            <div
              className="input-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "4px",
                width: "100%",
              }}
            >
              <div className="input-row-ctn odds-ctn">
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    fontStyle: "normal",
                    lineHeight: "19px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#fff",
                    mb: "3px",
                  }}
                >
                  Odd Value
                </Typography>
                <div
                  className="row-input"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#071123",
                    borderRadius: "100px",
                    height: "30px",
                  }}
                >
                  <Button
                    size="small"
                    onClick={handleOddDecrement}
                    sx={{
                      maxWidth: "24px",
                      minWidth: "24px",
                      height: "24px",
                      padding: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: 500,
                      margin: "2.5px",
                      color: "#fff",
                      bgcolor: "#01fafe",
                      border: "2px solid #04a0e2",
                      borderRadius: "100%",
                      "&:hover": { bgcolor: "#22f3ff" },
                    }}
                    aria-label="Decrement odds"
                  >
                    −
                  </Button>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      px: 1,
                      color: "#fff",
                    }}
                  >
                    <Typography
                      sx={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}
                    >
                      {oddValue}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={handleOddIncrement}
                    sx={{
                      maxWidth: "24px",
                      minWidth: "24px",
                      height: "24px",
                      padding: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: 500,
                      margin: "2.5px",
                      color: "#fff",
                      bgcolor: "#01fafe",
                      border: "2px solid #04a0e2",
                      borderRadius: "100%",
                      "&:hover": { bgcolor: "#22f3ff" },
                    }}
                    aria-label="Increment odds"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="input-row-ctn stake-ctn">
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "10px",
                    lineHeight: "19px",
                    textAlign: "end",
                    fontWeight: 500,
                  }}
                >
                  Amount
                </Typography>
                <TextField
                  size="small"
                  placeholder="0"
                  value={amount}
                  onChange={handleAmountInputChange}
                  onFocus={(e) => e.target.select()}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    "aria-label": "Stake amount",
                    style: {
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 10px",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#071123",
                      borderRadius: "100px",
                      height: "30px",
                      "& fieldset": { border: "1px solid rgba(4, 160, 226, 0.4)" },
                      "&:hover fieldset": { borderColor: "rgba(4, 160, 226, 0.7)" },
                      "&.Mui-focused fieldset": { borderColor: "#04a0e2", borderWidth: "1px" },
                    },
                    "& .MuiOutlinedInput-input": { color: "#fff" },
                  }}
                />
              </div>
            </div>

            <div className="quick-bet">
              {["100", "200", "500", "1,000"].map((label) => (
                <Button
                  key={label}
                  className="qb-btn"
                  onClick={() => addStake(label)}
                  size="small"
                  sx={{
                    width: "100%",
                    display: "inherit",
                    alignItems: "inherit",
                    justifyContent: "inherit",
                    textTransform: "capitalize",
                  }}
                >
                  +{label}
                </Button>
              ))}
              {["2,000", "5,000", "10,000", "25,000"].map((label) => (
                <Button
                  key={label}
                  className="qb-btn"
                  onClick={() => addStake(label)}
                  size="small"
                  sx={{
                    width: "100%",
                    display: "inherit",
                    alignItems: "inherit",
                    justifyContent: "inherit",
                    textTransform: "capitalize",
                  }}
                >
                  +{label}
                </Button>
              ))}
              <Button
                className="qb-btn"
                onClick={handleMinStake}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#facc15",
                  color: "#000",
                  border: "2px solid #e6b800",
                  "&:hover": { bgcolor: "#fde047" },
                }}
              >
                MIN STAKE
              </Button>
              <Button
                className="qb-btn"
                onClick={handleMaxStake}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#0235ac",
                  color: "#fff",
                  border: "2px solid #022a7a",
                  "&:hover": { bgcolor: "#0347d4" },
                }}
              >
                MAX STAKE
              </Button>
              <Button
                className="qb-btn"
                onClick={handleEditStake}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#018234",
                  color: "#fff",
                  border: "2px solid #016328",
                  "&:hover": { bgcolor: "#02a347" },
                }}
              >
                EDIT STAKE
              </Button>
              <Button
                className="qb-btn"
                onClick={handleClear}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#ff0000",
                  color: "#fff",
                  border: "2px solid #cc0000",
                  "&:hover": { bgcolor: "#ff3333" },
                }}
              >
                CLEAR
              </Button>
            </div>

            <div
              className="d-flex-row"
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: "1px solid #374151",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                className="profit-loss"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  className="info"
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    lineHeight: "13.5px",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  Your profit/loss as per placed bet
                </Typography>
                <div className="returns">
                  <Typography
                    component="span"
                    sx={{
                      color: "#18a21e",
                      lineHeight: "16px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {profitLossStr}
                  </Typography>
                </div>
              </div>

              <div
                className="profit-loss-pts"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  className="info"
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    lineHeight: "13.5px",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  Total Amount (in PTS)
                </Typography>
                <div className="returns">
                  <span className="amt">
                    <Typography
                      sx={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}
                    >
                      {totalAmount}
                    </Typography>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isInline && (
        <div className="bet-footer">
          <div className="place-section">
            <Button
              className="place-btn"
              fullWidth
              disabled={placeBetLoading || stake <= 0}
              onClick={() => onPlaceBet?.({ odd: Number(oddValue) || 0, amount: stake, side })}
            >
              {placeBetLoading ? "PLACING…" : "PLACE BET"}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  if (isInline) {
    return (
      <div
        className="exch-betslip-ctn inline-slip"
        style={{
          background: "var(--background-ctn-gradient, #0e2239)",
          overflow: "hidden",
          borderRadius: "10px",
          border:
            side === "back"
              ? "2px solid #B2D9FF"
              : side === "lay"
                ? "2px solid #ffc3dc"
                : "2px solid rgba(4, 160, 226, 0.5)",
          width: "100%",
          minHeight: "180px",
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#0e2239",
          borderRadius: 20,
          minWidth: 280,
          maxWidth: 320,
          p: 0,
          overflow: "hidden",
          height: "auto",
          minHeight: "180px",
        },
      }}
    >
      {content}
    </Dialog>
  );
}
