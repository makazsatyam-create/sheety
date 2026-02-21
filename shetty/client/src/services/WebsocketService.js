//Singleton Pattern to create a single instance of the Websocket
import { host } from "../redux/api";
import { updateAvbalance, updateExposure, getUser } from "../redux/reducer/authReducer";
import { getPendingBet } from "../redux/reducer/betReducer";
import { updateMarketDataFromSocket } from "../redux/reducer/cricketSlice";
import { updateMarketDataFromSocket as updateSoccerMarketDataFromSocket } from "../redux/reducer/soccerSlice";
import { updateMarketDataFromSocket as updateTennisMarketDataFromSocket } from "../redux/reducer/tennisSlice";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.currentUserId = null;
    this.currentDispatch = null;
    this.pendingSubscription = null; // { gameid, apitype, roundId } – send when socket opens
  }

  connect(dispatch, userId = null) {
    this.currentDispatch = dispatch;
    if (this.socket) {
      if (this.pendingSubscription) {
        this._sendSubscribe(this.pendingSubscription);
        this.pendingSubscription = null;
      }
      return;
    }

    this.currentUserId = userId || localStorage.getItem("userId");
    this.socket = new WebSocket(host);

    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("WebSocket connected, userId:", this.currentUserId);
      if (this.pendingSubscription) {
        this._sendSubscribe(this.pendingSubscription);
        this.pendingSubscription = null;
      }
    };

    this.socket.onmessage = (event) => {
      const dispatch = this.currentDispatch;
      if (!dispatch) return;
      try {
        const data = JSON.parse(event.data);

        if (data.type === "balance_update") {
          if (!data.userId || data.userId === this.currentUserId) {
            dispatch(updateAvbalance(data.newBalance));
          }
        }

        if (data.type === "exposure_update") {
          if (!data.userId || data.userId === this.currentUserId) {
            dispatch(updateExposure(data.newExposure));
          }
        }

        if (data.type === "open_bets_update") {
          if (data.userId === this.currentUserId) {
            dispatch(getPendingBet());
          }
        }

        if (data.type === "user_refresh_needed") {
          console.log(
            "🔄 [WEBSOCKET] Casino callback received - refreshing user data"
          );
          console.log(
            "🔄 [WEBSOCKET] Received userId:",
            data.userId,
            "Current userId:",
            this.currentUserId
          );
          // Only refresh if the update is for THIS user (compare as strings)
          const receivedUserId = data.userId?.toString();
          const currentUserId = this.currentUserId?.toString();
          if (
            receivedUserId &&
            currentUserId &&
            receivedUserId === currentUserId
          ) {
            console.log(
              "🔄 [WEBSOCKET] UserId matches - refreshing user data for userId:",
              this.currentUserId
            );
            dispatch(getUser());
          } else {
            console.log("🔄 [WEBSOCKET] UserId mismatch - skipping refresh");
          }
        }

        // Real-time market/odds update (backend sends type: 'bettingData' with apitype)
        if (
          (data.type === "bettingData" ||
            data.type === "market_update" ||
            data.type === "cricket_update") &&
          data.gameid != null &&
          data.data != null
        ) {
          const payload = { gameid: data.gameid, data: data.data };
          if (data.apitype === "soccer") {
            dispatch(updateSoccerMarketDataFromSocket(payload));
          } else if (data.apitype === "tennis") {
            dispatch(updateTennisMarketDataFromSocket(payload));
          } else {
            dispatch(updateMarketDataFromSocket(payload));
          }
        }
      } catch (error) {
        console.error(" WebSocket Error:", error);
      }
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      this.socket = null;
      this.tryReconnect();
    };

    this.socket.onerror = (error) => {
      console.error(
        "%c WebSocket Error",
        "background: #f44336; color: white; padding: 2px;",
        error
      );
    };
  }

  _sendSubscribe({ gameid, apitype, roundId }) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    const message = {
      type: "subscribe",
      gameid,
      apitype: apitype || "cricket",
      roundId: roundId ?? null,
      userId: this.currentUserId,
    };
    this.socket.send(JSON.stringify(message));
    console.log(
      "Subscribed to:",
      gameid,
      "apitype:",
      apitype,
      "userId:",
      this.currentUserId
    );
  }

  subscribe(gameid, apitype = "cricket", roundId = null) {
    const sub = { gameid, apitype, roundId };
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this._sendSubscribe(sub);
      this.pendingSubscription = null;
    } else {
      this.pendingSubscription = sub;
    }
  }

  // Update current userId (useful when user logs in)
  setUserId(userId) {
    this.currentUserId = userId;
  }

  tryReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(` Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(
        () => this.connect(this.currentDispatch, this.currentUserId),
        3000
      );
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Create a single instance
export const wsService = new WebSocketService();
