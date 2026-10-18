import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";
import { normalizeApiError } from "../../utils/apiErrorHelper";

export const getAllGovsAPI = createAsyncThunk('governorates/getAll', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/governorates');
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const deleteGovernorateAPI = createAsyncThunk('governorates/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/governorates/${id}`);
        dispatch(getAllGovsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const addNewGovernorateAPI = createAsyncThunk('governorates/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/governorates', args?.data || args);
        dispatch(getAllGovsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const updateGovernorateAPI = createAsyncThunk('governorates/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/governorates/${payload.id}`, payload);
        dispatch(getAllGovsAPI());
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

const GovernorateSlice = createSlice({
    name: "governorates",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllGovsAPI.fulfilled, (state, action) => {
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.data || action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                id: item.id ?? item.gov_id,
                gov_id: item.gov_id ?? item.id,
                govName: item.govName ?? item.gov_name ?? '',
                gov_name: item.gov_name ?? item.govName ?? '',
                is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
            }));
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(getAllGovsAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(getAllGovsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        builder.addCase(deleteGovernorateAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.id ?? action.payload?.gov_id ?? action.payload;
            state.data = state.data.filter(item => item.id !== targetId && item.gov_id !== targetId);
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(deleteGovernorateAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(deleteGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        builder.addCase(addNewGovernorateAPI.fulfilled, (state, action) => {
            const item = action.payload?.data || action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    id: item.id ?? item.gov_id,
                    gov_id: item.gov_id ?? item.id,
                    govName: item.govName ?? item.gov_name ?? '',
                    gov_name: item.gov_name ?? item.govName ?? '',
                    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
                });
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(addNewGovernorateAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(addNewGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        builder.addCase(updateGovernorateAPI.fulfilled, (state, action) => {
            const updated = action.payload?.data || action.payload;
            const targetId = updated?.id ?? updated?.gov_id;
            const index = state.data.findIndex(item => item.id === targetId || item.gov_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...updated,
                    id: updated.id ?? updated.gov_id ?? state.data[index].id,
                    gov_id: updated.gov_id ?? updated.id ?? state.data[index].gov_id,
                    govName: updated.govName ?? updated.gov_name ?? state.data[index].govName,
                    gov_name: updated.gov_name ?? updated.govName ?? state.data[index].gov_name,
                    is_active: updated.is_active !== undefined ? Boolean(updated.is_active) : state.data[index].is_active,
                };
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(updateGovernorateAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(updateGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });
    }
});

export default GovernorateSlice.reducer;
export const getAllGovernorates = state => state.GovernorateSlice.data; 
