/**
 * Mirrors backend betController.js placeBet calculation (lines 851-882).
 * Given user stake (price), odds (xValue), otype (back/lay), and gameType,
 * returns liability (p) and potential profit (betAmount) so UI matches server.
 */
export function calculateBetAmounts(price, xValue, otype, gameType) {
  const p = parseFloat(price) || 0;
  const x = parseFloat(xValue) || 0;
  const isLay = String(otype || "").toLowerCase() === "lay";
  let liability = p;
  let betAmount = 0;

  const normalizedType = (String(gameType || "").trim() || "Match Odds").replace(/\s+/g, " ");

  switch (normalizedType) {
    case "Match Odds":
    case "Tied Match":
    case "Winner":
    case "OVER_UNDER_05":
    case "OVER_UNDER_15":
    case "OVER_UNDER_25":
      betAmount = isLay ? p : p * (x - 1);
      liability = isLay ? p * (x - 1) : p;
      break;
    case "Bookmaker":
    case "Bookmaker IPL CUP":
      betAmount = isLay ? p : p * (x / 100);
      liability = isLay ? p * (x / 100) : p;
      break;
    case "Toss":
    case "1st 6 over":
      betAmount = isLay ? p : p * (x - 1);
      liability = isLay ? p * (x - 1) : p;
      break;
    default:
      // Default: Match Odds style (e.g. Game Winner 2/3, MATCH_ODDS display names)
      betAmount = isLay ? p : p * (x - 1);
      liability = isLay ? p * (x - 1) : p;
  }

  return {
    originalStake: p,
    liability: parseFloat(liability.toFixed(2)),
    betAmount: parseFloat(betAmount.toFixed(2)),
  };
}
