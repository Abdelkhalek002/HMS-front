import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";
import { normalizeApiError } from "../../utils/apiErrorHelper";

export const getAllFacultiesAPI = createAsyncThunk('faculties/getall', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/faculties');
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const deleteFacultyAPI = createAsyncThunk('faculties/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/faculties/${id}`);
        dispatch(getAllFacultiesAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const addNewFacultyAPI = createAsyncThunk('faculties/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/faculties', args?.data || args);
        dispatch(getAllFacultiesAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(normalizeApiError(error));
    }
});

export const updateFacultyAPI = createAsyncThunk('faculties/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/faculties/${payload.id}`, payload);
        dispatch(getAllFacultiesAPI());
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

const FacultySlice = createSlice({
    name: "faculties",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //* For Get All Faculties
        builder.addCase(getAllFacultiesAPI.fulfilled, (state, action) => {
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.data || action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                id: item.id ?? item.faculty_id,
                faculty_id: item.faculty_id ?? item.id,
                facultyName: item.facultyName ?? item.faculty_name ?? '',
                faculty_name: item.faculty_name ?? item.facultyName ?? '',
                is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
            }));
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(getAllFacultiesAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(getAllFacultiesAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //! For Delete Faculty
        builder.addCase(deleteFacultyAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.faculty_id ?? action.payload?.id ?? action.payload;
            state.data = state.data.filter(item => item.id !== targetId && item.faculty_id !== targetId);
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(deleteFacultyAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(deleteFacultyAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //? For Add Faculty
        builder.addCase(addNewFacultyAPI.fulfilled, (state, action) => {
            const item = action.payload?.data || action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    id: item.id ?? item.faculty_id,
                    faculty_id: item.faculty_id ?? item.id,
                    facultyName: item.facultyName ?? item.faculty_name ?? '',
                    faculty_name: item.faculty_name ?? item.facultyName ?? '',
                    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
                });
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });
        builder.addCase(addNewFacultyAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(addNewFacultyAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });

        //? For Update Faculty
        builder.addCase(updateFacultyAPI.fulfilled, (state, action) => {
            const updated = action.payload?.data || action.payload;
            const targetId = updated?.id ?? updated?.faculty_id;
            const index = state.data.findIndex(item => item.id === targetId || item.faculty_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...updated,
                    id: updated.id ?? updated.faculty_id ?? state.data[index].id,
                    faculty_id: updated.faculty_id ?? updated.id ?? state.data[index].faculty_id,
                    facultyName: updated.facultyName ?? updated.faculty_name ?? state.data[index].facultyName,
                    faculty_name: updated.faculty_name ?? updated.facultyName ?? state.data[index].faculty_name,
                    is_active: updated.is_active !== undefined ? Boolean(updated.is_active) : state.data[index].is_active,
                };
            }
            state.status = StatusCode.IDLE;
            state.error = null;
        });

        builder.addCase(updateFacultyAPI.pending, (state) => {
            state.status = StatusCode.LOADING;
            state.error = null;
        });
        builder.addCase(updateFacultyAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
            state.error = action.payload;
        });
    }
});

export default FacultySlice.reducer;
export const getAllFaculties = state => state.FacultySlice.data; 
