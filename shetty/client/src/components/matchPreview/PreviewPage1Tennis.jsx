import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  Divider,
  Stack,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  fetchTennisBatingData,
  setSelectedMatch,
} from "../../redux/reducer/tennisSlice";
import BetSlipModal from "./BetSlipModal";
import FancyComponent from "./FancyComponent";
import { trandinggames } from "../inplay/TrandingGame";
import { useSelector, useDispatch } from "react-redux";
import { wsService } from "../../services/WebsocketService";
import {
  createBet,
  createfancyBet,
  getPendingBet,
  messageClear,
} from "../../redux/reducer/betReducer";
function toBackendGameType(uiMarketTitle) {
  const normalized = (uiMarketTitle || "").toUpperCase().replace(/\s+/g, "_");
  const map = {
    MATCH_ODDS: "Match Odds",
  };
  return map[normalized] ?? uiMarketTitle ?? "Market";
}
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

const OddsBox = ({ price, amount, bgColor = "#B2D9FF", locked = false }) => (
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
    {locked ? (
      <LockIcon sx={{ fontSize: 18, opacity: 0.9 }} />
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

function MarketSection({
  title,
  data,
  limits,
  onOddsClick,
  onSettingsClick,
  selectedBet,
  slipAmount,
  marketRowIndex,
  pendingBets = [],
  mobileSlipContent,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isThisMarketSelected =
    marketRowIndex != null &&
    selectedBet?.marketRowIndex !== undefined &&
    selectedBet?.marketRowIndex !== null
      ? selectedBet.marketRowIndex === marketRowIndex
      : selectedBet?.marketTitle === toBackendGameType(title) &&
        selectedBet?.odd != null;
  const stake = Number(slipAmount) || 0;
  const odd = Number(selectedBet?.odd) || 0;
  const profitOrLiability = odd >= 1 ? stake * (odd - 1) : 0;
  const profitLoss =
    selectedBet?.side === "lay" ? -profitOrLiability : profitOrLiability;
  const profitLossStr =
    (profitLoss >= 0 ? "+" : "-") + Math.abs(profitLoss).toFixed(2);
  const totalAmount = stake.toFixed(2);
  const showReturns = isThisMarketSelected && stake > 0;

  return (
    <Box sx={{ mt: 1.5, backgroundColor: "#1C2D40", borderRadius: 5 }}>
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
          <Typography fontWeight={800} color="#fff" fontSize={13}>
            {title}
          </Typography>
        </Stack>
        {limits && (
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {showReturns && (
              <Typography fontSize={11} color="#fff" fontWeight={600}>
                Total: {totalAmount}
              </Typography>
            )}
            <Typography fontSize={11} color="#fff">
              MIN: {limits.min} &nbsp; MAX: {limits.max}
            </Typography>
          </Box>
        )}
      </Box>
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
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "nowrap",
                        width: "100%",
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
                          (sum, b) => sum + (b.price || 0),
                          0
                        );
                        const value = isBetOnThisRow
                          ? "+" +
                            rowPending.reduce(
                              (s, b) => s + (b.betAmount || 0),
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

                      {showReturns &&
                        (() => {
                          const isSelectedRow =
                            String(row.team || "").trim() ===
                            String(selectedBet?.team || "").trim();
                          const value = isSelectedRow
                            ? profitLossStr
                            : selectedBet?.side === "lay"
                              ? "+" + stake.toFixed(2)
                              : "-" + stake.toFixed(2);
                          const isPositive = value.startsWith("+");
                          const boxColor = isPositive ? "#18a21e" : "#e53935";
                          const bgColor = "#fff";
                          return (
                            <Box
                              sx={{
                                backgroundColor: bgColor,
                                color: boxColor,
                                fontSize: "13px",
                                fontWeight: 700,
                                px: 1,
                                py: 0.25,
                                borderRadius: "8px",
                              }}
                            >
                              {value}
                            </Box>
                          );
                        })()}
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
                          <OddsBox locked bgColor="#B2D9FF" />
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
                          <OddsBox locked bgColor="#ffc3dc" />
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
                    <TableCell colSpan={3} sx={{ p: 0, border: "none", verticalAlign: "top" }}>
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
            minHeight: { xs: 40, sm: 48 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: 500,
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

function formatMarketLimit(value) {
  if (value == null || value === 0) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function normalizeMname(mname) {
  if (!mname || typeof mname !== "string") return "";
  return mname
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

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
    return {
      team: sec.nat || "",
      back: backOdds.length > 0 ? backOdds : [{ price: "-", amount: "-" }],
      lay: layOdds.length > 0 ? layOdds : [{ price: "-", amount: "-" }],
      ...(locked && { locked: true }),
    };
  });
}

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
  return {
    title: sec.nat || "",
    book: "Book",
    values: [
      { top: backPrice, bottom: backSize },
      { top: layPrice, bottom: laySize },
    ],
    min: sec.min != null ? String(sec.min) : "100",
    max:
      sec.max != null
        ? sec.max >= 1000
          ? `${(sec.max / 1000).toFixed(0)}K`
          : String(sec.max)
        : "25K",
    locked: !!locked,
  };
}

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
      if (seenIds.has(id)) {
        const existing = sections.find((s) => s.id === id);
        if (existing)
          market.section.forEach((sec) =>
            existing.rows.push(sectionToRow(sec))
          );
        return;
      }
      seenIds.add(id);
      sections.push({
        id,
        label: mname,
        rows: market.section.map(sectionToRow),
      });
    });
  return sections.filter((s) => (s.rows || []).length > 0);
}

const defaultMatchInfo = { teams: "Tennis Match", date: "", time: "" };

export default function PreviewPage1Tennis() {
  const [searchParams] = useSearchParams();
  const gameIdFromUrl = searchParams.get("gameid");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const match =
    location.state?.match ?? useSelector((state) => state.tennis.selectedMatch);
  const { battingData } = useSelector((state) => state.tennis);
  const userId = useSelector(
    (state) =>
      state.auth?.userInfo?._id ??
      state.auth?.userInfo?.id ??
      localStorage.getItem("userId")
  );

  const [activeTab, setActiveTab] = useState("FANCY");
  const [slipTab, setSlipTab] = useState("BET_SLIP");
  const [slipAmount, setSlipAmount] = useState(0);
  const [selectedBet, setSelectedBet] = useState({
    team: "",
    odd: "",
    side: "",
    marketTitle: "",
    marketRowIndex: null,
  });
  const hasCheckedRef = useRef(false);
  const marketSectionMarkets = getMarketSectionMarkets(battingData);
  const groupedFancySections = getGroupedFancySections(battingData);
  const displayName = match?.name ?? defaultMatchInfo.teams;
  const rawDateTime = match?.date ?? match?.datetime ?? "";
  const parts = rawDateTime.trim() ? rawDateTime.trim().split(/\s+/) : [];
  const displayDate = match
    ? (parts[0] ?? defaultMatchInfo.date)
    : defaultMatchInfo.date;
  const displayTime = match
    ? parts.slice(1).join(" ") || defaultMatchInfo.time
    : defaultMatchInfo.time;

  const formatTimeLine = (t) =>
    !t || typeof t !== "string"
      ? ""
      : t.replace(/(\d{1,2}:\d{2}):\d{2}(\s*[AP]M?)/i, "$1$2").trim();
  const formatDateLine = (d) => {
    if (!d || typeof d !== "string") return "";
    const p = d.split("/").map(Number);
    if (p.length !== 3 || p.some(isNaN)) return d;
    const [mo, day, year] = p;
    const date = new Date(year, mo - 1, day);
    return `${date.getDate()} ${date.toLocaleString("en", { month: "short" })} ${date.getFullYear()}`;
  };

  useEffect(() => {
    if (!gameIdFromUrl) return;
    dispatch(
      setSelectedMatch({ id: gameIdFromUrl, name: "Loading…", date: "" })
    );
    dispatch(fetchTennisBatingData(gameIdFromUrl));
  }, [gameIdFromUrl, dispatch]);

  useEffect(() => {
    const gameId = gameIdFromUrl || match?.id;
    if (!gameId) return;
    wsService.connect(dispatch, userId);
    wsService.subscribe(gameId, "tennis", null);
  }, [gameIdFromUrl, match?.id, dispatch, userId]);

  const handleOddsClick = (team, price, side, marketTitle, marketRowIndex) => {
    if (price === "-") return;
    setSlipTab("BET_SLIP");
    setSelectedBet({
      team,
      odd: price,
      side,
      marketTitle,
      marketRowIndex: marketRowIndex ?? null,
    });
  };

  const gameId = gameIdFromUrl || match?.id;
  const sid =
    (Array.isArray(battingData) &&
      battingData[0] != null &&
      battingData[0].sid) ||
    (Array.isArray(battingData) &&
      battingData[0] != null &&
      battingData[0].gmid) ||
    gameId ||
    "1";

  const betLoading = useSelector((state) => state.bet?.loading);
  const betErrorMessage = useSelector((state) => state.bet?.errorMessage);
  const betSuccessMessage = useSelector((state) => state.bet?.successMessage);
  const pendingBet = useSelector((state) => state.bet?.pendingBet ?? []);
  const openBetsForGame = (pendingBet || []).filter(
    (b) => String(b.gameId) === String(gameId)
  );
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
    const marketName = toBackendGameType(selectedBet.marketTitle || "Market");
    const teamName = selectedBet.team || "Fancy";
    const otype = (selectedBet.side || "back").toLowerCase();
    const isFancy = (selectedBet.marketTitle || "").toUpperCase() === "FANCY";
    const formData = {
      gameId,
      sid: String(sid),
      price: String(stake),
      xValue: String(odd),
      fancyScore: isFancy ? String(selectedBet.team ?? "") : null,
      gameType: isFancy ? "Normal" : marketName,
      eventName,
      marketName,
      gameName: "Tennis Game",
      teamName,
      otype,
    };
    try {
      await dispatch(
        isFancy ? createfancyBet(formData) : createBet(formData)
      ).unwrap();
      setSelectedBet({
        team: "",
        odd: "",
        side: "",
        marketTitle: "",
        marketRowIndex: null,
      });
      setSlipAmount(0);
      dispatch(getPendingBet(gameId));
    } catch (_) {
      // Error shown via Snackbar from bet state
    }
  };

  const handleSnackbarClose = () => dispatch(messageClear());
  const handleSettingsClick = (event, title, data, limits) => {
    setSettingsAnchorEl(event.currentTarget);
    setSelectedMarketData({ title, data, limits });
  };
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
          width: "100%",
          minHeight: "100vh",
          background: "#071123",
          py: 1.25,
          px: 1.25,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            width: "100%",
            maxWidth: "100%",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "1 1 66.666%" },
              minWidth: 0,
            }}
          >
            <div
              style={{
                background: "#122036",
                borderRadius: 10,
                padding: 16,
                height: "100%",
              }}
            >
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
              {marketSectionMarkets.map((market, rowIndex) => {
                const data = transformApiMarketToUI(market);
                if (data.length === 0) return null;
                const limits = {
                  min: market.min != null && market.min > 0 ? market.min : 100,
                  max: formatMarketLimit(market.max) || "25K",
                };
                const backendMarket = toBackendGameType(
                  market.mname || "Market"
                );
                const pendingForThisMarket = (pendingBet || []).filter(
                  (b) =>
                    String(b.gameId) === String(gameId) &&
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
                              gameType={selectedBet.marketTitle || "Match Odds"}
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
                  <React.Fragment key={market.mid ?? market.mname}>
                    <MarketSection
                      title={market.mname || "Market"}
                      data={data}
                      limits={limits}
                      onOddsClick={handleOddsClick}
                      onSettingsClick={handleSettingsClick}
                      selectedBet={selectedBet}
                      slipAmount={slipAmount}
                      marketRowIndex={rowIndex}
                      pendingBets={pendingForThisMarket}
                      mobileSlipContent={mobileSlipContent}
                    />
                  </React.Fragment>
                );
              })}
              <Box mt={2} mb={1}>
                <TabPillSwitch value={activeTab} onChange={setActiveTab} />
                <Divider
                  sx={{
                    borderColor: "rgba(255,255,255,0.2)",
                    mt: 2,
                    mb: 1,
                    justifyContent: "center",
                  }}
                />
              </Box>
              {activeTab === "FANCY" && (
                <Box mt={2}>
                  <FancyComponent
                    sections={groupedFancySections}
                    onBetClick={(matchName, odd, side) => {
                      setSlipTab("BET_SLIP");
                      setSelectedBet({
                        team: matchName,
                        odd,
                        side: side || "back",
                        marketTitle: "FANCY",
                        marketRowIndex: null,
                      });
                    }}
                  />
                  {/* Mobile: show bet slip inline below Fancy when selection is from Fancy */}
                  {selectedBet?.odd &&
                    String(selectedBet.marketTitle || "").trim() ===
                      "FANCY" && (
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
                                slipTab === "BET_SLIP"
                                  ? "#002b36"
                                  : "#9fb3c8",
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
                                slipTab === "OPEN_BETS"
                                  ? "#002b36"
                                  : "#9fb3c8",
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
                            gameType={selectedBet.marketTitle || "Match Odds"}
                            amount={slipAmount}
                            onAmountChange={setSlipAmount}
                            onPlaceBet={handlePlaceBet}
                            placeBetLoading={betLoading}
                            isFancy
                            marketTitle="FANCY"
                            onClearSelection={() => {
                              setSelectedBet({
                                team: "",
                                odd: "",
                                side: "",
                                marketTitle: "",
                                marketRowIndex: null,
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
            </div>
          </Box>
          {/* Right Sidebar - takes 1/3 of row, no gap at end */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flex: "0 0 33.333%",
              minWidth: 280,
              alignSelf: "flex-start",
              position: "sticky",
              top: 10,
            }}
          >
            <div
              style={{
                background: "#0e2239",
                borderRadius: "10px",
                width: "100%",
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
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
                      gameType={selectedBet.marketTitle || "Match Odds"}
                      amount={slipAmount}
                      onAmountChange={setSlipAmount}
                      onPlaceBet={handlePlaceBet}
                      placeBetLoading={betLoading}
                      isFancy={(selectedBet?.marketTitle || "").toUpperCase() === "FANCY"}
                      onClearSelection={() => {
                        setSelectedBet({
                          team: "",
                          odd: "",
                          side: "",
                          marketTitle: "",
                          marketRowIndex: null,
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
                    {openBetsForGame.map((bet) => (
                      <Box
                        key={bet._id}
                        sx={{
                          p: 1.25,
                          borderRadius: 1,
                          bgcolor: "rgba(4, 160, 226, 0.12)",
                          border: "1px solid rgba(4, 160, 226, 0.3)",
                        }}
                      >
                        <Typography
                          fontSize="12px"
                          fontWeight={700}
                          color="#fff"
                          sx={{ mb: 0.5 }}
                        >
                          {bet.teamName}
                        </Typography>
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
                      </Box>
                    ))}
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
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
