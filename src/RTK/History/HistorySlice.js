import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";
import StatusCode from "../../StatusCode.js";

export const getAllHistoryAPI = createAsyncThunk(
  "history/getall",
  async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const page = args?.page || 1;
    const limit = args?.limit || 5;
    try {
      const response = await apiClient.get(`/admins/logs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteHistoryAPI = createAsyncThunk(
  "history/delete",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await apiClient.delete('/admins/logs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  data: [],
  status: StatusCode.IDLE,
};

const HistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHistoryAPI.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
      })

      .addCase(getAllHistoryAPI.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(getAllHistoryAPI.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
      })

      .addCase(deleteHistoryAPI.fulfilled, (state) => {
        state.data = [];
        state.status = StatusCode.IDLE;
      })
      .addCase(deleteHistoryAPI.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(deleteHistoryAPI.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
      });
  },
});
export const { clearHistory } = HistorySlice.actions;
export default HistorySlice.reducer;
export const getAllHistory = (state) => state.HistorySlice.data;
