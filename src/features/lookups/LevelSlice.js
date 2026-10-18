import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";
import { normalizeApiError } from "../../utils/apiErrorHelper";

export const getAllLevelsAPI = createAsyncThunk('level/getall', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/levels');
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const deleteLevelsAPI = createAsyncThunk('level/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/levels/${id}`);
        dispatch(getAllLevelsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const addNewLevelsAPI = createAsyncThunk('level/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/levels', args?.data || args);
        dispatch(getAllLevelsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const updateLevelsAPI = createAsyncThunk('level/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/levels/${payload.id}`, payload);
        dispatch(getAllLevelsAPI());
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

const LevelSlice = createSlice({
    name: "level",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //* For Get All Levels
        builder.addCase(getAllLevelsAPI.fulfilled, (state, action) => {
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.data || action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                id: item.id ?? item.level_id,
                level_id: item.level_id ?? item.id,
                levelName: item.levelName ?? item.level_name ?? '',
                level_name: item.level_name ?? item.levelName ?? '',
                is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
            }));
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(getAllLevelsAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(getAllLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //! For Delete Level
        builder.addCase(deleteLevelsAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.level_id ?? action.payload?.id ?? action.payload;
            state.data = state.data.filter(item => item.id !== targetId && item.level_id !== targetId);
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(deleteLevelsAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(deleteLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //? For Add Level
        builder.addCase(addNewLevelsAPI.fulfilled, (state, action) => {
            const item = action.payload?.data || action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    id: item.id ?? item.level_id,
                    level_id: item.level_id ?? item.id,
                    levelName: item.levelName ?? item.level_name ?? '',
                    level_name: item.level_name ?? item.levelName ?? '',
                    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
                });
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(addNewLevelsAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(addNewLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //? For Update Level
        builder.addCase(updateLevelsAPI.fulfilled, (state, action) => {
            const updated = action.payload?.data || action.payload;
            const targetId = updated?.id ?? updated?.level_id;
            const index = state.data.findIndex(item => item.id === targetId || item.level_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...updated,
                    id: updated.id ?? updated.level_id ?? state.data[index].id,
                    level_id: updated.level_id ?? updated.id ?? state.data[index].level_id,
                    levelName: updated.levelName ?? updated.level_name ?? state.data[index].levelName,
                    level_name: updated.level_name ?? updated.levelName ?? state.data[index].level_name,
                    is_active: updated.is_active !== undefined ? Boolean(updated.is_active) : state.data[index].is_active,
                };
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });

        builder.addCase(updateLevelsAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(updateLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });
    }
});

export default LevelSlice.reducer;
export const getAllLevels = state => state.LevelSlice.data; 
