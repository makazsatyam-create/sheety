import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// import axios from "axios";
import api from '../api'; // Adjust the import based on your project structure

export const fetchSoccerData = createAsyncThunk(
  'soccer/fetchSoccerData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/soccer'); // Your backend API

      console.log('response', response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch matches'
      );
    }
  }
);
export const fetchSoccerBatingData = createAsyncThunk(
  'soccer/fetchSoccerBatingData',
  async (gameid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/soccer/betting?gameid=${gameid}`);
      // API returns { success, data: { success, msg, status, data: [markets] } }
      const inner = response.data?.data ?? response.data;
      if (Array.isArray(inner)) return { data: inner };
      if (inner && typeof inner === 'object' && Array.isArray(inner.data)) return inner;
      return { data: [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch matches'
      );
    }
  }
);

const soccerSlice = createSlice({
  name: 'soccer',
  initialState: {
    soccerLoading: null,
    soccerError: null,
    soccerData: [],
    battingData: [],
    loading: false,
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
    updateMarketDataFromSocket(state, action) {
      const { gameid, data } = action.payload || {};
      if (!gameid) return;
      const currentId = state.selectedMatch?.id != null ? String(state.selectedMatch.id) : null;
      const payloadId = String(gameid);
      if (currentId !== payloadId) return;
      const next = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : null;
      if (next) state.battingData = next;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSoccerData.pending, (state) => {
        state.soccerLoading = true;
        state.soccerError = null;
      })
      .addCase(fetchSoccerData.fulfilled, (state, action) => {
        state.soccerLoading = false;
        state.soccerData = action.payload;
        state.error = null;
      })
      .addCase(fetchSoccerData.rejected, (state, action) => {
        state.soccerLoading = false;
        state.soccerError = action.error.message;
      })
      .addCase(fetchSoccerBatingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSoccerBatingData.fulfilled, (state, action) => {
        state.loading = false;
        state.battingData = Array.isArray(action.payload?.data) ? action.payload.data : (Array.isArray(action.payload) ? action.payload : []);
        state.error = null;
      })
      .addCase(fetchSoccerBatingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTitle, setSelectedMatch, updateMarketDataFromSocket } = soccerSlice.actions;
export default soccerSlice.reducer;
