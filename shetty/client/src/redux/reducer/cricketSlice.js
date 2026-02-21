import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../api';

// Async thunk to fetch cricket data

export const fetchCricketData = createAsyncThunk(
  'cricket/fetchCricketData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cricket/matches'); // Your backend API
      console.log('response', response.data.matches);
      return response.data.matches;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch matches'
      );
    }
  }
);

export const fetchCricketBatingData = createAsyncThunk(
  'cricket/fetchCricketBatingData',
  async (gameid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cricket/betting?gameid=${gameid}`); // Your backend API
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch matches'
      );
    }
  }
);

// Slice
const cricketSlice = createSlice({
  name: 'cricket',
  initialState: {
    matches: [],
    battingData: [],
    loader: false,
    error: null,
    selectedMatch: null,
    selectedTitle: null,
  },
  reducers: {
    setSelectedTitle(state, action) {
      state.selectedTitle = action.payload;
    },
    setSelectedMatch(state, action) {
      state.selectedMatch = action.payload;
    },
    // Real-time market/odds update from WebSocket (only applies to current selected match)
    updateMarketDataFromSocket(state, action) {
      const { gameid, data } = action.payload || {};
      if (!gameid) return;
      // Coerce to string so "123" and 123 both match (URL vs backend type)
      const currentId = state.selectedMatch?.id != null ? String(state.selectedMatch.id) : null;
      const payloadId = String(gameid);
      if (currentId !== payloadId) return;
      const next = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : null;
      if (next) state.battingData = next;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCricketData.pending, (state) => {
        state.loader = true;
        state.error = null;
      })
      .addCase(fetchCricketData.fulfilled, (state, action) => {
        state.loader = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(fetchCricketData.rejected, (state, action) => {
        state.loader = false;
        state.error = action.payload;
      })
      .addCase(fetchCricketBatingData.pending, (state) => {
        state.loader = true;
        state.error = null;
      })
      .addCase(fetchCricketBatingData.fulfilled, (state, action) => {
        state.loader = false;
        state.battingData = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCricketBatingData.rejected, (state, action) => {
        state.loader = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTitle, setSelectedMatch, updateMarketDataFromSocket } = cricketSlice.actions;
export default cricketSlice.reducer;
