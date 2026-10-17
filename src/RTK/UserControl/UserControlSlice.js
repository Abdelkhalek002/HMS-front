import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";
import StatusCode from "../../StatusCode.js";

// For Get All Users
export const getAllUserApi = createAsyncThunk('userControl/allUsers', async (args, { rejectWithValue }) => {
    try {
        const page = args?.page || 1;
        const limit = args?.limit || 8;
        const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteUserApi = createAsyncThunk('userControl/deleteUser', async (args, { rejectWithValue }) => {
    try {
        const id = typeof args === 'object' ? (args.data || args.id) : args;
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const blockUserApi = createAsyncThunk('userControl/blockUser', async (args, { rejectWithValue }) => {
    try {
        const id = typeof args === 'object' ? (args.data || args.id) : args;
        const response = await apiClient.patch(`/users/${id}/block`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const unblockUserApi = createAsyncThunk('userControl/unblockUser', async (args, { rejectWithValue }) => {
    try {
        const id = typeof args === 'object' ? (args.data || args.id) : args;
        const response = await apiClient.patch(`/users/${id}/unblock`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const sendObservations = createAsyncThunk(
    'userControl/sendObservations',
    async ({ id, message }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/admin/${id}`, { observation: message });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const transfer = createAsyncThunk(
    'userControl/transfer',
    async ({ id, clinic_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/users/${id}/transfer`, { clinic_id });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



const initialState = {
    data: [],
    status: StatusCode.IDLE,
    totalPages: null,
    currentPage: null
};

const UserControlSlice = createSlice({
    name: "userControl",
    initialState,
    reducers: {
        clearData: (state) => {
            state.data = [];
        }
    },
    extraReducers: (builder) => {
        builder
            //! getAllUserApi
            .addCase(getAllUserApi.fulfilled, (state, action) => {
                const rawList =
                    action.payload?.result ||
                    action.payload?.students ||
                    action.payload?.users ||
                    action.payload?.data ||
                    (Array.isArray(action.payload) ? action.payload : []);

                state.data = rawList.map((user) => ({
                    ...user,
                    id: user.id ?? user.student_id,
                    student_id: user.student_id ?? user.id,
                    userName: user.userName || user.username || "",
                    userImage_file:
                        user.profile_photo_url ||
                        "",
                    profile_photo_url:
                        user.profile_photo_url ||
                        "",
                    birthDay: user.birthDay || user.birth_date || user.created_at || "",
                    blocked:
                        user.blocked !== undefined
                            ? user.blocked
                            : (!user.is_active || user.status === "blocked"),
                    status:
                        user.status !== undefined
                            ? user.status
                            : (user.is_active ? 1 : 0),
                }));
                state.status = StatusCode.SUCCESS;
                state.totalPages = action.payload?.totalPages || Math.ceil(rawList.length / 8) || 1;
            })
            .addCase(getAllUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(getAllUserApi.rejected, (state) => {
                state.status = StatusCode.ERROR;
                state.data = [];
                state.totalPages = 0;
            });

        //! deleteUserApi
        builder
            .addCase(deleteUserApi.fulfilled, (state, action) => {
                state.data = state.data.filter((user) => user.id !== action.payload.id && user.student_id !== action.payload.id);
                state.status = StatusCode.SUCCESS;
            })
            .addCase(deleteUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(deleteUserApi.rejected, (state) => {
                state.status = StatusCode.ERROR;
            });

        //! blockUserApi
        builder
            .addCase(blockUserApi.fulfilled, (state, action) => {
                state.data = state.data.map((user) => {
                    if (user.id === action.payload.id || user.student_id === action.payload.id) {
                        return { ...user, ...action.payload, blocked: true, status: 0 };
                    }
                    return user;
                });
                state.status = StatusCode.SUCCESS;
            })
            .addCase(blockUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(blockUserApi.rejected, (state) => {
                state.status = StatusCode.ERROR;
            });

        //! unblockUserApi
        builder
            .addCase(unblockUserApi.fulfilled, (state, action) => {
                state.data = state.data.map((user) => {
                    if (user.id === action.payload.id || user.student_id === action.payload.id) {
                        return { ...user, ...action.payload, blocked: false, status: 1 };
                    }
                    return user;
                });
                state.status = StatusCode.SUCCESS;
            })
            .addCase(unblockUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(unblockUserApi.rejected, (state) => {
                state.status = StatusCode.ERROR;
            });

        //! sendObservations
        builder
            .addCase(sendObservations.fulfilled, (state) => {
                state.status = StatusCode.SUCCESS;
            })
            .addCase(sendObservations.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(sendObservations.rejected, (state) => {
                state.status = StatusCode.ERROR;
            });
    }
});

export const { clearData } = UserControlSlice.actions;

export default UserControlSlice.reducer;

export const getAllAdmins = (state) => state.UserControlSlice.data;

export const getTotalPageUser = state => state.UserControlSlice.totalPages
