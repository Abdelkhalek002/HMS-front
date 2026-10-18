import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode.js";

// For Get All Users
export const getAllUserApi = createAsyncThunk('userControl/allUsers', async (args, { rejectWithValue }) => {
    try {
        const page = args?.page || 1;
        const limit = args?.limit || 8;
        const search = args?.search || args?.username || '';
        let queryUrl = `/users?page=${page}&limit=${limit}`;
        if (search) {
            queryUrl += `&username=${encodeURIComponent(search)}`;
        }
        if (args?.document_status && args.document_status !== 'all') {
            queryUrl += `&document_status=${encodeURIComponent(args.document_status)}`;
        }
        if (args?.faculty_id) {
            queryUrl += `&faculty_id=${encodeURIComponent(args.faculty_id)}`;
        }
        if (args?.level_id) {
            queryUrl += `&level_id=${encodeURIComponent(args.level_id)}`;
        }
        if (args?.gender) {
            queryUrl += `&gender=${encodeURIComponent(args.gender)}`;
        }
        if (args?.nationality_id) {
            queryUrl += `&nationality_id=${encodeURIComponent(args.nationality_id)}`;
        }
        if (args?.date) {
            queryUrl += `&date=${encodeURIComponent(args.date)}`;
        }
        const response = await apiClient.get(queryUrl);
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

export const toggleUserActiveApi = createAsyncThunk(
    'userControl/toggleUserActive',
    async ({ id, is_active }, { rejectWithValue }) => {
        try {
            const activeVal = Boolean(is_active);
            const response = await apiClient.patch(`/users/${id}`, { is_active: activeVal });
            return { id, is_active: activeVal, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const blockUserApi = createAsyncThunk('userControl/blockUser', async (args, { dispatch, rejectWithValue }) => {
    try {
        const id = typeof args === 'object' ? (args.data || args.id) : args;
        return await dispatch(toggleUserActiveApi({ id, is_active: false })).unwrap();
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const unblockUserApi = createAsyncThunk('userControl/unblockUser', async (args, { dispatch, rejectWithValue }) => {
    try {
        const id = typeof args === 'object' ? (args.data || args.id) : args;
        return await dispatch(toggleUserActiveApi({ id, is_active: true })).unwrap();
    } catch (error) {
        return rejectWithValue(error);
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
                    id: user.id ?? user.student_id ?? user.user_id,
                    student_id: user.student_id ?? user.user_id ?? user.id,
                    userName: user.userName || user.username || "",
                    username: user.username || user.userName || "",
                    email: user.email || "",
                    phone_number: user.phone_number || "",
                    national_id: user.national_id || "",
                    faculty_id: user.faculty_id ?? null,
                    faculty_name: user.faculty_name || user.faculty || "",
                    level_id: user.level_id ?? null,
                    level_name: user.level_name || user.level || "",
                    gender: user.gender || "",
                    nationality_id: user.nationality_id ?? null,
                    nationality_name: user.nationality_name || user.nationality || "",
                    document_status: user.document_status || "pending",
                    profile_photo_url: user.profile_photo_url || user.userImage_file || "",
                    userImage_file: user.profile_photo_url || user.userImage_file || "",
                    created_at: user.created_at || user.birthDay || "",
                    birthDay: user.birthDay || user.birth_date || user.created_at || "",
                    is_active: user.is_active !== undefined ? Boolean(user.is_active) : (user.status !== 0),
                    blocked:
                        user.blocked !== undefined
                            ? user.blocked
                            : (!user.is_active || user.status === "blocked" || user.status === 0),
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

        //! toggleUserActiveApi
        builder
            .addCase(toggleUserActiveApi.fulfilled, (state, action) => {
                const targetId = action.payload?.id ?? action.payload?.student_id;
                const newActive = Boolean(action.payload?.is_active);
                state.data = state.data.map((user) => {
                    if (user.id === targetId || user.student_id === targetId) {
                        return {
                            ...user,
                            is_active: newActive,
                            blocked: !newActive,
                            status: newActive ? 1 : 0,
                        };
                    }
                    return user;
                });
                state.status = StatusCode.SUCCESS;
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

export const getTotalPageUser = state => state.UserControlSlice.totalPages;
