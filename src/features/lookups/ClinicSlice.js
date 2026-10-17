import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";

export const getAllClinicsAPI = createAsyncThunk(
  "clinic/getall",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await apiClient.get("/sysdata/clinics");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteClinicsAPI = createAsyncThunk(
  "clinic/delete",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;

    try {
      const response = await apiClient.delete(`/sysdata/clinics/${id}`);
      dispatch(getAllClinicsAPI());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addNewClinicsAPI = createAsyncThunk(
  "clinic/add",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const response = await apiClient.post("/sysdata/clinics", args?.data || args);
      dispatch(getAllClinicsAPI());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateClinicsAPI = createAsyncThunk(
  "clinic/update",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
      const response = await apiClient.put(`/sysdata/clinics/${payload.id}`, payload);
      dispatch(getAllClinicsAPI());
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

const ClinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //* For Get All Clinics
    builder.addCase(getAllClinicsAPI.fulfilled, (state, action) => {
      console.log("Success");
      const raw = Array.isArray(action.payload)
        ? action.payload
        : action.payload?.data || [];
      state.data = raw.map((item) => ({
        ...item,
        clinic_id: item.clinic_id ?? item.id,
      }));
      state.status = StatusCode.IDLE;
    });
    builder.addCase(getAllClinicsAPI.pending, (state) => {
      console.log("Penddding");
      state.status = StatusCode.LOADING;
    });
    builder.addCase(getAllClinicsAPI.rejected, (state) => {
      console.log("REJJjjjected");
      state.status = StatusCode.ERROR;
    });

    //! For Delete Clinic
    builder.addCase(deleteClinicsAPI.fulfilled, (state, action) => {
      console.log("Successs");
      state.data = state.data.filter(
        (item) => item.clinic_id !== action.payload.clinic_id,
      );
      state.status = StatusCode.IDLE;
    });
    builder.addCase(deleteClinicsAPI.pending, (state) => {
      console.log("Penddding");
      state.status = StatusCode.LOADING;
    });
    builder.addCase(deleteClinicsAPI.rejected, (state) => {
      console.log("REJJjjjected");
      state.status = StatusCode.ERROR;
    });

    //? For Add Clinic
    builder.addCase(addNewClinicsAPI.fulfilled, (state, action) => {
      console.log("Successs");
      state.data.push(action.payload);
      state.status = StatusCode.IDLE;
    });
    builder.addCase(addNewClinicsAPI.pending, (state) => {
      console.log("Penddding");
      state.status = StatusCode.LOADING;
    });
    builder.addCase(addNewClinicsAPI.rejected, (state) => {
      console.log("REJJjjjected");
      state.status = StatusCode.ERROR;
    });

    //? For Update Clinic
    builder.addCase(updateClinicsAPI.fulfilled, (state, action) => {
      console.log("Successs");
      console.log("desfdsfdgfsdg", state.data);
      const index = state.data.findIndex(
        (item) => item.clinic_id === action.payload.clinic_id,
      );
      state.data[index] = action.payload;
      state.status = StatusCode.IDLE;
    });
    builder.addCase(updateClinicsAPI.pending, (state) => {
      console.log("Penddding");
      state.status = StatusCode.LOADING;
    });
    builder.addCase(updateClinicsAPI.rejected, (state, action) => {
      console.log("REJJjjjected", action.payload);
      state.status = StatusCode.ERROR;
    });
  },
});

export default ClinicSlice.reducer;

export const getAllClinics = (state) => state.ClinicSlice.data;
