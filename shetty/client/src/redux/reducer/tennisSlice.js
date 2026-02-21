import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../api';

export const fetchTennisData = createAsyncThunk(
  'tennis/fetchTennisData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tennis');
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch matches'
      );
    }
  }
);

export const fetchTennisBatingData = createAsyncThunk(
  'tennis/fetchTennisBatingData',
  async (gameid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tannis/betting?gameid=${gameid}`);
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

const tennisSlice = createSlice({
  name: 'tennis',
  initialState: {
    data: [],
    battingData: [],
    loading: false,
    tennisLoading: false,
    tennisError: null,
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
      .addCase(fetchTennisData.pending, (state) => {
        state.tennisLoading = true;
        state.tennisError = null;
      })
      .addCase(fetchTennisData.fulfilled, (state, action) => {
        state.tennisLoading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchTennisData.rejected, (state, action) => {
        state.tennisLoading = false;
        state.tennisError = action.error?.message ?? action.payload;
      })
      .addCase(fetchTennisBatingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTennisBatingData.fulfilled, (state, action) => {
        state.loading = false;
        state.battingData = Array.isArray(action.payload?.data) ? action.payload.data : (Array.isArray(action.payload) ? action.payload : []);
        state.error = null;
      })
      .addCase(fetchTennisBatingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTitle, setSelectedMatch, updateMarketDataFromSocket } = tennisSlice.actions;
export default tennisSlice.reducer;
