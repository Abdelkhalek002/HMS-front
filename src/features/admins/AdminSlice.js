import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";

export const getAllAdminsApi = createAsyncThunk('admins', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/admins');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteAdminApi = createAsyncThunk('admins/delete', async (args, { rejectWithValue }) => {
    try {
        const id = typeof args === 'object' ? (args.id || args.data) : args;
        const response = await apiClient.delete(`/admins/${id}`);
        return { data: response.data, id };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const addNewAdminApi = createAsyncThunk('admins/add', async (args, { rejectWithValue }) => {
    try {
        const payload = args?.data !== undefined ? args.data : args;
        const response = await apiClient.post('/admins', payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateAdminApi = createAsyncThunk('admins/update', async (args, { rejectWithValue }) => {
    try {
        const payload = args?.data !== undefined ? args.data : args;
        const id = payload.user_id || payload.id;
        const response = await apiClient.put(`/admins/${id}`, payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const getAllUserApi = createAsyncThunk('admin/allUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
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
                state.data = action.payload?.admins || action.payload?.data || (Array.isArray(action.payload) ? action.payload : []);
                state.status = StatusCode.IDLE;
            })
            .addCase(getAllAdminsApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(getAllAdminsApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
                state.data = [];
            })

            //! deleteAdminApi
            .addCase(deleteAdminApi.fulfilled, (state, action) => {
                const deletedId = action.payload?.id || action.meta?.arg?.id || (typeof action.meta?.arg !== 'object' ? action.meta?.arg : null);
                if (deletedId && Array.isArray(state.data)) {
                    state.data = state.data.filter((admin) => (admin.id || admin.admin_id || admin.user_id) !== deletedId);
                }
                state.status = StatusCode.IDLE;
            })
            .addCase(deleteAdminApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(deleteAdminApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            })

            //! addNewAdminApi
            .addCase(addNewAdminApi.fulfilled, (state, action) => {
                if (Array.isArray(state.data) && action.payload) {
                    const newAdmin = action.payload.admin || action.payload.data || action.payload;
                    if (newAdmin && typeof newAdmin === 'object') {
                        state.data.push(newAdmin);
                    }
                }
                state.status = StatusCode.IDLE;
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
            });

    }
});

export const { clearData } = AdminSlice.actions;

export default AdminSlice.reducer;

export const getAllAdmins = (state) => state.AdminSlice.data;
