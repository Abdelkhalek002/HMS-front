import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";
import StatusCode from "../../StatusCode.js";

export const getAllGovsAPI = createAsyncThunk('governorates/getAll', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/sysdata/governorates');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to fetch governorates", error: error.message });
    }
});

export const deleteGovernorateAPI = createAsyncThunk('governorates/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/sysdata/governorates/${id}`);
        dispatch(getAllGovsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to delete governorate", error: error.message });
    }
});

export const addNewGovernorateAPI = createAsyncThunk('governorates/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/sysdata/governorates', args?.data || args);
        dispatch(getAllGovsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to add governorate", error: error.message });
    }
});

export const updateGovernorateAPI = createAsyncThunk('governorates/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/sysdata/governorates/${payload.id}`, payload);
        dispatch(getAllGovsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to update governorate", error: error.message });
    }
});

const initialState = {
    data: [],
    status: StatusCode.IDLE
}

const GovernorateSlice = createSlice({
    name: "governorates",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllGovsAPI.fulfilled, (state, action) => {
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                id: item.id ?? item.gov_id,
                gov_id: item.gov_id ?? item.id,
                govName: item.govName ?? item.gov_name ?? '',
                gov_name: item.gov_name ?? item.govName ?? ''
            }));
            state.status = StatusCode.IDLE;
        })
        builder.addCase(getAllGovsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllGovsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        builder.addCase(deleteGovernorateAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.id ?? action.payload?.gov_id ?? action.payload;
            state.data = state.data.filter(item => item.id !== targetId && item.gov_id !== targetId);
            state.status = StatusCode.IDLE;
        })
        builder.addCase(deleteGovernorateAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        builder.addCase(addNewGovernorateAPI.fulfilled, (state, action) => {
            const item = action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    id: item.id ?? item.gov_id,
                    gov_id: item.gov_id ?? item.id,
                    govName: item.govName ?? item.gov_name ?? '',
                    gov_name: item.gov_name ?? item.govName ?? ''
                });
            }
            state.status = StatusCode.IDLE;
        })
        builder.addCase(addNewGovernorateAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        builder.addCase(updateGovernorateAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.id ?? action.payload?.gov_id;
            const index = state.data.findIndex(item => item.id === targetId || item.gov_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...action.payload,
                    id: action.payload.id ?? action.payload.gov_id ?? state.data[index].id,
                    gov_id: action.payload.gov_id ?? action.payload.id ?? state.data[index].gov_id,
                    govName: action.payload.govName ?? action.payload.gov_name ?? state.data[index].govName,
                    gov_name: action.payload.gov_name ?? action.payload.govName ?? state.data[index].gov_name
                };
            }
            state.status = StatusCode.IDLE;
        })
        builder.addCase(updateGovernorateAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })
    }
})

export default GovernorateSlice.reducer
export const getAllGovernorates = state => state.GovernorateSlice.data; 
