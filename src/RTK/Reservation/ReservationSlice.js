import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import { toast } from "react-toastify";

export const createReservationUserAPI = createAsyncThunk(
  "reservation/createReservationUser",
  async (args, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token =
      args?.token ||
      (typeof args === "string" ? args : null) ||
      getState()?.AuthSlice?.user?.token;

    let payload = args?.data;
    if (typeof FormData !== "undefined" && payload instanceof FormData) {
      payload = Object.fromEntries(payload.entries());
    }

    if (payload?.clinic_id !== undefined && payload?.clinic_id !== null) {
      payload = {
        ...payload,
        clinic_id: Number(payload.clinic_id),
      };
    }

    console.log(`the Args`, args);
    console.log(`the Payload`, payload);
    try {
      const response = await axios.post(`${BASE_URL}/Myreservations`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = [];

const ReservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createReservationUserAPI.fulfilled, (state, action) => {
      toast.success("تم حجز الكشف بنجاح برجاء إحضار الكارنيه وإذن الكلية");
    });
    builder.addCase(createReservationUserAPI.rejected, (state, action) => {
      const errorMsg =
        action.payload?.error ||
        action.payload?.message ||
        (typeof action.payload === "string" ? action.payload : null) ||
        "حدث خطأ أثناء حجز الكشف برجاء اعادة المحاولة";
      toast.error(errorMsg);
    });
  },
});

export default ReservationSlice.reducer;
