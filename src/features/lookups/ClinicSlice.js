import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";
import { normalizeApiError } from "../../utils/apiErrorHelper";

export const getAllClinicsAPI = createAsyncThunk(
  "clinic/getall",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await apiClient.get("/clinics");
      return response.data;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

export const deleteClinicsAPI = createAsyncThunk(
  "clinic/delete",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;

    try {
      const response = await apiClient.delete(`/clinics/${id}`);
      dispatch(getAllClinicsAPI());
      return response.data;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

export const addNewClinicsAPI = createAsyncThunk(
  "clinic/add",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const response = await apiClient.post("/clinics", args?.data || args);

      dispatch(getAllClinicsAPI());
      return response.data;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

export const updateClinicsAPI = createAsyncThunk(
  "clinic/update",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
      const response = await apiClient.put(`/clinics/${payload.id}`, payload);
      dispatch(getAllClinicsAPI());
      return response.data;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

const initialState = {
  data: [],
  status: StatusCode.IDLE,
  error: null,
};

const ClinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //* For Get All Clinics
    builder.addCase(getAllClinicsAPI.fulfilled, (state, action) => {
      const raw = Array.isArray(action.payload)
        ? action.payload
        : action.payload?.data || [];
      state.data = raw.map((item) => ({
        ...item,
        clinic_id: item.clinic_id ?? item.id,
        clinicName: item.clinicName ?? item.clinic_name ?? '',
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
      }));
      state.status = StatusCode.IDLE;
      state.error = null;
    });
    builder.addCase(getAllClinicsAPI.pending, (state) => {
      state.status = StatusCode.LOADING;
      state.error = null;
    });
    builder.addCase(getAllClinicsAPI.rejected, (state, action) => {
      state.status = StatusCode.ERROR;
      state.error = action.payload;
    });

    //! For Delete Clinic
    builder.addCase(deleteClinicsAPI.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (item) => item.clinic_id !== action.payload.clinic_id,
      );
      state.status = StatusCode.IDLE;
      state.error = null;
    });
    builder.addCase(deleteClinicsAPI.pending, (state) => {
      state.status = StatusCode.LOADING;
      state.error = null;
    });
    builder.addCase(deleteClinicsAPI.rejected, (state, action) => {
      state.status = StatusCode.ERROR;
      state.error = action.payload;
    });

    //? For Add Clinic
    builder.addCase(addNewClinicsAPI.fulfilled, (state, action) => {
      const item = action.payload?.data || action.payload;
      if (item) {
        state.data.push({
          ...item,
          clinic_id: item.clinic_id ?? item.id,
          clinicName: item.clinicName ?? item.clinic_name ?? '',
          is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
        });
      }
      state.status = StatusCode.IDLE;
      state.error = null;
    });
    builder.addCase(addNewClinicsAPI.pending, (state) => {
      state.status = StatusCode.LOADING;
      state.error = null;
    });
    builder.addCase(addNewClinicsAPI.rejected, (state, action) => {
      state.status = StatusCode.ERROR;
      state.error = action.payload;
    });

    //? For Update Clinic
    builder.addCase(updateClinicsAPI.fulfilled, (state, action) => {
      const updated = action.payload?.data || action.payload;
      const targetId = updated?.clinic_id ?? updated?.id;
      const index = state.data.findIndex(
        (item) => item.clinic_id === targetId,
      );
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updated,
          clinic_id: targetId,
          is_active: updated.is_active !== undefined ? Boolean(updated.is_active) : state.data[index].is_active,
        };
      }
      state.status = StatusCode.IDLE;
      state.error = null;
    });
    builder.addCase(updateClinicsAPI.pending, (state) => {
      state.status = StatusCode.LOADING;
      state.error = null;
    });
    builder.addCase(updateClinicsAPI.rejected, (state, action) => {
      state.status = StatusCode.ERROR;
      state.error = action.payload;
    });
  },
});

export default ClinicSlice.reducer;

export const getAllClinics = (state) => state.ClinicSlice.data;
