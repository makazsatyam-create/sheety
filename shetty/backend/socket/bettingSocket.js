// socket/bettingSocket.js

// WebSocketServer - from the ws library, lets you create a WebSocketServer that client (browsers, app) can connect to
import axios from "axios";
import dotenv from "dotenv";
import io from "socket.io-client";
import { WebSocketServer } from "ws";

dotenv.config();

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

// Global State
// clients -> Array holding all connected clients each with
// --> ws (the websocket connection)
// --> gameid (the match they subscribed to)
// --> apitype (the sport: cricket, tennis, soccer, etc)
// --> His browser sends { "type": "subscribe", "gameid": "1234", "apitype": "cricket" }
// --> His server adds him to clients[]
// --> clients = [ { ws: RahulSocket, gameid: "1234", apitype: "cricket" } ]
export let clients = [];

// Cached data -> Stores the latest data fetched for each gameid + apitype combo so you can avoid sending duplicate updates
let cachedData = {};
let wssInstance = null;

const casinoBettingCache = new Map();
const roundIdCache = new Map();

//  NEW: Cache for casino results to prevent duplicate result broadcasts
let cachedCasinoResults = new Map();

//  NEW: Cache for recent results to prevent sending old results
let recentResultsCache = new Map();

// Store score socket connection per match
let liveScoreSockets = {};

//Caching the balance ,exposure and open bets

const lastSentValues = {
  balance: new Map(),
  exposure: new Map(),
  openBets: new Map(),
};

// helper: subscribe to the Live score
const subscribeToLiveScore = (gameid, apitype) => {
  const key = `${gameid}_${apitype}`;

  // Prevent duplicate socket connections for same game
  if (liveScoreSockets[key]) {
    console.log(` Already subscribed to live score for ${gameid} (${apitype})`);
    return;
  }

  try {
    console.log(`⚡ Connecting to live score for ${gameid} (${apitype})...`);

    const scoreSocket = io(BASE_SCORE_URL, {
      transports: ["websocket"],
      reconnection: false, // disable auto reconnect
      timeout: 20000,
      forceNew: true,
    });

    liveScoreSockets[key] = scoreSocket;

    //  When connected
    scoreSocket.on("connect", () => {
      console.log(` Connected to live score for ${gameid} (${apitype})`);
      scoreSocket.emit("subscribe", { gameid, apitype });
    });

    //  When score updates arrive
    scoreSocket.on("score_update", (data) => {
      console.log(` Live update for ${gameid} (${apitype}):`, data);
    });

    // When disconnected
    scoreSocket.on("disconnect", (reason) => {
      console.warn(` Disconnected from ${gameid} (${apitype}):`, reason);
      delete liveScoreSockets[key];
    });

    //  Handle connection errors safely
    scoreSocket.on("connect_error", (err) => {
      console.error(
        ` Score socket error for ${gameid} (${apitype}):`,
        err.message,
      );

      // Close and clean current socket
      try {
        scoreSocket.close();
      } catch (closeErr) {
        console.error(" Error while closing socket:", closeErr.message);
      }

      delete liveScoreSockets[key];

      // Retry safely after 5 seconds (no recursion)
      setTimeout(() => {
        console.log(` Reconnecting to ${gameid} (${apitype})...`);
        subscribeToLiveScore(gameid, apitype);
      }, 5000);
    });
  } catch (err) {
    console.error(
      " Unexpected error while subscribing to live score:",
      err.message,
    );
  }
};

// Helper function to get unique subscriptions
// const getUniqueSubscriptions = () => {
//     const uniqueSubscriptions = clients
//         .map((c) => {
//             if (!c.gameid) return null;

//             if (c.apitype === "casino") {
//                 return {
//                     gameid: c.gameid,
//                     apitype: c.apitype,
//                     roundId: c.roundId  // ✅ Include roundId for casino
//                 };
//             } else {
//                 return {
//                     gameid: c.gameid,
//                     apitype: c.apitype || "cricket"
//                 };
//             }
//         })
//         .filter(Boolean);

//     return [
//         ...new Map(uniqueSubscriptions.map((obj) => {
//             if (obj.apitype === "casino" && obj.roundId) {
//                 return [`${obj.gameid}_${obj.apitype}_${obj.roundId}`, obj];
//             } else {
//                 return [`${obj.gameid}_${obj.apitype}`, obj];
//             }
//         })).values(),
//     ];
// };
const getUniqueSubscriptions = () => {
  const uniqueSubscriptions = clients
    .map((c) => {
      if (!c.gameid) return null;

      if (c.apitype === "casino") {
        return {
          gameid: c.gameid,
          apitype: c.apitype,
          roundId: c.roundId,
        };
      } else {
        return {
          gameid: c.gameid,
          apitype: c.apitype || "cricket",
        };
      }
    })
    .filter(Boolean);

  return [
    ...new Map(
      uniqueSubscriptions.map((obj) => {
        if (obj.apitype === "casino" && obj.roundId) {
          return [`${obj.gameid}_${obj.apitype}_${obj.roundId}`, obj];
        } else {
          return [`${obj.gameid}_${obj.apitype}`, obj];
        }
      }),
    ).values(),
  ];
};

// Poll betting data for cricket, tennis, soccer
const pollBettingData = async () => {
  const groupedByGameId = getUniqueSubscriptions();

  for (const { gameid, apitype } of groupedByGameId) {
    try {
      // Skip casino games in this function
      if (apitype === "casino") continue;

      let sid = 4; // default cricket
      if (apitype === "tennis") sid = 2;
      else if (apitype === "soccer") sid = 1;

      const endpoint = `${API_URL}/getPriveteData?key=${API_KEY}&gmid=${gameid}&sid=${sid}`;
      const response = await axios.get(endpoint);
      const newData = response.data;

      if (newData.success) {
        const cacheKey = `${gameid}_${apitype}`;
        if (JSON.stringify(newData) !== JSON.stringify(cachedData[cacheKey])) {
          cachedData[cacheKey] = newData;

          clients.forEach((client) => {
            if (
              client.gameid === gameid &&
              client.apitype === apitype &&
              client.ws.readyState === 1
            ) {
              client.ws.send(
                JSON.stringify({
                  type: "bettingData",
                  gameid,
                  apitype,
                  data: newData.data,
                }),
              );
            }
          });
        }
      }
    } catch (error) {
      console.error(`Polling error for ${gameid} (${apitype}):`, error.message);
    }
  }
};

// Poll casino betting data - IMMEDIATE (no delays)
const pollCasinoBettingData = async () => {
  const groupedByGameId = getUniqueSubscriptions();

  for (const { gameid, apitype } of groupedByGameId) {
    try {
      // Only poll betting data for casino games
      if (apitype === "casino") {
        const endpoint = `${API_URL}/casino/data?key=${API_KEY}&type=${gameid}`;
        const response = await axios.get(endpoint);
        const newBettingData = response.data;

        if (newBettingData.success && newBettingData.data) {
          const newRoundId = newBettingData.data.mid;
          const cacheKey = `betting_${gameid}_${apitype}`;

          // Simple check: only send if data changed
          const currentCached = cachedData[cacheKey];
          if (
            JSON.stringify(currentCached) !== JSON.stringify(newBettingData)
          ) {
            console.log(
              ` [${new Date().toISOString()}] Data changed for ${gameid}`,
            );

            // IMMEDIATE: Update cache and send betting data right away
            cachedData[cacheKey] = newBettingData;

            // Send casino_update
            clients.forEach((client) => {
              if (
                client.gameid === gameid &&
                client.apitype === apitype &&
                client.ws.readyState === 1
              ) {
                client.ws.send(
                  JSON.stringify({
                    type: "casino_update",
                    gameid,
                    apitype,
                    data: newBettingData.data,
                  }),
                );
              }
            });

            // ✅ REMOVED: casino_result_update WebSocket messages
            // Frontend now uses API calls (fetchCasinoResultData) when round changes
            // This is triggered by useRef detection in WebSocket handler
            // Benefits: Reduced bandwidth, no duplicate messages, cleaner logs
          }
        }
      }
    } catch (error) {
      console.error(
        `Casino betting data polling error for ${gameid} (${apitype}):`,
        error.message,
      );
    }
  }
};

// const pollResultData = async () => {
//     console.log("pollResultData function called Casino")
//     const groupedByGameId = getUniqueSubscriptions();
//     console.log("groupedByGameIdCasino", groupedByGameId)

//     for (const { gameid, apitype, roundId } of groupedByGameId) {
//         try {
//             if (apitype === "casino") {
//                 if (roundId) {
//                     // ✅ Round-based polling: Get all results and filter for specific round
//                     console.log(`[CASINO POLLING] Polling round ${roundId} of game ${gameid}`);
//                     const endpoint = `${API_URL}/casino/result?key=${API_KEY}&type=${gameid}`;

//                     const response = await axios.get(endpoint);
//                     const newResultData = response.data;

//                     if (newResultData.success && newResultData.data?.res) {
//                         // ✅ FIX: Find the specific round result
//                         const matchingResult = newResultData.data.res.find(result =>
//                             result.mid === roundId || result.mid === String(roundId)
//                         );

//                         if (matchingResult) {
//                             const cacheKey = `result_${gameid}_${roundId}`;
//                             const newMid = matchingResult.mid;
//                             const cachedMid = cachedResultData[cacheKey]?.mid;

//                             if (newMid && newMid !== cachedMid) {
//                                 console.log(`🎲 [POLLING] New result for round ${roundId}: mid=${newMid}, result=${matchingResult.result || matchingResult.winner}`);
//                                 cachedResultData[cacheKey] = matchingResult;

//                                 let sentCount = 0;
//                                 clients.forEach((client) => {
//                                     if (
//                                         client.gameid === gameid &&
//                                         client.apitype === apitype &&
//                                         client.roundId === roundId &&
//                                         client.ws.readyState === 1
//                                     ) {
//                                         client.ws.send(JSON.stringify({
//                                             type: "casino_result_update",
//                                             gameid,
//                                             roundId,
//                                             apitype,
//                                             resultData: matchingResult  // Send only the matching round result
//                                         }));
//                                         sentCount++;
//                                     }
//                                 });
//                                 console.log(`📤 [POLLING] Sent to ${sentCount} clients for round ${roundId}`);
//                             } else {
//                                 console.log(`⏸️ [CASINO POLLING] No new results for round ${roundId} (mid unchanged)`);
//                             }
//                         } else {
//                             console.log(`⚠️ [CASINO POLLING] No matching result found for round ${roundId} in game ${gameid}`);
//                         }
//                     } else {
//                         console.log(`❌ [CASINO POLLING] API returned success=false for game ${gameid}`);
//                     }
//                 } else {
//                     // ✅ Game-based polling: Send all results (fallback)
//                     console.log(`[CASINO POLLING] Fallback: Polling game ${gameid} (roundId is ${roundId})`);
//                     const endpoint = `${API_URL}/casino/result?key=${API_KEY}&type=${gameid}`;

//                     const response = await axios.get(endpoint);
//                     const newResultData = response.data;

//                     if (newResultData.success) {
//                         const cacheKey = `result_${gameid}_game`;
//                         const newMid = newResultData?.data?.res?.[0]?.mid;
//                         const cachedMid = cachedResultData[cacheKey]?.data?.res?.[0]?.mid;

//                         if (newMid && newMid !== cachedMid) {
//                             console.log(`🎲 [POLLING] New result for game ${gameid}: mid=${newMid}`);
//                             cachedResultData[cacheKey] = newResultData;

//                             let sentCount = 0;
//                             clients.forEach((client) => {
//                                 if (
//                                     client.gameid === gameid &&
//                                     client.apitype === apitype &&
//                                     client.ws.readyState === 1
//                                 ) {
//                                     client.ws.send(JSON.stringify({
//                                         type: "casino_result_update",
//                                         gameid,
//                                         apitype,
//                                         resultData: newResultData.data
//                                     }));
//                                     sentCount++;
//                                 }
//                             });
//                             console.log(`📤 [POLLING] Sent to ${sentCount} clients for game ${gameid}`);
//                         } else {
//                             console.log(`⏸️ [CASINO POLLING] No new results for game ${gameid} (mid unchanged)`);
//                         }
//                     } else {
//                         console.log(`❌ [CASINO POLLING] API returned success=false for game ${gameid}`);
//                     }
//                 }
//             } else {
//                 console.log(`⏭️ [CASINO POLLING] Skipping ${gameid} (${apitype}) - not casino`);
//             }
//         } catch (error) {
//             console.error(`Result polling error for ${gameid} (${apitype}):`, error.message);
//         }
//     }
// };

// Add at the top of bettingSocket.js
// const processedResults = new Map();

// In your pollResultData function
// const pollResultData = async () => {
//   const groupedByGameId = getUniqueSubscriptions();

//   for (const { gameid, apitype, roundId } of groupedByGameId) {
//     try {
//       if (apitype === "casino") {
//         const endpoint = `${API_URL}/casino/result?key=${API_KEY}&type=${gameid}`;
//         const response = await axios.get(endpoint);
//         const newResultData = response.data;

//         if (newResultData.success && newResultData.data?.res) {
//           if (roundId) {
//             const matchingResult = newResultData.data.res.find(result =>
//               result.mid === roundId || result.mid === String(roundId)
//             );

//             if (matchingResult) {
//               const resultKey = `${gameid}_${roundId}_${matchingResult.mid}`;

//               //  FIX: Check if result already processed
//               if (!processedResults.has(resultKey)) {
//                 console.log(`🎲 [CASINO] New result for round ${roundId}`);
//                 processedResults.set(resultKey, matchingResult); //  Store result for frontend

//                 // Broadcast result to frontend
//                 let sentCount = 0;
//                 clients.forEach((client) => {
//                   if (
//                     client.gameid === gameid &&
//                     client.apitype === apitype &&
//                     client.roundId === roundId &&
//                     client.ws.readyState === 1
//                   ) {
//                     client.ws.send(JSON.stringify({
//                       type: "casino_result_update",
//                       gameid,
//                       roundId,
//                       apitype: "casino",
//                       resultData: matchingResult // ✅ Send result to frontend
//                     }));
//                     sentCount++;
//                   }
//                 });
//                 console.log(` [CASINO] Sent to ${sentCount} clients for round ${roundId}`);
//               } else {
//                 console.log(`⏭ [CASINO] Result already processed for round ${roundId}`);
//               }
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error(`❌ [CASINO] Error for ${gameid}:`, error.message);
//     }
//   }
// };

// setupWebSocket is called with your HTTP server so that the WebSocket server can share the same port
export const setupWebSocket = (server) => {
  // Create a WebSocket server (wss) that listens for client connections
  const wss = new WebSocketServer({ server });

  // Every time someone connects we:
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    //  Create client object with roundId and userId
    let client = {
      ws,
      gameid: null,
      apitype: null,
      roundId: null,
      userId: null,
      userName: null,
    };
    clients.push(client);

    //  Complete message handler
    ws.on("message", (message) => {
      try {
        const jsonStr = message.toString();
        const data = JSON.parse(jsonStr);

        if (data.type === "subscribe" && data.gameid) {
          client.gameid = data.gameid;
          client.apitype = data.apitype || "cricket";
          client.roundId = data.roundId || null;
          client.userId = data.userId || null;

          console.log(
            `🔗 [WS] Subscribed: ${data.gameid} (${client.apitype}) roundId: ${client.roundId} userId: ${client.userId}`,
          );

          //  ESSENTIAL: Clear only betting/results cache, keep deduplication cache
          if (client.apitype === "casino") {
            const bettingCacheKey = `betting_${client.gameid}_casino`;
            const resultsCacheKey = `results_${client.gameid}_casino`;
            delete cachedData[bettingCacheKey];
            delete cachedData[resultsCacheKey];
            //  DON'T clear deduplication cache keys (message_*, results_*)
            console.log(
              `[CACHE] Cleared betting/results cache for ${client.gameid} (kept deduplication cache)`,
            );
          }

          //  FIX: Subscribe to live score socket for this game
          subscribeToLiveScore(client.gameid, client.apitype);
        }
      } catch (err) {
        console.error(" [WS] Invalid message:", err.message);
      }
    });

    // Remove the disconnected client from the clients array
    ws.on("close", () => {
      clients = clients.filter((c) => c.ws !== ws);
      console.log(" WebSocket client disconnected");
    });
  });

  // Start all polling intervals
  setInterval(pollBettingData, 3000);
  setInterval(pollCasinoBettingData, 2000);
};

//  REMOVED: sendCasinoResultUpdate function
// Frontend now uses API calls (fetchCasinoResultData) triggered by useRef round detection
// This function is no longer needed and has been replaced with the optimized approach

//FUNCTION THAT SENDS BALANCE UPDATES TO ALL THE CONNECTED CLIENTS
export const sendBalanceUpdates = (userId, newBalance) => {
  console.log(" [WEBSOCKET] Sending balance update:");
  console.log(" User ID:", userId);
  console.log(" New Balance:", newBalance);
  console.log(" Connected Clients:", clients.length);

  //Check if the value is changed
  const lastBalance = lastSentValues.balance.get(userId);

  if (lastBalance === newBalance) {
    console.log("Skipped-No Change");
    return;
  }

  let sentCount = 0;

  //Send only if the Value is Changed
  clients.forEach((client) => {
    if (client.ws.readyState === 1) {
      client.ws.send(
        JSON.stringify({
          type: "balance_update",
          userId: userId,
          newBalance: newBalance,
        }),
      );
      sentCount++;
      console.log(` [WEBSOCKET] Sent to client ${sentCount}`);
    }
  });

  //Update Cache
  lastSentValues.balance.set(userId, newBalance);

  console.log(` [WEBSOCKET] Sent to ${sentCount} clients`);
};

//FUNCTIONS THAT SEND EXPOSURE UPDATES TO ALL THE CONNECTED CLIENTS
export const sendExposureUpdates = (userId, newExposure) => {
  console.log("[WEBSOCKET] Sending exposure update:");
  console.log("User ID:", userId);
  console.log(" New Exposure:", newExposure);
  console.log(" Connected Clients:", clients.length);

  const lastExposure = lastSentValues.exposure.get(userId);
  if (lastExposure === newExposure) {
    console.log("Skipped-No Change");
    return;
  }

  let sentCount = 0;

  //Send only if the Value is Changed
  clients.forEach((client) => {
    if (client.ws.readyState === 1) {
      client.ws.send(
        JSON.stringify({
          type: "exposure_update",
          userId: userId,
          newExposure: newExposure,
        }),
      );
      sentCount++;
      console.log(`📤 [WEBSOCKET] Sent to client ${sentCount}`);
    }
  });

  //Update Cache
  lastSentValues.exposure.set(userId, newExposure);

  console.log(` [WEBSOCKET] Sent to ${sentCount} clients`);
};

//FUNCTION THAT UPDATES OPEN BETS TO ALL THE CONNECTED CLIENTS AFTER BET SETTLEMENT
export const sendOpenBetsUpdates = (userId, newOpenBets) => {
  console.log(
    "[WEBSOCKET] Sending Open Bets Updates to all the connected clients",
  );
  console.log("User ID:", userId);
  console.log(" New Open Bets:", newOpenBets);
  console.log(" Connected Clients:", clients.length);

  let sentCount = 0;
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === 1) {
      client.ws.send(
        JSON.stringify({
          type: "open_bets_update",
          userId: userId,
          newOpenBets: newOpenBets,
        }),
      );
      sentCount++;
      console.log(` [WEBSOCKET] Sent to client ${sentCount}`);
    }
  });
  console.log(` [WEBSOCKET] Sent to ${sentCount} clients`);
};

export const sendToUser = (userName, payload) => {
  if (!wssInstance) return console.warn(" WebSocket not initialized yet");

  clients.forEach((client) => {
    if (client.userName === userName && client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(payload));
    }
  });
};

// Function to send user refresh message (triggers getUser() on frontend)
export const sendUserRefresh = (userId) => {
  console.log(" [WEBSOCKET] Sending user refresh request for userId:", userId);

  let sentCount = 0;
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === 1) {
      client.ws.send(
        JSON.stringify({
          type: "user_refresh_needed",
          userId: userId,
        }),
      );
      sentCount++;
      console.log(` [WEBSOCKET] Sent refresh request to client ${sentCount}`);
    }
  });

  console.log(
    ` [WEBSOCKET] Sent refresh request to ${sentCount} clients for userId: ${userId}`,
  );
};

// In short — the flow
// Client connects → added to clients
// Client subscribes → sends { type: "subscribe", gameid, apitype }
// Server subscribes to live score socket (1 connection per game + apitype)
// Server polls API every 3 seconds for each unique subscription
// If data changed, sends update to subscribed clients
// If client disconnects, they're removed from the list
