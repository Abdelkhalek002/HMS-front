import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode";

// Helper to construct reservation search query string
const buildReservationQuery = (args = {}) => {
  const page = args?.page || 1;
  const limit = args?.limit || 8;
  const search = args?.search || args?.searchKey || args?.userName || "";
  const examType = args?.examType || args?.exam_type || "";
  const clinicId = args?.clinic_id || args?.clinicId || "";
  const status = args?.status !== undefined && args?.status !== null ? args?.status : "";
  const date = args?.date || "";
  const facultyId = args?.faculty_id || args?.facultyId || "";
  const levelId = args?.level_id || args?.levelId || "";
  const gender = args?.gender || "";
  const nationalityId = args?.nationality_id || args?.nationalityId || "";
  let month = args?.month || "";
  let year = args?.year || "";

  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (search) params.set("searchKey", search);
  if (examType) params.set("examType", examType);
  if (clinicId) params.set("clinic_id", String(clinicId).split(" ")[0]);
  if (status) params.set("status", status);
  if (date) params.set("date", date);
  if (facultyId) params.set("faculty_id", String(facultyId).split(" ")[0]);
  if (levelId) params.set("level_id", String(levelId).split(" ")[0]);
  if (gender) params.set("gender", gender);
  if (nationalityId) params.set("nationality_id", String(nationalityId).split(" ")[0]);
  if (month) params.set("month", month);
  if (year) params.set("year", year);

  return params.toString();
};

// For Filter Reservation (Mapped to GET /reservations/ with backend filters)
export const filterAPI = createAsyncThunk("admin/filter", async (args = {}, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const queryString = buildReservationQuery(args);
    const response = await apiClient.get(`/reservations/?${queryString}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// For Get All Reservations (Admin list with pagination & filters)
export const getAllReservationListAPI = createAsyncThunk(
  "admin/getReservations",
  async (args = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const queryString = buildReservationQuery(args);
      const response = await apiClient.get(`/reservations/?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// For Get Emergency Reservations (Dedicated emergency listing)
export const getEmergencyReservationsAPI = createAsyncThunk(
  "admin/getEmergencyReservations",
  async (args = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const page = args?.page || 1;
    const limit = args?.limit || 8;
    const search = args?.search || args?.searchKey || "";
    const month = args?.month || "";
    const year = args?.year || "";

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (search) params.set("searchKey", search);
    if (month) params.set("month", month);
    if (year) params.set("year", year);

    try {
      const response = await apiClient.get(`/reservations/emergency?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// For Get Single Reservation By ID
export const getReservationByIdAPI = createAsyncThunk(
  "admin/getReservationById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await apiClient.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// For Admin Create Emergency / Counter Reservation
export const createAdminReservationAPI = createAsyncThunk(
  "admin/createReservation",
  async (data, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const response = await apiClient.post("/reservations", data);
      dispatch(getAllReservationListAPI({ page: 1, limit: 8 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// For Admin Update Reservation
export const updateAdminReservationAPI = createAsyncThunk(
  "admin/updateReservation",
  async ({ id, data }, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const response = await apiClient.put(`/reservations/${id}`, data);
      dispatch(getAllReservationListAPI({ page: 1, limit: 8 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// For Admin Delete Reservation
export const deleteAdminReservationAPI = createAsyncThunk(
  "admin/deleteReservation",
  async (id, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const response = await apiClient.delete(`/reservations/${id}`);
      dispatch(getAllReservationListAPI({ page: 1, limit: 8 }));
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// For Accept and Decline Request
export const acceptOrDeclineAPI = createAsyncThunk(
  "counter/acceptordecline",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const status =
      typeof args.status === "boolean"
        ? args.status
        : args.res === 1 || args.res === true || args.res === "true";

    const id = args.id || args.medxId;
    if (!id) {
      console.error("acceptOrDeclineAPI: id is undefined in arguments", args);
      return rejectWithValue({ error: "معرف الكشف غير موجود (undefined id)" });
    }

    try {
      const response = await apiClient.put(`/reservations/${id}`, {
        status,
      });

      // Automatically refresh reservation list
      dispatch(
        getAllReservationListAPI({
          page: args.page || 1,
          limit: args.limit || 8,
          search: args.search || args.searchKey || "",
          examType: args.examType || "",
          clinic_id: args.clinic_id || "",
          status: args.filterStatus || "",
          date: args.date || "",
          faculty_id: args.faculty_id || "",
          level_id: args.level_id || "",
          gender: args.gender || "",
          nationality_id: args.nationality_id || "",
        })
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: null,
  totalPage: null,
  currentPage: null,
  status: StatusCode.IDLE,
  selectedReservation: null,
};

const CounterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // For Get All Reservation
    builder
      .addCase(getAllReservationListAPI.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(getAllReservationListAPI.fulfilled, (state, action) => {
        state.status = StatusCode.SUCCESS;
        state.data =
          action.payload?.results ??
          action.payload?.data ??
          (Array.isArray(action.payload) ? action.payload : []);
        state.totalPage = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(getAllReservationListAPI.rejected, (state) => {
        state.status = StatusCode.ERROR;
      })

      // For Emergency Reservations
      .addCase(getEmergencyReservationsAPI.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(getEmergencyReservationsAPI.fulfilled, (state, action) => {
        state.status = StatusCode.SUCCESS;
        state.data =
          action.payload?.results ??
          action.payload?.data ??
          (Array.isArray(action.payload) ? action.payload : []);
        state.totalPage = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(getEmergencyReservationsAPI.rejected, (state) => {
        state.status = StatusCode.ERROR;
      })

      // For View Single Reservation
      .addCase(getReservationByIdAPI.fulfilled, (state, action) => {
        state.selectedReservation = action.payload;
      })

      // For Accept or Decline
      .addCase(acceptOrDeclineAPI.fulfilled, (state) => {
        state.status = StatusCode.SUCCESS;
      })

      // For Filter API
      .addCase(filterAPI.fulfilled, (state, action) => {
        state.status = StatusCode.SUCCESS;
        state.data =
          action.payload?.results ??
          action.payload?.data ??
          (Array.isArray(action.payload) ? action.payload : []);
        state.totalPage = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(filterAPI.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(filterAPI.rejected, (state) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export default CounterSlice.reducer;
export const getReservationData = (state) => state.CounterSlice;
