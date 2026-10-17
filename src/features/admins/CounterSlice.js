import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode";

// For Filter Reservation
export const filterAPI = createAsyncThunk('admin/filter', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.post(
            `/admin/advancedSearch?userName=${args.userName || ''}&level_id=${args.level_id || ''}&faculty_id=${args.faculty_id || ''}&date=${args.date || ''}&examType=${args.examType || ''}`
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// For Get All Reservations
export const getAllReservationListAPI = createAsyncThunk('admin/getReservations', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const page = args?.page || 1;
    const limit = args?.limit || 8;
    const search = args?.search || "";
    try {
        const response = await apiClient.get(`/reservations/?page=${page}&limit=${limit}&searchKey=${search}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// For Accept and Decline Request
export const acceptOrDeclineAPI = createAsyncThunk('counter/acceptordecline', async (args, thunkAPI) => {
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
            })
        );

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    data: null,
    totalPage: null,
    currentPage: null,
    status: StatusCode.IDLE,
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
                state.data = action.payload?.results ?? action.payload?.data ?? (Array.isArray(action.payload) ? action.payload : []);
                state.totalPage = action.payload?.totalPages ?? 1;
                state.currentPage = action.payload?.currentPage ?? 1;
            })
            .addCase(getAllReservationListAPI.rejected, (state) => {
                state.status = StatusCode.ERROR;
            })

            // For Accept or Decline
            .addCase(acceptOrDeclineAPI.fulfilled, (state) => {
                state.status = StatusCode.SUCCESS;
            })

            // For Filter API
            .addCase(filterAPI.fulfilled, (state, action) => {
                state.status = StatusCode.SUCCESS;
                state.data = action.payload?.results ?? action.payload?.data ?? (Array.isArray(action.payload) ? action.payload : []);
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
