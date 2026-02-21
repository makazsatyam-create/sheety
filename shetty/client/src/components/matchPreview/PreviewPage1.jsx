import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import BlockIcon from "@mui/icons-material/Block";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import PushPinIcon from "@mui/icons-material/PushPin";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  fetchCricketBatingData,
  setSelectedMatch,
} from "../../redux/reducer/cricketSlice";
import {
  createBet,
  createfancyBet,
  getPendingBetAmo,
  messageClear,
} from "../../redux/reducer/betReducer";

import FancyComponent from "./FancyComponent";
import BetSlipModal from "./BetSlipModal";
import { trandinggames } from "../inplay/TrandingGame";
import { useSelector, useDispatch } from "react-redux";
import { wsService } from "../../services/WebsocketService";
const matchData = {
  matchInfo: {
    time: "0 1 : 0 0 P M",
    date: "03 Feb 2026",
    teams: "India U19 v Pakistan U19",
  },
  marketOdds: [
    {
      team: "India U19",
      back: [
        { price: "1.46", amount: "11220K" },
        { price: "1.45", amount: "9800K" },
        { price: "1.44", amount: "8700K" },
      ],
      lay: [
        { price: "1.47", amount: "10100K" },
        { price: "1.48", amount: "9300K" },
        { price: "1.49", amount: "8600K" },
      ],
    },
    {
      team: "Pakistan U19",
      back: [
        { price: "-", amount: "-" },
        { price: "-", amount: "-" },
        { price: "-", amount: "-" },
      ],
      lay: [
        { price: "-", amount: "-" },
        { price: "-", amount: "-" },
        { price: "-", amount: "-" },
      ],
    },
  ],
  bookmakerOdds: [
    {
      team: "India U19",
      back: [{ price: "65", amount: "200K" }],
      lay: [{ price: "70", amount: "200K" }],
    },
    {
      team: "Pakistan U19",
      back: [{ price: "141", amount: "200K" }],
      lay: [{ price: "154", amount: "200K" }],
    },
  ],
  tossOdds: [
    {
      team: "India U19",
      back: [{ price: "65", amount: "200K" }],
      lay: [{ price: "70", amount: "200K" }],
    },
    {
      team: "Pakistan U19",
      back: [{ price: "65", amount: "200K" }],
      lay: [{ price: "70", amount: "200K" }],
    },
  ],
};

const HeaderBox = ({ children, ...props }) => (
  <Box
    sx={{
      background: "#008c95",
      borderRadius: "999px",
      border: "1px solid #04a0e2",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 1,
      py: 0.5,
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

const OddsBox = ({
  price,
  amount,
  bgColor = "#B2D9FF",
  locked = false,
  lockType,
}) => {
  const isLocked = locked || price === "-";
  const lockLabel =
    isLocked && lockType === "suspended" ? "Suspended" : "Ball running";
  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        borderRadius: "14px",
        px: { xs: 0.5, sm: 0.8 },
        py: 0.25,
        minWidth: { xs: 36, sm: 50 },
        textAlign: "center",
        lineHeight: 1.15,
        display: "flex",
        flexDirection: "column",
        gap: 0.1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLocked ? (
        <Typography
          fontSize={9}
          fontWeight={700}
          sx={{ lineHeight: 1.15, margin: 0, color: "#fff" }}
        >
          {lockLabel}
        </Typography>
      ) : (
        <>
          <Typography
            fontSize={12}
            fontWeight={800}
            sx={{ lineHeight: 1.15, margin: 0 }}
          >
            {price}
          </Typography>
          <Typography
            fontSize={9}
            opacity={0.8}
            sx={{ lineHeight: 1.15, margin: 0 }}
          >
            {amount}
          </Typography>
        </>
      )}
    </Box>
  );
};

const ScrollingAnnouncement = ({ text }) => (
  <Box
    sx={{
      backgroundColor: "#31425F",
      borderRadius: 5,
      overflow: "hidden",
      whiteSpace: "nowrap",
      px: { xs: 1, sm: 2 },
      py: 1,
    }}
  >
    <Typography
      sx={{
        display: "inline-block",
        color: "#01fafe",
        fontSize: { xs: 11, sm: 13 },
        fontWeight: 700,
        animation: "marquee 12s linear infinite",
        "@keyframes marquee": {
          "0%": { transform: "translateX(100%)" },
          "80%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      }}
    >
      {text}
    </Typography>
  </Box>
);
function toBackendGameType(uiMarketTitle) {
  const normalized = (uiMarketTitle || "").toUpperCase().replace(/\s+/g, "_");
  const map = {
    MATCH_ODDS: "Match Odds",
    TIED_MATCH: "Tied Match",
  };
  return map[normalized] ?? uiMarketTitle ?? "Market";
}

function MarketSection({
  title,
  data,
  columns,
  limits,
  cashout,
  onOddsClick,
  onSettingsClick,
  isPinned = false,
  footerText,
  selectedBet,
  slipAmount,
  marketRowIndex,
  pendingBets = [],
  mobileSlipContent,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isThisMarket =
    marketRowIndex != null &&
    selectedBet?.marketRowIndex !== undefined &&
    selectedBet?.marketRowIndex !== null
      ? selectedBet.marketRowIndex === marketRowIndex
      : selectedBet?.marketTitle &&
        title &&
        String(selectedBet.marketTitle).trim() === String(title).trim();
  const stake = Number(slipAmount) || 0;
  const odd = Number(selectedBet?.odd) || 0;
  const side = (selectedBet?.side || "back").toLowerCase();
  const selectedTeam = selectedBet?.team?.trim() || "";

  const getRowOutcome = (rowTeam) => {
    if (!isThisMarket || stake <= 0 || !selectedTeam) return null;
    const rowTeamNorm = String(rowTeam || "").trim();
    const selectedNorm = selectedTeam.toLowerCase();
    const isSelected = rowTeamNorm.toLowerCase() === selectedNorm;
    const isBookmaker =
      (title || "").toLowerCase().includes("bookmaker") ||
      (selectedBet?.marketTitle || "").toLowerCase().includes("bookmaker");
    const profitOrLiability =
      odd >= 1
        ? isBookmaker
          ? stake * (odd / 100)
          : stake * (odd - 1)
        : 0;
    if (isSelected) {
      if (side === "back")
        return {
          type: "profit",
          value: profitOrLiability,
          label: "+" + profitOrLiability.toFixed(2),
        };
      return {
        type: "liability",
        value: -profitOrLiability,
        label: "-" + profitOrLiability.toFixed(2),
      };
    }
    if (side === "back")
      return { type: "loss", value: stake, label: "-" + stake.toFixed(2) };
    return {
      type: "profitIfWins",
      value: stake,
      label: "+" + stake.toFixed(2),
    };
  };

  return (
    <Box sx={{ mt: 1.5, backgroundColor: "#1C2D40", borderRadius: 5 }}>
      {/* HEADER */}
      <Box
        sx={{
          backgroundColor: "#071123",
          borderRadius: "18px",
          border: "1px solid #04a0e2",
          fontSize: { xs: "12px", sm: "inherit" },
          p: { xs: "2.4px 12px 2.4px 6px", sm: "4px 12px" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            size="small"
            onClick={(e) => onSettingsClick?.(e, title, data, limits)}
            sx={{ color: "#fff" }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
          {isPinned && <PushPinIcon sx={{ color: "#fff", fontSize: 14 }} />}
          <Typography fontWeight={800} color="#fff" fontSize={13}>
            {title}
          </Typography>
          {cashout !== null && (
            <Box sx={{ bgcolor: "#b91c1c", px: 1, borderRadius: 10 }}>
              <Typography fontSize={11} color="#fff">
                Cashout:{cashout}
              </Typography>
            </Box>
          )}
        </Stack>
        {limits && (
          <Box
            sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
          >
            {isMobile ? (
              <Stack direction="column" alignItems="flex-end" spacing={0}>
                <Typography fontSize={11} color="#fff">
                  MIN: {limits.min}
                </Typography>
                <Typography fontSize={11} color="#fff">
                  MAX: {limits.max}
                </Typography>
              </Stack>
            ) : (
              <Typography fontSize={11} color="#fff">
                MIN: {limits.min} &nbsp; MAX: {limits.max}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* TABLE: headers and values - Back/Lay columns shrink to content to avoid extra space */}
      <TableContainer sx={{ width: "100%", px: 1, pb: 1 }}>
        <Table
          size="small"
          sx={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 6px",
            "& .MuiTableCell-root": { border: "none", fontSize: 12 },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                "& th": { borderBottom: "1px solid rgba(4, 160, 226, 0.5)" },
              }}
            >
              <TableCell sx={{ fontWeight: 700, color: "#fff" }}>
                Market
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  width: "1%",
                  whiteSpace: "nowrap",
                }}
              >
                Back
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  width: "1%",
                  whiteSpace: "nowrap",
                }}
              >
                Lay
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => {
              const backOdds = isMobile ? row.back.slice(-1) : row.back;
              const layOdds = isMobile ? row.lay.slice(0, 1) : row.lay;
              const isLocked =
                row.locked ??
                (backOdds[0]?.price === "-" && layOdds[0]?.price === "-");

              const outcome = getRowOutcome(row.team);
              const isThisRowSelected =
                mobileSlipContent &&
                String((row.team || "").trim()) ===
                  String((selectedBet?.team || "").trim());
              return (
                <React.Fragment key={i}>
                  <TableRow
                    sx={{
                      bgcolor: "#31425F",
                      borderRadius: "25px",
                      overflow: "hidden",
                      "& .MuiTableCell-root": { py: 0.8, border: "none" },
                      "& td:first-of-type": { borderRadius: "25px 0 0 25px" },
                      "& td:last-of-type": { borderRadius: "0 25px 25px 0" },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#fff",
                        borderRadius: "25px 0 0 25px",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                          fontWeight: 700,
                          lineHeight: "14px",
                        }}
                      >
                        <span>{row.team}</span>
                        {(() => {
                          const hasPending = (pendingBets || []).length > 0;
                          if (!hasPending) return null;
                          const rowPending = (pendingBets || []).filter(
                            (b) =>
                              String((b.teamName || "").trim()) ===
                              String((row.team || "").trim())
                          );
                          const isBetOnThisRow = rowPending.length > 0;
                          const totalLossIfOther = (pendingBets || []).reduce(
                            (sum, b) => sum + Number(b.price || 0),
                            0
                          );
                          const value = isBetOnThisRow
                            ? "+" +
                              rowPending.reduce(
                                (s, b) => s + Number(b.betAmount || 0),
                                0
                              )
                            : "-" + totalLossIfOther;
                          const isPositive = value.startsWith("+");
                          const boxColor = isPositive ? "#18a21e" : "#e53935";
                          return (
                            <Box
                              component="span"
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.25,
                                fontSize: "13px",
                                fontWeight: 700,
                                color: boxColor,
                                px: 1,
                                py: 0.25,
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                              }}
                            >
                              → {value}
                            </Box>
                          );
                        })()}
                        {outcome && (
                          <Box
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              bgcolor:
                                outcome.type === "profit" ||
                                outcome.type === "profitIfWins"
                                  ? "rgba(34, 197, 94, 0.25)"
                                  : "rgba(239, 68, 68, 0.25)",
                              color:
                                outcome.type === "profit" ||
                                outcome.type === "profitIfWins"
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {outcome.type === "profit" && outcome.label}
                            {outcome.type === "liability" && outcome.label}
                            {outcome.type === "loss" && outcome.label}
                            {outcome.type === "profitIfWins" &&
                              `If wins: ${outcome.label}`}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        verticalAlign: "middle",
                        width: "1%",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 0.5,
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        {isLocked ? (
                          <Box sx={{ minWidth: 56 }}>
                            <OddsBox
                              locked
                              lockType={row.lockType}
                              bgColor="#B2D9FF"
                            />
                          </Box>
                        ) : (
                          backOdds.map((b, idx) => (
                            <Box
                              key={idx}
                              onClick={() =>
                                b.price !== "-" &&
                                onOddsClick?.(
                                  row.team,
                                  b.price,
                                  "back",
                                  title,
                                  marketRowIndex
                                )
                              }
                              sx={{
                                minWidth: 56,
                                flexShrink: 0,
                                color: "#090909",
                              }}
                            >
                              <OddsBox price={b.price} amount={b.amount} />
                            </Box>
                          ))
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        verticalAlign: "middle",
                        width: "1%",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 0.5,
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        {isLocked ? (
                          <Box sx={{ minWidth: 56 }}>
                            <OddsBox
                              locked
                              lockType={row.lockType}
                              bgColor="#ffc3dc"
                            />
                          </Box>
                        ) : (
                          layOdds.map((l, idx) => (
                            <Box
                              key={idx}
                              onClick={() =>
                                l.price !== "-" &&
                                onOddsClick?.(
                                  row.team,
                                  l.price,
                                  "lay",
                                  title,
                                  marketRowIndex
                                )
                              }
                              sx={{
                                minWidth: 56,
                                flexShrink: 0,
                                color: "#090909",
                              }}
                            >
                              <OddsBox
                                price={l.price}
                                amount={l.amount}
                                bgColor="#ffc3dc"
                              />
                            </Box>
                          ))
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  {isThisRowSelected && mobileSlipContent && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ p: 0, border: "none", verticalAlign: "top" }}
                      >
                        {mobileSlipContent}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {footerText && (
        <>
          <Divider
            sx={{ borderColor: "rgba(255,255,255,0.2)", mx: 1, my: 0.5 }}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", px: 2, pb: 1 }}
          >
            <Typography fontSize={12} color="#fff" sx={{ opacity: 0.9 }}>
              {footerText}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

const TabPillSwitch = ({ value, onChange, options = ["FANCY", "PREMIUM"] }) => (
  <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
    {options.map((opt) => {
      const isActive = value === opt;
      return (
        <Box
          key={opt}
          onClick={() => onChange?.(opt)}
          sx={{
            flex: "1 1 0",
            minWidth: 0,
            padding: { xs: "4px 8px", sm: "6px 12px" },
            overflow: "hidden",
            position: "relative",
            fontSize: "0.875rem",
            boxSizing: "border-box",
            minHeight: { xs: 40, sm: 48 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: 500,
            lineHeight: 1.75,
            whiteSpace: "normal",
            cursor: onChange ? "pointer" : "default",
            backgroundColor: isActive ? "#01fafe" : "#0e2239",
            border: isActive ? "none" : "1px solid rgba(255,255,255,0.25)",
            borderRadius: "20px",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "inherit",
              fontWeight: "inherit",
              lineHeight: "inherit",
              color: isActive ? "#000" : "#fff",
            }}
          >
            {opt}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

// Helper function to save market to localStorage
const saveMarketToLocalStorage = (marketData) => {
  const existingMarkets = JSON.parse(
    localStorage.getItem("multiMarkets") || "[]"
  );
  const newMarket = {
    id: Date.now(),
    title: marketData.title,
    data: marketData.data,
    limits: marketData.limits,
    timestamp: new Date().toISOString(),
    isPinned: true,
  };

  // Check if market already exists (by title)
  const marketExists = existingMarkets.some(
    (market) => market.title === marketData.title
  );

  if (!marketExists) {
    const updatedMarkets = [...existingMarkets, newMarket];
    localStorage.setItem("multiMarkets", JSON.stringify(updatedMarkets));
    return true;
  }
  return false;
};

// Transform API market to MarketSection data shape: [{ team, back: [{ price, amount }], lay: [...] }]
function transformApiMarketToUI(market) {
  if (!market || !Array.isArray(market.section) || market.section.length === 0)
    return [];
  return market.section.map((sec) => {
    const odds = sec.odds || [];
    const backOdds = odds
      .filter((o) => o.otype === "back")
      .map((o) => ({
        price: o.odds != null && o.odds !== 0 ? String(o.odds) : "-",
        amount:
          o.size != null && o.size > 0
            ? o.size >= 1000
              ? `${(o.size / 1000).toFixed(0)}K`
              : String(o.size)
            : "-",
      }));
    const layOdds = odds
      .filter((o) => o.otype === "lay")
      .map((o) => ({
        price: o.odds != null && o.odds !== 0 ? String(o.odds) : "-",
        amount:
          o.size != null && o.size > 0
            ? o.size >= 1000
              ? `${(o.size / 1000).toFixed(0)}K`
              : String(o.size)
            : "-",
      }));
    const locked =
      (sec.gstatus &&
        sec.gstatus !== "" &&
        sec.gstatus !== "OPEN" &&
        sec.gstatus !== "ACTIVE") ||
      sec.gscode === 0;
    const lockType =
      locked && (sec.gstatus || "").toUpperCase().includes("SUSP")
        ? "suspended"
        : "live";
    return {
      team: sec.nat || "",
      back: backOdds.length > 0 ? backOdds : [{ price: "-", amount: "-" }],
      lay: layOdds.length > 0 ? layOdds : [{ price: "-", amount: "-" }],
      ...(locked && { locked: true, lockType }),
    };
  });
}

// Normalize mname for dedupe: "Tied Match" and "TIED_MATCH" -> same key
function normalizeMname(mname) {
  if (!mname || typeof mname !== "string") return "";
  return mname
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

// Dedupe by normalized mname so "Tied Match" and "TIED_MATCH" show only once (keep first by sno).
function getMarketSectionMarkets(battingData) {
  if (!Array.isArray(battingData)) return [];
  const filtered = battingData
    .filter(
      (m) =>
        (m.gtype === "match" || m.gtype === "match1") &&
        Array.isArray(m.section) &&
        m.section.length > 0
    )
    .sort((a, b) => (Number(a.sno) ?? 0) - (Number(b.sno) ?? 0));
  const seen = new Set();
  return filtered.filter((m) => {
    const key = normalizeMname(m.mname);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatMarketLimit(value) {
  if (value == null || value === 0) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function slugifyMname(mname) {
  if (!mname || typeof mname !== "string") return "other";
  return (
    mname
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") || "other"
  );
}

// Build one row from API section (shared for fancy and oddeven)
function sectionToRow(sec) {
  const odds = sec.odds || [];
  const back1 = odds.find(
    (o) => o.otype === "back" && (o.oname || "").startsWith("back")
  );
  const lay1 = odds.find(
    (o) => o.otype === "lay" && (o.oname || "").startsWith("lay")
  );
  const backPrice =
    back1?.odds != null && back1.odds !== 0 ? String(back1.odds) : "-";
  const layPrice =
    lay1?.odds != null && lay1.odds !== 0 ? String(lay1.odds) : "-";
  const backSize =
    back1?.size != null && back1.size > 0
      ? back1.size >= 1000
        ? `${(back1.size / 1000).toFixed(0)}K`
        : String(back1.size)
      : "-";
  const laySize =
    lay1?.size != null && lay1.size > 0
      ? lay1.size >= 1000
        ? `${(lay1.size / 1000).toFixed(0)}K`
        : String(lay1.size)
      : "-";
  const locked =
    (sec.gstatus && sec.gstatus !== "" && sec.gstatus !== "ACTIVE") ||
    sec.gscode === 0;
  const lockType =
    locked && (sec.gstatus || "").toUpperCase().includes("SUSP")
      ? "suspended"
      : "live";
  return {
    title: sec.nat || "",
    book: "Book",
    values: [
      { top: backPrice, bottom: backSize },
      { top: layPrice, bottom: laySize },
    ],
    backSizeNum: back1?.size ?? 0,
    laySizeNum: lay1?.size ?? 0,
    min: sec.min != null ? String(sec.min) : "100",
    max:
      sec.max != null
        ? sec.max >= 1000
          ? `${(sec.max / 1000).toFixed(0)}K`
          : String(sec.max)
        : "25K",
    locked: !!locked,
    lockType: locked ? lockType : null,
  };
}

// Group fancy + oddeven markets by mname; only include markets that have sections. Returns [{ id, label, rows }].
function getGroupedFancySections(battingData) {
  if (!Array.isArray(battingData)) return [];
  const sections = [];
  const seenIds = new Set();

  battingData
    .filter(
      (m) =>
        (m.gtype === "fancy" || m.gtype === "oddeven") &&
        Array.isArray(m.section) &&
        m.section.length > 0
    )
    .sort((a, b) => (Number(a.sno) ?? 0) - (Number(b.sno) ?? 0))
    .forEach((market) => {
      const mname = market.mname || "";
      const id = slugifyMname(mname) || "other";
      const label = mname;

      if (seenIds.has(id)) {
        const existing = sections.find((s) => s.id === id);
        if (existing) {
          market.section.forEach((sec) =>
            existing.rows.push(sectionToRow(sec))
          );
        }
        return;
      }
      seenIds.add(id);
      const rows = market.section.map(sectionToRow);
      sections.push({ id, label, rows });
    });

  return sections.filter((s) => (s.rows || []).length > 0);
}
const hideScrollbar = {
  overflow: "auto",
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE / Edge
  "&::-webkit-scrollbar": {
    display: "none", // Chrome / Safari
  },
  WebkitOverflowScrolling: "touch", // iOS smooth scroll
};

export default function PreviewPage1() {
  const [searchParams] = useSearchParams();
  const gameIdFromUrl = searchParams.get("gameid");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  //const userId = useSelector((state) => state.auth?.userInfo?.id) ?? localStorage.getItem('userId');
  const match =
    location.state?.match ??
    useSelector((state) => state.cricket.selectedMatch);
  const { battingData } = useSelector((state) => state.cricket);
  const userId = useSelector(
    (state) =>
      state.auth?.userInfo?._id ??
      state.auth?.userInfo?.id ??
      localStorage.getItem("userId")
  );
  console.log(userId);
  const [activeTab, setActiveTab] = React.useState("FANCY");
  const [slipTab, setSlipTab] = React.useState("BET_SLIP");
  const [selectedBet, setSelectedBet] = React.useState({
    team: "",
    odd: "",
    side: "",
    marketTitle: "",
    marketRowIndex: null,
    size: null,
  });
  const [slipAmount, setSlipAmount] = React.useState(0);
  const [showLive, setShowLive] = React.useState(false);
  const [cricketActiveTab, setCricketActiveTab] = React.useState("score");
  const gameid =
    gameIdFromUrl ||
    match?.id ||
    (battingData?.[0]?.gmid != null ? String(battingData[0].gmid) : null);
  const sid =
    (Array.isArray(battingData) &&
      battingData[0] != null &&
      battingData[0].sid) ||
    (Array.isArray(battingData) &&
      battingData[0] != null &&
      battingData[0].gmid) ||
    gameid ||
    "1";
  const betLoading = useSelector((state) => state.bet?.loading);
  const betErrorMessage = useSelector((state) => state.bet?.errorMessage);
  const betSuccessMessage = useSelector((state) => state.bet?.successMessage);
  const pendingBet = useSelector((state) => state.bet?.pendingBet ?? []);
  const openBetsForGame = (pendingBet || []).filter(
    (b) => String(b.gameId) === String(gameid)
  );
  const pendingFancyBets = openBetsForGame.filter(
    (b) =>
      String(b.marketName || b.gameType || "").toUpperCase() === "FANCY" ||
      String(b.gameType || "") === "Normal" ||
      (b.fancyScore != null && String(b.fancyScore).trim() !== "")
  );
  const { matchInfo } = matchData;
  const marketSectionMarkets = getMarketSectionMarkets(battingData);
  const groupedFancySections = getGroupedFancySections(battingData);
  const displayName = match?.name ?? matchInfo.teams;
  const rawDateTime = match?.date ?? match?.datetime ?? "";
  const parts = rawDateTime.trim() ? rawDateTime.trim().split(/\s+/) : [];
  const displayDate = match ? (parts[0] ?? matchInfo.date) : matchInfo.date;
  const displayTime = match
    ? parts.slice(1).join(" ") || matchInfo.time
    : matchInfo.time;
  // Time: "1:00:00 PM" → "1:00 PM" (drop seconds)
  const formatTimeLine = (t) => {
    if (!t || typeof t !== "string") return "";
    return t.replace(/(\d{1,2}:\d{2}):\d{2}(\s*[AP]M?)/i, "$1$2").trim();
  };

  // Date: "2/6/2026" → "6 Feb 2026" (3-letter month)
  const formatDateLine = (d) => {
    if (!d || typeof d !== "string") return "";
    const parts = d.split("/").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return d;
    const [mo, day, year] = parts;
    const date = new Date(year, mo - 1, day);
    const monthShort = date.toLocaleString("en", { month: "short" });
    return `${date.getDate()} ${monthShort} ${date.getFullYear()}`;
  };
  useEffect(() => {
    if (!gameIdFromUrl) return;

    dispatch(
      setSelectedMatch({ id: gameIdFromUrl, name: "Loading…", date: "" })
    );
    dispatch(fetchCricketBatingData(gameIdFromUrl));
  }, [gameIdFromUrl, dispatch]);
  // Socket: same pattern as Cricketbet – connect, subscribe to game, real-time updates go to Redux via updateMarketDataFromSocket
  useEffect(() => {
    const gameId = gameIdFromUrl || match?.id;
    if (!gameId) return;

    wsService.connect(dispatch, userId);
    wsService.subscribe(gameId, "cricket", null);

    return () => {
      // wsService.disconnect(); // uncomment if WS should close when leaving this page
    };
  }, [gameIdFromUrl, match?.id, dispatch, userId]);

  // Fetch pending amounts from getPendingBetAmo (not getPendingBet)
  useEffect(() => {
    if (gameid) dispatch(getPendingBetAmo(gameid));
  }, [gameid, dispatch]);

  const TimeBox = () => (
    <Box
      sx={{
        background: "#01fafe",
        px: { xs: 2, sm: 4 },
        py: 0.3,
        borderRadius: 5,
        textAlign: "center",
      }}
    >
      <Typography
        fontWeight={700}
        color="#002b36"
        sx={{ fontSize: { xs: 11, sm: 14 } }}
      >
        {formatTimeLine(displayTime)}
      </Typography>
      <Typography sx={{ fontSize: { xs: 9, sm: 10 } }} color="#002b36">
        {formatDateLine(displayDate)}
      </Typography>
    </Box>
  );
  // Settings menu state
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMarketData, setSelectedMarketData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOddsClick = (team, price, side, marketTitle, marketRowIndex) => {
    if (price === "-") return;
    setSelectedBet({
      team,
      odd: price,
      side,
      marketTitle,
      marketRowIndex: marketRowIndex ?? null,
      size: null,
    });
    setSlipAmount(0);
  };

  const handleSettingsClick = (event, title, data, limits) => {
    setSettingsAnchorEl(event.currentTarget);
    setSelectedMarketData({ title, data, limits });
  };

  const handleCloseSettingsMenu = () => {
    setSettingsAnchorEl(null);
  };

  const handleAddToMultiMarkets = () => {
    if (selectedMarketData) {
      const saved = saveMarketToLocalStorage(selectedMarketData);

      if (saved) {
        setSnackbar({
          open: true,
          message: `Added ${selectedMarketData.title} to Multi-Markets!`,
          severity: "success",
        });

        // Navigate to MultiMarkets page after a short delay
        setTimeout(() => {
          navigate("/multimarkets");
        }, 800);
      } else {
        setSnackbar({
          open: true,
          message: `${selectedMarketData.title} already exists in Multi-Markets`,
          severity: "info",
        });
      }

      handleCloseSettingsMenu();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePlaceBet = async () => {
    const stake = slipAmount || 0;
    const odd = Number(selectedBet?.odd) || 0;
    if (stake <= 0) return;
    if (
      !selectedBet?.team &&
      (selectedBet?.marketTitle || "").toUpperCase() !== "FANCY"
    )
      return;

    const eventName = displayName;
    const isFancy = (selectedBet?.marketTitle || "").toUpperCase() === "FANCY";
    const teamName = selectedBet.team || ""; // This is correct - the selection name
    // For fancy bets:
    // - marketName should be "FANCY" (the market type)
    // - teamName should be the selection (e.g., "14 over run NZ")
    // - fancyScore should be the numerical value (e.g., 161)
    const marketName = isFancy
      ? teamName // ← Set to "FANCY" for fancy bets
      : toBackendGameType(selectedBet.marketTitle || "Market");

    const otype = (selectedBet.side || "back").toLowerCase();

    // 🔴 FIX: Ensure gameType matches exactly what backend expects
    // Backend expects: "Normal", "meter", "line", "ball", "khado"
    const gameType = isFancy
      ? "Normal" // ← Capital "N", not "normal"
      : marketName;

    const formData = {
      gameId: gameid,
      sid: 4,
      price: String(stake),
      xValue: isFancy ? (Number(selectedBet?.size) || stake) : odd,
      fancyScore: isFancy ? odd : null,
      gameType: gameType, // ← Now "Normal" (capital N)
      eventName,
      marketName: marketName, // ← "FANCY" for fancy bets
      gameName: "Cricket Game",
      teamName: teamName, // ← "9 over run MI"
      otype,
    };

    console.log("🔍 Placing fancy bet with data:", {
      ...formData,
      isFancy,
      selectedBetTeam: selectedBet.team,
      selectedBetOdd: selectedBet.odd,
      selectedBetSide: selectedBet.side,
    });

    try {
      await dispatch(
        isFancy ? createfancyBet(formData) : createBet(formData)
      ).unwrap();

      // Success - clear the selection
      setSelectedBet({
        team: "",
        odd: "",
        side: "",
        marketTitle: "",
        marketRowIndex: null,
        size: null,
      });
      setSlipAmount(0);

      // Refresh pending bets
      if (gameid) dispatch(getPendingBetAmo(gameid));

      console.log("✅ Bet placed successfully!");
    } catch (error) {
      console.error("❌ Error placing bet:", error);
      // Error shown via Snackbar from bet state
    }
  };

  const handleSnackbarClose = () => dispatch(messageClear());

  // Settings menu items
  const settingsMenuItems = [
    {
      icon: <ContentCopyIcon fontSize="small" />,
      label: "Create Copy in Multi-Markets",
      onClick: handleAddToMultiMarkets,
    },
  ];

  // Check if there are any markets saved to show the button
  const [hasMultiMarkets, setHasMultiMarkets] = useState(false);

  useEffect(() => {
    const savedMarkets = JSON.parse(
      localStorage.getItem("multiMarkets") || "[]"
    );
    setHasMultiMarkets(savedMarkets.length > 0);
  }, []);

  return (
    <>
      <CssBaseline />
      <Snackbar
        open={!!betErrorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled">
          {betErrorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!betSuccessMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
        >
          {betSuccessMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(rgba(8,27,47,.92), rgba(8,27,47,.92))",
          p: { xs: 1, sm: 2 },
          maxWidth: "100%",
          scrollbarGutter: "stable",
        }}
      >
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 12, md: 8 }} sx={{ overflowX: "hidden" }}>
            <HeaderBox>
              <TimeBox />
              <Typography
                fontWeight={700}
                color="#002b36"
                sx={{ ml: { xs: 1, sm: 2 }, fontSize: { xs: 12, sm: 14 } }}
              >
                {displayName}
              </Typography>
            </HeaderBox>

            <Box
              mt={2}
              sx={{
                overflowX: "hidden",
                maxWidth: "100%",
                width: "100%",
                position: "relative",
                left: 0,
                right: 0,
              }}
            >
              <Box
                sx={{
                  borderRadius: 4,
                  backgroundColor: "#1C2D40",
                  boxShadow: "none",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <Box
                  onClick={() => setShowLive((prev) => !prev)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#071123",
                    borderRadius: "18px 18px 0 0",
                    border: "1px solid #04a0e2",
                    minHeight: 44,
                    px: 2,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 10, sm: 11 },
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    LIVE SCORE
                  </Typography>
                  <ExpandMoreIcon
                    sx={{
                      color: "#fff",
                      transform: showLive ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </Box>
                {showLive && gameid && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        fontSize: 12,
                        color: "#fff",
                        width: "100%",
                      }}
                    >
                      <Box
                        component="button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCricketActiveTab("score");
                        }}
                        sx={{
                          flex: 1,
                          p: 1,
                          textAlign: "center",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor:
                            cricketActiveTab === "score" ? "#444" : "#303030",
                          color: "#fff",
                          fontSize: 12,
                          width: "50%",
                        }}
                      >
                        Live Score
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCricketActiveTab("video");
                        }}
                        sx={{
                          flex: 1,
                          p: 1,
                          textAlign: "center",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor:
                            cricketActiveTab === "video" ? "#444" : "#303030",
                          color: "#fff",
                          fontSize: 12,
                          width: "50%",
                        }}
                      >
                        Watch Live
                      </Box>
                    </Box>
                    {cricketActiveTab === "score" && (
                      <Box
                        sx={(theme) => ({
                          width: "100%",
                          maxWidth: "100%",
                          position: "relative",
                          overflow: "hidden",
                          ...hideScrollbar,
                          [theme.breakpoints.down("sm")]: {
                            overflowX: "hidden",
                            height: 90,
                            "& iframe": {
                              height: 200,
                              marginBottom: -110,
                            },
                          },
                        })}
                      >
                        <iframe
                          src={`https://score.akamaized.uk/diamond-live-score?gmid=${gameid}`}
                          allowFullScreen
                          title="Live Score"
                          scrolling="no"
                          style={{
                            width: "100%",
                            height: "200px",
                            border: "none",
                            display: "block",
                            overflow: "hidden",
                          }}
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
                        />
                      </Box>
                    )}
                    {cricketActiveTab === "video" && (
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          ...hideScrollbar,
                        }}
                      >
                        <iframe
                          src={`https://live.cricketid.xyz/directStream?gmid=${gameid}&key=a1bett20252026`}
                          title="Watch Live"
                          loading="lazy"
                          allowFullScreen
                          scrolling="no"
                          style={{
                            width: "100%",
                            height: "200px",
                            border: "none",
                            display: "block",
                          }}
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>

            {marketSectionMarkets.map((market, rowIndex) => {
              const data = transformApiMarketToUI(market);
              if (data.length === 0) return null;
              const limits = {
                min: market.min != null && market.min > 0 ? market.min : 100,
                max: formatMarketLimit(market.max) || "25K",
              };
              const backendMarket = toBackendGameType(market.mname || "Market");
              const pendingForThisMarket = (pendingBet || []).filter(
                (b) =>
                  String(b.gameId) === String(gameid) &&
                  (b.gameType === backendMarket ||
                    b.marketName === backendMarket)
              );
              const isSelectedFromThisMarket =
                selectedBet?.odd &&
                selectedBet?.marketRowIndex !== undefined &&
                selectedBet?.marketRowIndex !== null &&
                selectedBet.marketRowIndex === rowIndex;

              const mobileSlipContent = isSelectedFromThisMarket ? (
                <Box sx={{ display: { xs: "block", md: "none" }, mt: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => setSlipTab("BET_SLIP")}
                      sx={{
                        bgcolor: slipTab === "BET_SLIP" ? "#01fafe" : "#0e2239",
                        color: slipTab === "BET_SLIP" ? "#002b36" : "#9fb3c8",
                        fontWeight: 700,
                        fontSize: "12px",
                        py: 0.75,
                        border:
                          slipTab === "BET_SLIP"
                            ? "none"
                            : "1px solid rgba(255,255,255,0.25)",
                      }}
                    >
                      BET SLIP
                    </Button>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => setSlipTab("OPEN_BETS")}
                      sx={{
                        borderColor:
                          slipTab === "OPEN_BETS"
                            ? "#01fafe"
                            : "rgba(255,255,255,0.3)",
                        color: slipTab === "OPEN_BETS" ? "#002b36" : "#9fb3c8",
                        bgcolor:
                          slipTab === "OPEN_BETS" ? "#01fafe" : "transparent",
                        fontWeight: 600,
                        fontSize: "11px",
                        py: 0.75,
                      }}
                    >
                      (OPEN BETS) ({openBetsForGame.length})
                    </Button>
                  </Stack>
                  {slipTab === "BET_SLIP" ? (
                    selectedBet.odd ? (
                      <BetSlipModal
                        variant="inline"
                        matchName={
                          selectedBet.team
                            ? `${selectedBet.team} (${selectedBet.marketTitle})`
                            : displayName
                        }
                        initialOdd={selectedBet.odd || ""}
                        leagueTitle={displayName}
                        side={selectedBet.side || "back"}
                        amount={slipAmount}
                        onAmountChange={setSlipAmount}
                        onPlaceBet={handlePlaceBet}
                        placeBetLoading={betLoading}
                        isFancy={
                          (selectedBet?.marketTitle || "").toUpperCase() ===
                          "FANCY"
                        }
                        marketTitle={selectedBet?.marketTitle || ""}
                        onClearSelection={() => {
                          setSelectedBet({
                            team: "",
                            odd: "",
                            side: "",
                            marketTitle: "",
                            marketRowIndex: null,
                            size: null,
                          });
                          setSlipAmount(0);
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          minHeight: 100,
                          bgcolor: "#0e2239",
                          borderRadius: 2,
                          border: "1px solid rgba(4, 160, 226, 0.3)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          py: 2,
                        }}
                      >
                        <BlockIcon
                          sx={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 40,
                          }}
                        />
                        <Typography fontSize="12px" color="#9fb3c8">
                          No bet placed yet.
                        </Typography>
                      </Box>
                    )
                  ) : openBetsForGame.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        py: 0.5,
                      }}
                    >
                      {openBetsForGame.map((bet) => {
                        const isSettled =
                          bet.status !== 0 && bet.status !== undefined;
                        const isWon = bet.status === 1;
                        const isLost = bet.status === 2;
                        const isVoid = bet.status === 3;

                        return (
                          <Box
                            key={bet._id}
                            sx={{
                              p: 1.25,
                              borderRadius: 1,
                              bgcolor: isSettled
                                ? isWon
                                  ? "rgba(34, 197, 94, 0.15)"
                                  : isLost
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "rgba(4, 160, 226, 0.12)"
                                : "rgba(4, 160, 226, 0.12)",
                              border: isSettled
                                ? isWon
                                  ? "1px solid rgba(34, 197, 94, 0.5)"
                                  : isLost
                                    ? "1px solid rgba(239, 68, 68, 0.5)"
                                    : "1px solid rgba(4, 160, 226, 0.3)"
                                : "1px solid rgba(4, 160, 226, 0.3)",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                fontSize="12px"
                                fontWeight={700}
                                color="#fff"
                              >
                                {bet.teamName}
                              </Typography>
                              {isSettled && (
                                <Box
                                  sx={{
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    bgcolor: isWon
                                      ? "rgba(34, 197, 94, 0.3)"
                                      : isLost
                                        ? "rgba(239, 68, 68, 0.3)"
                                        : "rgba(156, 163, 175, 0.3)",
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: isWon
                                      ? "#22c55e"
                                      : isLost
                                        ? "#ef4444"
                                        : "#9ca3af",
                                  }}
                                >
                                  {isWon
                                    ? "WON"
                                    : isLost
                                      ? "LOST"
                                      : isVoid
                                        ? "VOID"
                                        : "SETTLED"}
                                </Box>
                              )}
                            </Box>
                            <Typography
                              fontSize="11px"
                              color="#01fafe"
                              fontWeight={600}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {bet.otype === "back"
                                ? "Back (In Favour)"
                                : "Lay (Against)"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 0.5,
                                fontSize: "12px",
                                color: "#9fb3c8",
                              }}
                            >
                              <span>Stake: {bet.price}</span>
                              <span>Odds: {Number(bet.xValue).toFixed(2)}</span>
                            </Box>
                            {bet.marketName && (
                              <Typography
                                fontSize="10px"
                                color="rgba(255,255,255,0.6)"
                                sx={{ mt: 0.25 }}
                              >
                                {bet.marketName}
                              </Typography>
                            )}
                            {/* Show settlement details for fancy bets */}
                            {bet.fancyScore != null && (
                              <Box sx={{ mt: 0.5 }}>
                                <Typography
                                  fontSize="10px"
                                  color="rgba(255,255,255,0.7)"
                                >
                                  Fancy Score: {bet.fancyScore}
                                </Typography>
                                {bet.betResult != null && (
                                  <Typography
                                    fontSize="10px"
                                    color="rgba(255,255,255,0.7)"
                                  >
                                    Result: {bet.betResult}
                                  </Typography>
                                )}
                                {bet.resultAmount != null &&
                                  bet.status !== 0 && (
                                    <Typography
                                      fontSize="10px"
                                      color={
                                        bet.status === 1 ? "#22c55e" : "#ef4444"
                                      }
                                      fontWeight={600}
                                    >
                                      {bet.status === 1 ? "+" : "-"}
                                      {bet.resultAmount}
                                    </Typography>
                                  )}
                                {bet.settledAt && (
                                  <Typography
                                    fontSize="9px"
                                    color="rgba(255,255,255,0.5)"
                                    sx={{ mt: 0.25 }}
                                  >
                                    Settled:{" "}
                                    {new Date(bet.settledAt).toLocaleString()}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        minHeight: 100,
                        bgcolor: "#0e2239",
                        borderRadius: 2,
                        border: "1px solid rgba(4, 160, 226, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        py: 2,
                      }}
                    >
                      <BlockIcon
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 40,
                        }}
                      />
                      <Typography fontSize="12px" color="#9fb3c8">
                        No open bets.
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : null;

              return (
                <React.Fragment key={market.mid ?? market.mname ?? rowIndex}>
                  <MarketSection
                    title={market.mname || "Market"}
                    data={data}
                    limits={limits}
                    cashout={0}
                    onOddsClick={handleOddsClick}
                    onSettingsClick={handleSettingsClick}
                    selectedBet={selectedBet}
                    slipAmount={slipAmount}
                    marketRowIndex={rowIndex}
                    pendingBets={pendingForThisMarket}
                    mobileSlipContent={mobileSlipContent}
                  />
                  {market.rem && String(market.rem).trim() && (
                    <ScrollingAnnouncement text={market.rem.trim()} />
                  )}
                </React.Fragment>
              );
            })}

            <Box mt={2} mb={1}>
              <TabPillSwitch value={activeTab} onChange={setActiveTab} />
              <Divider
                sx={{ borderColor: "rgba(255,255,255,0.2)", mt: 2, mb: 1 }}
              />
            </Box>

            {activeTab === "FANCY" && (
              <Box mt={2}>
                <FancyComponent
                  sections={groupedFancySections}
                  pendingBets={pendingFancyBets}
                  onBetClick={(matchName, odd, side, gameType, size) => {
                    setSlipTab("BET_SLIP");
                    setSelectedBet({
                      team: matchName,
                      odd: odd,
                      side: side || "back",
                      marketTitle: "FANCY",
                      marketRowIndex: null,
                      gameType: gameType === "normal" ? "Normal" : gameType,
                      size: size != null ? size : null,
                    });
                    console.log("🎯 Fancy bet selected:", {
                      matchName,
                      odd,
                      side,
                      gameType,
                      size,
                    });
                  }}
                />
                {/* Mobile: show bet slip inline below Fancy when selection is from Fancy */}
                {selectedBet?.odd &&
                  String(selectedBet.marketTitle || "").trim() === "FANCY" && (
                    <Box sx={{ display: { xs: "block", md: "none" }, mt: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => setSlipTab("BET_SLIP")}
                          sx={{
                            bgcolor:
                              slipTab === "BET_SLIP" ? "#01fafe" : "#0e2239",
                            color:
                              slipTab === "BET_SLIP" ? "#002b36" : "#9fb3c8",
                            fontWeight: 700,
                            fontSize: "12px",
                            py: 0.75,
                            border:
                              slipTab === "BET_SLIP"
                                ? "none"
                                : "1px solid rgba(255,255,255,0.25)",
                          }}
                        >
                          BET SLIP
                        </Button>
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => setSlipTab("OPEN_BETS")}
                          sx={{
                            borderColor:
                              slipTab === "OPEN_BETS"
                                ? "#01fafe"
                                : "rgba(255,255,255,0.3)",
                            color:
                              slipTab === "OPEN_BETS" ? "#002b36" : "#9fb3c8",
                            bgcolor:
                              slipTab === "OPEN_BETS"
                                ? "#01fafe"
                                : "transparent",
                            fontWeight: 600,
                            fontSize: "11px",
                            py: 0.75,
                          }}
                        >
                          (OPEN BETS) ({openBetsForGame.length})
                        </Button>
                      </Stack>
                      {slipTab === "BET_SLIP" && selectedBet.odd ? (
                        <BetSlipModal
                          variant="inline"
                          matchName={
                            selectedBet.team
                              ? `${selectedBet.team} (${selectedBet.marketTitle})`
                              : displayName
                          }
                          initialOdd={selectedBet.odd || ""}
                          leagueTitle={displayName}
                          side={selectedBet.side || "back"}
                          amount={slipAmount}
                          onAmountChange={setSlipAmount}
                          onPlaceBet={handlePlaceBet}
                          placeBetLoading={betLoading}
                          isFancy={
                            (selectedBet?.marketTitle || "").toUpperCase() ===
                            "FANCY"
                          }
                          marketTitle={selectedBet?.marketTitle || ""}
                          onClearSelection={() => {
                            setSelectedBet({
                              team: "",
                              odd: "",
                              side: "",
                              marketTitle: "",
                              marketRowIndex: null,
                              size: null,
                            });
                            setSlipAmount(0);
                          }}
                        />
                      ) : slipTab === "BET_SLIP" ? (
                        <Box
                          sx={{
                            minHeight: 100,
                            bgcolor: "#0e2239",
                            borderRadius: 2,
                            border: "1px solid rgba(4, 160, 226, 0.3)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            py: 2,
                          }}
                        >
                          <BlockIcon
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 40,
                            }}
                          />
                          <Typography fontSize="12px" color="#9fb3c8">
                            No bet placed yet.
                          </Typography>
                        </Box>
                      ) : openBetsForGame.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            py: 0.5,
                          }}
                        >
                          {openBetsForGame.map((bet) => {
                            const isSettled =
                              bet.status !== 0 && bet.status !== undefined;
                            const isWon = bet.status === 1;
                            const isLost = bet.status === 2;
                            const isVoid = bet.status === 3;

                            return (
                              <Box
                                key={bet._id}
                                sx={{
                                  p: 1.25,
                                  borderRadius: 1,
                                  bgcolor: isSettled
                                    ? isWon
                                      ? "rgba(34, 197, 94, 0.15)"
                                      : isLost
                                        ? "rgba(239, 68, 68, 0.15)"
                                        : "rgba(4, 160, 226, 0.12)"
                                    : "rgba(4, 160, 226, 0.12)",
                                  border: isSettled
                                    ? isWon
                                      ? "1px solid rgba(34, 197, 94, 0.5)"
                                      : isLost
                                        ? "1px solid rgba(239, 68, 68, 0.5)"
                                        : "1px solid rgba(4, 160, 226, 0.3)"
                                    : "1px solid rgba(4, 160, 226, 0.3)",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography
                                    fontSize="12px"
                                    fontWeight={700}
                                    color="#fff"
                                  >
                                    {bet.teamName}
                                  </Typography>
                                  {isSettled && (
                                    <Box
                                      sx={{
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        bgcolor: isWon
                                          ? "rgba(34, 197, 94, 0.3)"
                                          : isLost
                                            ? "rgba(239, 68, 68, 0.3)"
                                            : "rgba(156, 163, 175, 0.3)",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        color: isWon
                                          ? "#22c55e"
                                          : isLost
                                            ? "#ef4444"
                                            : "#9ca3af",
                                      }}
                                    >
                                      {isWon
                                        ? "WON"
                                        : isLost
                                          ? "LOST"
                                          : isVoid
                                            ? "VOID"
                                            : "SETTLED"}
                                    </Box>
                                  )}
                                </Box>
                                <Typography
                                  fontSize="11px"
                                  color="#01fafe"
                                  fontWeight={600}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {bet.otype === "back"
                                    ? "Back (In Favour)"
                                    : "Lay (Against)"}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 0.5,
                                    fontSize: "12px",
                                    color: "#9fb3c8",
                                  }}
                                >
                                  <span>Stake: {bet.price}</span>
                                  <span>
                                    Odds: {Number(bet.xValue).toFixed(2)}
                                  </span>
                                </Box>
                                {bet.marketName && (
                                  <Typography
                                    fontSize="10px"
                                    color="rgba(255,255,255,0.6)"
                                    sx={{ mt: 0.25 }}
                                  >
                                    {bet.marketName}
                                  </Typography>
                                )}
                                {/* Show settlement details for fancy bets */}
                                {bet.fancyScore != null && (
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      fontSize="10px"
                                      color="rgba(255,255,255,0.7)"
                                    >
                                      Fancy Score: {bet.fancyScore}
                                    </Typography>
                                    {bet.betResult != null && (
                                      <Typography
                                        fontSize="10px"
                                        color="rgba(255,255,255,0.7)"
                                      >
                                        Result: {bet.betResult}
                                      </Typography>
                                    )}
                                    {bet.resultAmount != null &&
                                      bet.status !== 0 && (
                                        <Typography
                                          fontSize="10px"
                                          color={
                                            bet.status === 1
                                              ? "#22c55e"
                                              : "#ef4444"
                                          }
                                          fontWeight={600}
                                        >
                                          {bet.status === 1 ? "+" : "-"}
                                          {bet.resultAmount}
                                        </Typography>
                                      )}
                                    {bet.settledAt && (
                                      <Typography
                                        fontSize="9px"
                                        color="rgba(255,255,255,0.5)"
                                        sx={{ mt: 0.25 }}
                                      >
                                        Settled:{" "}
                                        {new Date(
                                          bet.settledAt
                                        ).toLocaleString()}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            minHeight: 100,
                            bgcolor: "#0e2239",
                            borderRadius: 2,
                            border: "1px solid rgba(4, 160, 226, 0.3)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            py: 2,
                          }}
                        >
                          <BlockIcon
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 40,
                            }}
                          />
                          <Typography fontSize="12px" color="#9fb3c8">
                            No open bets.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
              </Box>
            )}
          </Grid>

          {/* Right Sidebar - same layout as PreviewPage1Football */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: { xs: "none", md: "block" },
              width: 340,
              maxWidth: 380,
              flexShrink: 0,
              pl: 0,
              position: "sticky",
              top: 16,
              alignSelf: "flex-start",
            }}
          >
            <Box
              sx={{
                background: "#0e2239",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* 1. One Click Betting */}
              <div
                style={{
                  marginBottom: "10px",
                  padding: "6px",
                  background: "#212e44",
                  color: "#fff",
                  alignItems: "center",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <FormControlLabel
                  sx={{
                    margin: 0,
                    "& .MuiFormControlLabel-label": { marginLeft: 0 },
                  }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "#fff",
                        padding: "6px",
                        margin: 0,
                        marginRight: "8px",
                      }}
                    />
                  }
                  label={
                    <Typography fontSize="12px" color="#e2e8f0">
                      1 Click Betting Enabled
                    </Typography>
                  }
                />
              </div>

              {/* 2. Bet Slip / Open Bets */}
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: "#071123",
                  border: "1px solid rgba(4, 160, 226, 0.25)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  height: 420,
                  minHeight: 420,
                  maxHeight: 420,
                  overflow: "auto",
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    onClick={() => setSlipTab("BET_SLIP")}
                    sx={{
                      bgcolor: slipTab === "BET_SLIP" ? "#01fafe" : "#0e2239",
                      color: slipTab === "BET_SLIP" ? "#002b36" : "#9fb3c8",
                      fontWeight: 700,
                      fontSize: "12px",
                      py: 1,
                      border:
                        slipTab === "BET_SLIP"
                          ? "none"
                          : "1px solid rgba(255,255,255,0.25)",
                      "&:hover": {
                        bgcolor:
                          slipTab === "BET_SLIP"
                            ? "#1fe3ee"
                            : "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    BET SLIP
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => setSlipTab("OPEN_BETS")}
                    sx={{
                      borderColor:
                        slipTab === "OPEN_BETS"
                          ? "#01fafe"
                          : "rgba(255,255,255,0.3)",
                      color: slipTab === "OPEN_BETS" ? "#002b36" : "#9fb3c8",
                      bgcolor:
                        slipTab === "OPEN_BETS" ? "#01fafe" : "transparent",
                      fontWeight: 600,
                      fontSize: "11px",
                      py: 1,
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.5)",
                        bgcolor: "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    (OPEN BETS) ({openBetsForGame.length})
                  </Button>
                </Stack>

                {slipTab === "BET_SLIP" ? (
                  selectedBet.odd ? (
                    <BetSlipModal
                      variant="inline"
                      matchName={
                        selectedBet.team
                          ? `${selectedBet.team} (${selectedBet.marketTitle})`
                          : displayName
                      }
                      initialOdd={selectedBet.odd || ""}
                      leagueTitle={displayName}
                      side={selectedBet.side || "back"}
                      amount={slipAmount}
                      onAmountChange={setSlipAmount}
                      onPlaceBet={handlePlaceBet}
                      placeBetLoading={betLoading}
                      isFancy={
                        (selectedBet?.marketTitle || "").toUpperCase() ===
                        "FANCY"
                      }
                      marketTitle={selectedBet?.marketTitle || ""}
                      onClearSelection={() => {
                        setSelectedBet({
                          team: "",
                          odd: "",
                          side: "",
                          marketTitle: "",
                          marketRowIndex: null,
                          size: null,
                        });
                        setSlipAmount(0);
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        minHeight: 120,
                        bgcolor: "#0e2239",
                        borderRadius: 2,
                        border: "1px solid rgba(4, 160, 226, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        py: 3,
                      }}
                    >
                      <BlockIcon
                        sx={{ color: "rgba(255,255,255,0.4)", fontSize: 48 }}
                      />
                      <Typography fontSize="13px" color="#9fb3c8">
                        There is no bet placed till now.
                      </Typography>
                    </Box>
                  )
                ) : openBetsForGame.length > 0 ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      overflow: "auto",
                      py: 0.5,
                    }}
                  >
                    {openBetsForGame.map((bet) => {
                      const isSettled =
                        bet.status !== 0 && bet.status !== undefined;
                      const isWon = bet.status === 1;
                      const isLost = bet.status === 2;
                      const isVoid = bet.status === 3;

                      return (
                        <Box
                          key={bet._id}
                          sx={{
                            p: 1.25,
                            borderRadius: 1,
                            bgcolor: isSettled
                              ? isWon
                                ? "rgba(34, 197, 94, 0.15)"
                                : isLost
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : "rgba(4, 160, 226, 0.12)"
                              : "rgba(4, 160, 226, 0.12)",
                            border: isSettled
                              ? isWon
                                ? "1px solid rgba(34, 197, 94, 0.5)"
                                : isLost
                                  ? "1px solid rgba(239, 68, 68, 0.5)"
                                  : "1px solid rgba(4, 160, 226, 0.3)"
                              : "1px solid rgba(4, 160, 226, 0.3)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              fontSize="12px"
                              fontWeight={700}
                              color="#fff"
                            >
                              {bet.teamName}
                            </Typography>
                            {isSettled && (
                              <Box
                                sx={{
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1,
                                  bgcolor: isWon
                                    ? "rgba(34, 197, 94, 0.3)"
                                    : isLost
                                      ? "rgba(239, 68, 68, 0.3)"
                                      : "rgba(156, 163, 175, 0.3)",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  color: isWon
                                    ? "#22c55e"
                                    : isLost
                                      ? "#ef4444"
                                      : "#9ca3af",
                                }}
                              >
                                {isWon
                                  ? "WON"
                                  : isLost
                                    ? "LOST"
                                    : isVoid
                                      ? "VOID"
                                      : "SETTLED"}
                              </Box>
                            )}
                          </Box>
                          <Typography
                            fontSize="11px"
                            color="#01fafe"
                            fontWeight={600}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {bet.otype === "back"
                              ? "Back (In Favour)"
                              : "Lay (Against)"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 0.5,
                              fontSize: "12px",
                              color: "#9fb3c8",
                            }}
                          >
                            <span>Stake: {bet.price}</span>
                            <span>Odds: {Number(bet.xValue).toFixed(2)}</span>
                          </Box>
                          {bet.marketName && (
                            <Typography
                              fontSize="10px"
                              color="rgba(255,255,255,0.6)"
                              sx={{ mt: 0.25 }}
                            >
                              {bet.marketName}
                            </Typography>
                          )}
                          {/* Show settlement details for fancy bets */}
                          {bet.fancyScore != null && (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                fontSize="10px"
                                color="rgba(255,255,255,0.7)"
                              >
                                Fancy Score: {bet.fancyScore}
                              </Typography>
                              {bet.betResult != null && (
                                <Typography
                                  fontSize="10px"
                                  color="rgba(255,255,255,0.7)"
                                >
                                  Result: {bet.betResult}
                                </Typography>
                              )}
                              {bet.resultAmount != null && bet.status !== 0 && (
                                <Typography
                                  fontSize="10px"
                                  color={
                                    bet.status === 1 ? "#22c55e" : "#ef4444"
                                  }
                                  fontWeight={600}
                                >
                                  {bet.status === 1 ? "+" : "-"}
                                  {bet.resultAmount}
                                </Typography>
                              )}
                              {bet.settledAt && (
                                <Typography
                                  fontSize="9px"
                                  color="rgba(255,255,255,0.5)"
                                  sx={{ mt: 0.25 }}
                                >
                                  Settled:{" "}
                                  {new Date(bet.settledAt).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 120,
                      bgcolor: "#0e2239",
                      borderRadius: 2,
                      border: "1px solid rgba(4, 160, 226, 0.3)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 3,
                    }}
                  >
                    <BlockIcon
                      sx={{ color: "rgba(255,255,255,0.4)", fontSize: 48 }}
                    />
                    <Typography fontSize="13px" color="#9fb3c8">
                      There is no bet placed till now.
                    </Typography>
                  </Box>
                )}
              </div>

              {/* 3. Trending Games */}
              <div
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#071123",
                  border: "1px solid rgba(4, 160, 226, 0.25)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 1.5,
                    py: 1,
                  }}
                >
                  <Typography fontSize="13px" fontWeight={500} color="#fff">
                    Trending Games
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "12px",
                      color: "#01fafe",
                      cursor: "pointer",
                      fontWeight: 400,
                    }}
                  >
                    See more &gt;
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    p: 1,
                    bgcolor: "#071123",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  {trandinggames.map((game) => (
                    <Box
                      key={game.id}
                      component="a"
                      href="#"
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#1C2D40",
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      <Box sx={{ aspectRatio: "1", overflow: "hidden" }}>
                        <img
                          src={game.image}
                          alt="Trending game"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleCloseSettingsMenu}
        PaperProps={{
          sx: {
            backgroundColor: "#1C2D40",
            color: "#fff",
            minWidth: 250,
          },
        }}
      >
        {settingsMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={item.onClick}
            sx={{
              py: 1.5,
              "&:hover": { backgroundColor: "#31425F" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {item.icon}
              <Typography fontSize={14}>{item.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbar.severity === "success" ? "#2e7d32" : "#1976d2",
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
