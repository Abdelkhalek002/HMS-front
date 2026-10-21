import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";

/**
 * Fetch paginated system activity audit logs with optional filters.
 * GET /api/v1/logs?page=1&limit=10&action=...&status=...&adminId=...
 */
export const getAllHistoryAPI = createAsyncThunk(
  "history/getall",
  async (args = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, action, status, adminId } = args;
    const params = { page, limit };

    if (action) params.action = action;
    if (status) params.status = status;
    if (adminId) params.adminId = adminId;

    try {
      const response = await apiClient.get('/logs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

/**
 * Purge all system activity audit logs.
 * DELETE /api/v1/logs
 */
export const deleteHistoryAPI = createAsyncThunk(
  "history/delete",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/logs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

/**
 * Fetch audit logs for a specific administrator.
 * GET /api/v1/admins/:id/logs
 */
export const getAdminLogsAPI = createAsyncThunk(
  "history/getAdminLogs",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admins/${adminId}/logs`);
      return { adminId, data: response.data?.data || [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

/**
 * Delete audit logs for a specific administrator.
 * DELETE /api/v1/admins/:id/logs
 */
export const deleteAdminLogsAPI = createAsyncThunk(
  "history/deleteAdminLogs",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/admins/${adminId}/logs`);
      return { adminId, message: response.data?.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  logs: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  status: StatusCode.IDLE,
  error: null,

  // Admin-specific logs for drawer/modal inspection
  adminLogs: [],
  selectedAdminId: null,
  adminLogsStatus: StatusCode.IDLE,
  adminLogsError: null,

  filters: {
    action: "",
    status: "",
    adminId: "",
    limit: 10,
  },
};

const HistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.logs = [];
      state.totalCount = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        action: "",
        status: "",
        adminId: "",
        limit: 10,
      };
    },
    clearAdminLogs: (state) => {
      state.adminLogs = [];
      state.selectedAdminId = null;
      state.adminLogsStatus = StatusCode.IDLE;
      state.adminLogsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllHistoryAPI
      .addCase(getAllHistoryAPI.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(getAllHistoryAPI.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.logs = payload.data || [];
        state.totalCount = payload.totalCount ?? state.logs.length;
        state.totalPages = payload.totalPages ?? 1;
        state.currentPage = payload.currentPage ?? 1;
        state.status = StatusCode.SUCCESS;
      })
      .addCase(getAllHistoryAPI.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      })

      // deleteHistoryAPI
      .addCase(deleteHistoryAPI.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(deleteHistoryAPI.fulfilled, (state) => {
        state.logs = [];
        state.totalCount = 0;
        state.totalPages = 1;
        state.currentPage = 1;
        state.status = StatusCode.SUCCESS;
      })
      .addCase(deleteHistoryAPI.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      })

      // getAdminLogsAPI
      .addCase(getAdminLogsAPI.pending, (state) => {
        state.adminLogsStatus = StatusCode.LOADING;
        state.adminLogsError = null;
      })
      .addCase(getAdminLogsAPI.fulfilled, (state, action) => {
        state.adminLogs = action.payload.data;
        state.selectedAdminId = action.payload.adminId;
        state.adminLogsStatus = StatusCode.SUCCESS;
      })
      .addCase(getAdminLogsAPI.rejected, (state, action) => {
        state.adminLogsStatus = StatusCode.ERROR;
        state.adminLogsError = action.payload;
      })

      // deleteAdminLogsAPI
      .addCase(deleteAdminLogsAPI.pending, (state) => {
        state.adminLogsStatus = StatusCode.LOADING;
      })
      .addCase(deleteAdminLogsAPI.fulfilled, (state, action) => {
        state.adminLogs = [];
        state.adminLogsStatus = StatusCode.SUCCESS;
        // Also remove records of this admin from the global logs if present
        if (action.payload.adminId) {
          state.logs = state.logs.filter(
            (log) => String(log.adminId) !== String(action.payload.adminId)
          );
        }
      })
      .addCase(deleteAdminLogsAPI.rejected, (state, action) => {
        state.adminLogsStatus = StatusCode.ERROR;
        state.adminLogsError = action.payload;
      });
  },
});

export const {
  clearHistory,
  setFilters,
  clearFilters,
  clearAdminLogs,
} = HistorySlice.actions;

export default HistorySlice.reducer;

// Selectors
export const selectHistory = (state) => state.HistorySlice;
export const selectHistoryLogs = (state) => state.HistorySlice.logs;
export const selectHistoryStatus = (state) => state.HistorySlice.status;
export const selectAdminLogs = (state) => state.HistorySlice.adminLogs;
export const selectAdminLogsStatus = (state) => state.HistorySlice.adminLogsStatus;
