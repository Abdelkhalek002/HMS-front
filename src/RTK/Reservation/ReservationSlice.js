import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";

export const createReservationUserAPI = createAsyncThunk(
  "reservation/createReservationUser",
  async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    let payload = args?.data || args;
    if (typeof FormData !== "undefined" && payload instanceof FormData) {
      payload = Object.fromEntries(payload.entries());
    }

    if (payload?.clinic_id !== undefined && payload?.clinic_id !== null) {
      payload = {
        ...payload,
        clinic_id: Number(payload.clinic_id),
      };
    }

    try {
      const response = await apiClient.post("/Myreservations", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  reservations: [],
};

const ReservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReservationUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservationUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.push(action.payload);
      })
      .addCase(createReservationUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ReservationSlice.reducer;
