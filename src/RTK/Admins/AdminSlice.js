import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";


export const getAllAdminsApi = createAsyncThunk('admin/all', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/admin/all`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const deleteAdminApi = createAsyncThunk('admin/delete', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}/admin/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const addNewAdminApi = createAsyncThunk('admin/add', async (args, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/admin`, args);
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const updateAdminApi = createAsyncThunk('admin/update', async (args, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${BASE_URL}/admin/${args.user_id}`, args);
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const getAllUserApi = createAsyncThunk('admin/allUsers', async (_, { rejectWithValue }) => { 
    try {
        const { data } = await axios.get(`${BASE_URL}/admin/userProfiles`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

const initialState = {
    data: [],
    status: StatusCode.IDLE
};

const AdminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearData: (state) => {
            state.data = [];
        }
    },
    extraReducers: (builder) => {
        builder
            //! getAllAdminsApi
            .addCase(getAllAdminsApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = StatusCode.IDLE;
            })
            .addCase(getAllAdminsApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(getAllAdminsApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            })

            //! deleteAdminApi
            .addCase(deleteAdminApi.fulfilled, (state, action) => {
                state.data = state.data.filter((admin) => admin.id !== action.payload.id);
            })
            .addCase(deleteAdminApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(deleteAdminApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            })

            //! addNewAdminApi
            .addCase(addNewAdminApi.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(addNewAdminApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(addNewAdminApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            })

            //! updateAdminApi
            .addCase(updateAdminApi.fulfilled, (state, action) => {
                const index = state.data.findIndex((admin) => admin.id === action.payload.id);
                state.data[index] = action.payload;
            })
            .addCase(updateAdminApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(updateAdminApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            })

    }
});

export const { clearData } = AdminSlice.actions;

export default AdminSlice.reducer;

export const getAllAdmins = (state) => state.AdminSlice.data;
