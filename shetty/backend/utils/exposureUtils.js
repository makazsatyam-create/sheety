/**
 * Exposure Calculation Utilities
 * Centralized functions for calculating user exposure from bets
 *
 * RULES:
 * 1. Normal bet (price > 0, betAmount > 0): exposure = price
 * 2. Offset bet (betAmount < 0): exposure = MAX(|betAmount|, price)
 * 3. Guaranteed profit (price < 0): exposure = 0
 * 4. Fully hedged (price = 0, betAmount = 0): exposure = 0
 */

import {
  calculateMarketExposure,
  calculateOutcomeScenarios,
  groupBetsByMarket,
} from './marketCalculationUtils.js';

/**
 * Fancy game types — the single source of truth for detecting fancy bets.
 * Fancy bets use score-based scenarios, NOT team-based outcome scenarios.
 * Note: betType is always 'sports' or 'casino' — never 'fancy'.
 */
export const FANCY_GAME_TYPES = ['Normal', 'meter', 'line', 'ball', 'khado'];

/**
 * Detect whether a bet is a fancy bet based on gameType.
 * DO NOT use betType === 'fancy' — that value doesn't exist in the enum.
 */
export function isFancyBet(bet) {
  return FANCY_GAME_TYPES.includes(bet.gameType);
}

/**
 * Calculate fancy exposure using threshold-based scenario enumeration per market.
 * Groups fancy bets by gameId + teamName, then finds worst-case across ALL
 * possible score zones defined by unique fancyScore thresholds.
 *
 * For N distinct fancyScores in a market, there are N+1 outcome zones:
 *   Zone 0:   score < lowest threshold   (all bets miss)
 *   Zone 1:   threshold[0] <= score < threshold[1]
 *   ...
 *   Zone N:   score >= highest threshold  (all bets hit)
 *
 * A bet at threshold index j:
 *   HITS (score >= fancyScore) in zones k > j
 *   MISSES (score < fancyScore) in zones k <= j
 *
 * Settlement payout (matches fancyBetSettlementService):
 *   Hit  → back wins (+betAmount), lay loses (-price)
 *   Miss → back loses (-price),    lay wins (+betAmount)
 *
 * This correctly handles the "gap zone" where back@high + lay@low can BOTH lose.
 */
export function calculateFancyExposure(fancyBets) {
  if (!Array.isArray(fancyBets) || fancyBets.length === 0) return 0;

  const marketMap = {};
  for (const bet of fancyBets) {
    if (!bet.teamName) continue;
    const key = `${bet.gameId}_${bet.teamName}`;
    if (!marketMap[key]) marketMap[key] = [];
    marketMap[key].push(bet);
  }

  let exposure = 0;
  for (const bets of Object.values(marketMap)) {
    // Collect unique fancyScore thresholds, sorted ascending
    const thresholds = [
      ...new Set(
        bets.map((b) => {
          const s = parseFloat(b.fancyScore);
          return isNaN(s) ? 0 : s;
        })
      ),
    ].sort((a, b) => a - b);

    // Build threshold → index map for O(1) lookup
    const idxMap = new Map(thresholds.map((t, i) => [t, i]));

    // Evaluate N+1 zones: worst-case net P/L across all zones
    let worstNet = Infinity;

    for (let k = 0; k <= thresholds.length; k++) {
      let zoneNet = 0;

      for (const bet of bets) {
        const s = parseFloat(bet.fancyScore);
        const j = idxMap.get(isNaN(s) ? 0 : s);
        const hits = k > j;

        if (bet.otype === 'back') {
          zoneNet += hits ? bet.betAmount : -bet.price;
        } else {
          zoneNet += hits ? -bet.price : bet.betAmount;
        }
      }

      if (zoneNet < worstNet) worstNet = zoneNet;
    }

    exposure += Math.abs(Math.min(0, worstNet));
  }

  return exposure;
}

/**
 * Calculate non-fancy exposure using market-based scenario analysis.
 * Groups bets by market and calculates worst-case loss per market.
 * This correctly handles back+lay offsetting within the same market.
 */
export function calculateNonFancyMarketExposure(nonFancyBets) {
  if (!Array.isArray(nonFancyBets) || nonFancyBets.length === 0) return 0;

  const markets = groupBetsByMarket(nonFancyBets);
  let totalExposure = 0;

  for (const [, marketBets] of Object.entries(markets)) {
    const scenarios = calculateOutcomeScenarios(marketBets);
    totalExposure += calculateMarketExposure(scenarios);
  }

  return totalExposure;
}

/**
 * Calculate total exposure for ALL pending bets (fancy + non-fancy).
 * This is the single correct function to use everywhere exposure is recalculated.
 *
 * - Fancy bets: threshold-enumeration (handles multi-fancyScore gap zones)
 * - Non-fancy bets: market-based scenario analysis (handles back+lay offsetting)
 */
export function calculateAllExposure(pendingBets) {
  if (!Array.isArray(pendingBets) || pendingBets.length === 0) return 0;

  const fancyBets = pendingBets.filter((b) => isFancyBet(b));
  const nonFancyBets = pendingBets.filter((b) => !isFancyBet(b));

  return (
    calculateFancyExposure(fancyBets) +
    calculateNonFancyMarketExposure(nonFancyBets)
  );
}

/**
 * Calculate exposure for a single bet
 * Handles all edge cases: normal, negative betAmount, negative price
 *
 * @param {Object} bet - Bet object with price and betAmount
 * @returns {Number} Exposure amount for this bet
 *
 * @example
 * // Normal bet
 * calculateBetExposure({ price: 100, betAmount: 50 }) // returns 100
 *
 * // Offset bet (Case 1: negative betAmount)
 * calculateBetExposure({ price: 42, betAmount: -7 }) // returns 42 (MAX of 7, 42)
 *
 * // Offset bet (Case 1: betAmount larger)
 * calculateBetExposure({ price: 1, betAmount: -9 }) // returns 9 (MAX of 9, 1)
 *
 * // Guaranteed profit (Case 2: negative price)
 * calculateBetExposure({ price: -100, betAmount: 30 }) // returns 0
 */
export function calculateBetExposure(bet) {
  if (!bet) return 0;

  const price = bet.price || 0;
  const betAmount = bet.betAmount || 0;

  // Negative price = guaranteed profit, no exposure
  if (price < 0) {
    return 0;
  }

  // Negative betAmount = offset bet, use worst-case (MAX of |betAmount| or price)
  if (betAmount < 0) {
    return Math.max(Math.abs(betAmount), price);
  }

  // Normal bet: exposure = price (stake at risk)
  return price;
}

/**
 * Calculate total exposure from an array of pending bets
 *
 * @param {Array} pendingBets - Array of pending bet documents
 * @returns {Number} Total exposure
 *
 * @example
 * calculateTotalExposure([
 *   { price: 100, betAmount: 50 },
 *   { price: 42, betAmount: -7 }
 * ]) // returns 100 + 42 = 142
 */
export function calculateTotalExposure(pendingBets) {
  if (!Array.isArray(pendingBets) || pendingBets.length === 0) return 0;

  return pendingBets.reduce((sum, bet) => {
    return sum + calculateBetExposure(bet);
  }, 0);
}

export default {
  calculateBetExposure,
  calculateTotalExposure,
  FANCY_GAME_TYPES,
  isFancyBet,
  calculateFancyExposure,
  calculateNonFancyMarketExposure,
  calculateAllExposure,
};
