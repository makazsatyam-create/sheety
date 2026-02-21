import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../api";

// Async thunk to place a bet
export const createBet = createAsyncThunk(
  "bet/create",
  async (formData, { rejectWithValue }) => {
    // Helper function to simulate a delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Simulate a 5-second loading delay
      // await delay(3000);

      // Make the API request
      const response = await api.post("/user/place-bet", formData, {
        withCredentials: true,
      });

      // Return the response data
      return response.data; // directly return { message, bet }
    } catch (error) {
      // Handle errors and reject with a value
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
// Async thunk to place a bet
export const getPendingBet = createAsyncThunk(
  "bet/getPendingBet",
  async (gameId, { rejectWithValue }) => {
    // console.log("eventName", gameId);
    try {
      // console.log("srijangameId",gameId)
      const url =
        gameId && gameId !== "undefined"
          ? `/user/pending-bet?gameId=${gameId}`
          : `/user/pending-bet`;
      const response = await api.get(url, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const getPendingBetAmo = createAsyncThunk(
  "bet/getPendingBetAmo",
  async (gameId, { rejectWithValue }) => {
    // console.log("getPendingBetAmo", gameId);
    try {
      const response = await api.get(
        `/user/pending-bet/amounts?gameId=${gameId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
export const getProLoss = createAsyncThunk(
  "bet/getProLoss",
  async (
    {
      startDate,
      endDate,
      limit,
      page,
      gameName,
      eventName,
      marketName,
      marketId,
    },
    { rejectWithValue }
  ) => {
    // console.log("eventName", gameId);
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
      }
      if (gameName) {
        query += `&gameName=${gameName}`;
      }

      if (eventName) {
        query += `&eventName=${eventName}`;
      }

      if (marketName) {
        query += `&marketName=${marketName}`;
      }
      if (marketId) {
        query += `&marketId=${marketId}`;
      }
      const response = await api.get(`/user/profit-loss/history?${query}`, {
        withCredentials: true,
      });
      // console.log("response", response)
      // console.log("response", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const createfancyBet = createAsyncThunk(
  "bet/create-fancy-bet",
  async (formData, { rejectWithValue }) => {
    // console.log("formData", formData);
    try {
      const response = await api.post("/user/place-fancy-bet", formData, {
        withCredentials: true,
      });
      return response.data; // directly return { message, bet }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getBetHistory = createAsyncThunk(
  "bet/getBetHistory",
  async (
    { page = 1, limit, startDate, endDate, selectedGame, selectedVoid },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (startDate && endDate) {
        params.set("startDate", startDate);
        params.set("endDate", endDate);
      }
      if (
        selectedGame != null &&
        selectedGame !== "" &&
        selectedGame !== "undefined"
      ) {
        params.set("selectedGame", selectedGame);
      }
      if (
        selectedVoid != null &&
        selectedVoid !== "" &&
        selectedVoid !== "undefined"
      ) {
        params.set("selectedVoid", selectedVoid);
      }
      const query = "?" + params.toString();

      const response = await api.get(`/user/bet/history${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
export const getTransactionHistory = createAsyncThunk(
  "bet/getTransHistory",
  async ({ startDate, endDate, page, limit }, { rejectWithValue }) => {
    try {
      // let query = `?&selectedVoid=${selectedVoid}`;

      if (startDate && endDate) {
        var query = `?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
      }

      const response = await api.get(`/user/transactions-hisrtory${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Get deposit history
export const getDepositHistory = createAsyncThunk(
  "bet/getDepositHistory",
  async (
    { startDate, endDate, page = 1, limit = 100 },
    { rejectWithValue }
  ) => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(`/user/deposit-history${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Get withdrawal history
export const getWithdrawalHistory = createAsyncThunk(
  "bet/getWithdrawalHistory",
  async (
    { startDate, endDate, page = 1, limit = 100 },
    { rejectWithValue }
  ) => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(`/user/withdrawal-history${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Get deposit requests
export const getDepositRequests = createAsyncThunk(
  "bet/getDepositRequests",
  async (
    { startDate, endDate, page = 1, limit = 100 },
    { rejectWithValue }
  ) => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(`/user/deposit-requests${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Get withdrawal requests
export const getWithdrawalRequests = createAsyncThunk(
  "bet/getWithdrawalRequests",
  async (
    { startDate, endDate, page = 1, limit = 100 },
    { rejectWithValue }
  ) => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(`/user/withdrawal-requests${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Cancel deposit request
export const cancelDepositRequest = createAsyncThunk(
  "bet/cancelDepositRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/deposit-request/${requestId}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Cancel withdrawal request
export const cancelWithdrawalRequest = createAsyncThunk(
  "bet/cancelWithdrawalRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/withdrawal-request/${requestId}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
export const getCasinoBetHistory = createAsyncThunk(
  "bet/getCasinoBetHistory",
  async (
    { userId, page = 1, limit = 10, startDate, endDate },
    { rejectWithValue }
  ) => {
    try {
      if (!userId) {
        return rejectWithValue({ message: "User ID is required" });
      }

      let query = `?page=${page}&limit=${limit}`;

      if (startDate && endDate) {
        query += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(`/casino/bet-history/${userId}${query}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
// Initial state
const initialState = {
  loading: false,
  errorMessage: "",
  successMessage: "",
  eventName: [],
  pendingBet: [],
  betHistory: [],
  transHistory: [],
  proLossHistory: [],
  pendingBetAmounts: [],
  pagination: {},
  casinoPagination: {},
  casinoBetHistory: [],

  depositHistory: [],
  withdrawalHistory: [],
  depositRequests: [],
  withdrawalRequests: [],
};

// Slice
const betSlice = createSlice({
  name: "bet",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    clearPendingBetAmounts: (state) => {
      state.pendingBetAmounts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBet.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(createBet.fulfilled, (state, { payload }) => {
        state.loading = false;
        // pendingBet is refreshed via getPendingBetAmo after place bet
        state.successMessage = payload?.message;
      })
      .addCase(createBet.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      })
      .addCase(getPendingBet.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(getPendingBet.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.eventName = payload?.data;
        state.pendingBet = payload?.data;
        state.successMessage = payload?.message;
      })
      .addCase(getPendingBet.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      })
      .addCase(getPendingBetAmo.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(getPendingBetAmo.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        const amounts = payload?.data ?? [];
        state.pendingBetAmounts = amounts;
        // Transform amounts to pendingBet for UI (market row display, open bets)
        const gameId = meta?.arg ?? null;
        state.pendingBet = amounts.map((a, i) => {
          const isBookmaker = (a.gameType || "")
            .toLowerCase()
            .includes("bookmaker");
          const xValue =
            a.totalPrice > 0
              ? isBookmaker
                ? (a.totalBetAmount / a.totalPrice) * 100
                : a.totalBetAmount / a.totalPrice + 1
              : 0;
          return {
            _id: `amo-${gameId}-${i}`,
            gameId,
            teamName: a.teamName,
            otype: a.otype,
            price: a.totalPrice,
            betAmount: a.totalBetAmount,
            xValue: Number(xValue).toFixed(2),
            marketName: a.gameType,
            gameType: a.gameType,
            status: 0,
          };
        });
        state.successMessage = payload?.message;
      })
      .addCase(getPendingBetAmo.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      })
      .addCase(getBetHistory.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(getBetHistory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.betHistory = payload?.data;
        state.pagination = payload?.pagination;
        state.successMessage = payload?.message;
      })
      .addCase(getBetHistory.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      })
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(getTransactionHistory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.transHistory = payload?.data;
        state.successMessage = payload?.message;
      })
      .addCase(getTransactionHistory.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      })
      .addCase(getProLoss.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(getProLoss.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.proLossHistory = payload.data.report;
        // console.log("payload", payload.data)
        state.successMessage = payload?.message;
      })
      .addCase(getProLoss.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      })
      .addCase(createfancyBet.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(createfancyBet.fulfilled, (state, { payload }) => {
        state.loading = false;
        // pendingBet is refreshed via getPendingBetAmo after place bet
        state.successMessage = payload?.message;
      })
      .addCase(createfancyBet.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload;
      })
      .addCase(getDepositHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepositHistory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.depositHistory = payload?.data || [];
      })
      .addCase(getDepositHistory.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.message || "Failed to fetch deposit history";
      })
      .addCase(getWithdrawalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWithdrawalHistory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.withdrawalHistory = payload?.data || [];
      })
      .addCase(getWithdrawalHistory.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.message || "Failed to fetch withdrawal history";
      })
      .addCase(getDepositRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepositRequests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.depositRequests = payload?.data || [];
      })
      .addCase(getDepositRequests.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.message || "Failed to fetch deposit requests";
      })
      .addCase(getWithdrawalRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWithdrawalRequests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.withdrawalRequests = payload?.data || [];
      })
      .addCase(getWithdrawalRequests.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.message || "Failed to fetch withdrawal requests";
      })
      .addCase(cancelDepositRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelDepositRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage =
          payload?.message || "Deposit request cancelled successfully";
        // Update the request status in the list
        const index = state.depositRequests.findIndex(
          (req) => req._id === payload?.data?._id
        );
        if (index !== -1) {
          state.depositRequests[index] = payload.data;
        }
      })
      .addCase(cancelDepositRequest.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.message || "Failed to cancel deposit request";
      })
      .addCase(cancelWithdrawalRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelWithdrawalRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage =
          payload?.message || "Withdrawal request cancelled successfully";
        // Update the request status in the list
        const index = state.withdrawalRequests.findIndex(
          (req) => req._id === payload?.data?._id
        );
        if (index !== -1) {
          state.withdrawalRequests[index] = payload.data;
        }
      })
      .addCase(cancelWithdrawalRequest.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.message || "Failed to cancel withdrawal request";
      })
      .addCase(getCasinoBetHistory.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(getCasinoBetHistory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.casinoBetHistory = payload?.data || [];
        state.casinoPagination = payload?.pagination || {};
        state.successMessage = payload?.message;
      })
      .addCase(getCasinoBetHistory.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message || "Something went wrong";
      });
  },
});

export const { messageClear, clearPendingBetAmounts } = betSlice.actions;
export default betSlice.reducer;
