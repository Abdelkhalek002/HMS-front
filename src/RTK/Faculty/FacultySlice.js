import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";
import StatusCode from "../../StatusCode.js";

export const getAllFacultiesAPI = createAsyncThunk('faculties/getall', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/sysdata/faculties');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to fetch faculties", error: error.message });
    }
});

export const deleteFacultyAPI = createAsyncThunk('faculties/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/sysdata/faculties/${id}`);
        dispatch(getAllFacultiesAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to delete faculty", error: error.message });
    }
});

export const addNewFacultyAPI = createAsyncThunk('faculties/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/sysdata/faculties', args?.data || args);
        dispatch(getAllFacultiesAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to add faculty", error: error.message });
    }
});

export const updateFacultyAPI = createAsyncThunk('faculties/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/sysdata/faculties/${payload.id}`, payload);
        dispatch(getAllFacultiesAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to update faculty", error: error.message });
    }
});


const initialState = {
    data: [],
    status: StatusCode.IDLE
}

const FacultySlice = createSlice({
    name: "faculties",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        //* For Get All Faculties
        builder.addCase(getAllFacultiesAPI.fulfilled, (state, action) => {
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                id: item.id ?? item.faculty_id,
                faculty_id: item.faculty_id ?? item.id,
                facultyName: item.facultyName ?? item.faculty_name ?? '',
                faculty_name: item.faculty_name ?? item.facultyName ?? ''
            }));
            state.status = StatusCode.IDLE;
        })
        builder.addCase(getAllFacultiesAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllFacultiesAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //! For Delete Faculty
        builder.addCase(deleteFacultyAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.faculty_id ?? action.payload?.id ?? action.payload;
            state.data = state.data.filter(item => item.id !== targetId && item.faculty_id !== targetId);
            state.status = StatusCode.IDLE;
        })
        builder.addCase(deleteFacultyAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteFacultyAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //? For Add Faculty
        builder.addCase(addNewFacultyAPI.fulfilled, (state, action) => {
            const item = action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    id: item.id ?? item.faculty_id,
                    faculty_id: item.faculty_id ?? item.id,
                    facultyName: item.facultyName ?? item.faculty_name ?? '',
                    faculty_name: item.faculty_name ?? item.facultyName ?? ''
                });
            }
            state.status = StatusCode.IDLE;
        })
        builder.addCase(addNewFacultyAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewFacultyAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //? For Update Faculty
        builder.addCase(updateFacultyAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.id ?? action.payload?.faculty_id;
            const index = state.data.findIndex(item => item.id === targetId || item.faculty_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...action.payload,
                    id: action.payload.id ?? action.payload.faculty_id ?? state.data[index].id,
                    faculty_id: action.payload.faculty_id ?? action.payload.id ?? state.data[index].faculty_id,
                    facultyName: action.payload.facultyName ?? action.payload.faculty_name ?? state.data[index].facultyName,
                    faculty_name: action.payload.faculty_name ?? action.payload.facultyName ?? state.data[index].faculty_name
                };
            }
            state.status = StatusCode.IDLE;
        })

        builder.addCase(updateFacultyAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateFacultyAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })
    }
})


export default FacultySlice.reducer
export const getAllFaculties = state => state.FacultySlice.data; 




