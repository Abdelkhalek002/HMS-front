import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";
import { normalizeApiError } from "../../utils/apiErrorHelper";

export const getAllExhospitalsAPI = createAsyncThunk('exhospital/getall', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/hospitals');
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const deleteExhospitalAPI = createAsyncThunk('exhospital/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/hospitals/${id}`);
        dispatch(getAllExhospitalsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const addNewExhospitalAPI = createAsyncThunk('exhospital/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/hospitals', args?.data || args);
        dispatch(getAllExhospitalsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const updateExhospitalAPI = createAsyncThunk('exhospital/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/hospitals/${payload.id}`, payload);
        dispatch(getAllExhospitalsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

const initialState = {
    data: [],
    status: StatusCode.IDLE,
    error: null,
};

const exHospitalSlice = createSlice({
    name: "exhospital",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //* For Get All exhospitals
        builder.addCase(getAllExhospitalsAPI.fulfilled, (state, action) => {
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.data || action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                exhospital_id: item.exhospital_id ?? item.id ?? item.exHosp_id,
                exHosp_id: item.exHosp_id ?? item.exhospital_id ?? item.id,
                hospName: item.hospName ?? item.hospitalName ?? item.hospital_name ?? item.name ?? '',
                hospitalName: item.hospitalName ?? item.hospName ?? item.hospital_name ?? item.name ?? '',
                hospital_name: item.hospital_name ?? item.hospitalName ?? item.hospName ?? item.name ?? '',
                is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
            }));
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(getAllExhospitalsAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(getAllExhospitalsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //! For Delete exhospital
        builder.addCase(deleteExhospitalAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.exhospital_id ?? action.payload?.id ?? action.payload?.exHosp_id ?? action.payload;
            state.data = state.data.filter(item => item.exhospital_id !== targetId && item.exHosp_id !== targetId);
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(deleteExhospitalAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(deleteExhospitalAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //? For Add exhospital
        builder.addCase(addNewExhospitalAPI.fulfilled, (state, action) => {
            const item = action.payload?.data || action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    exhospital_id: item.exhospital_id ?? item.id ?? item.exHosp_id,
                    exHosp_id: item.exHosp_id ?? item.exhospital_id ?? item.id,
                    hospName: item.hospName ?? item.hospitalName ?? item.hospital_name ?? item.name ?? '',
                    hospitalName: item.hospitalName ?? item.hospName ?? item.hospital_name ?? item.name ?? '',
                    hospital_name: item.hospital_name ?? item.hospitalName ?? item.hospName ?? item.name ?? '',
                    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
                });
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(addNewExhospitalAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(addNewExhospitalAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //? For Update exhospital
        builder.addCase(updateExhospitalAPI.fulfilled, (state, action) => {
            const updated = action.payload?.data || action.payload;
            const targetId = updated?.exhospital_id ?? updated?.id ?? updated?.exHosp_id;
            const index = state.data.findIndex(item => item.exhospital_id === targetId || item.exHosp_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...updated,
                    exhospital_id: targetId,
                    exHosp_id: targetId,
                    is_active: updated.is_active !== undefined ? Boolean(updated.is_active) : state.data[index].is_active,
                };
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });

        builder.addCase(updateExhospitalAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(updateExhospitalAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });
    }
});

export default exHospitalSlice.reducer;
export const getAllExhospitals = (state) => state.ExHospitalSlice?.data ?? state.exHospitalSlice?.data ?? []; 
