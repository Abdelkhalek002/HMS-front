import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";


// For Get All Users
export const getAllUserApi = createAsyncThunk('userControl/allUsers', async (args, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/users?page=${args.page}&limit=7`, {
            headers: {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const deleteUserApi = createAsyncThunk('userControl/deleteUser', async (args, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}/users/${args.data}`, {
            Authorization: `Bearer ${args.token}`,
            'Content-Type': 'application/json'
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const blockUserApi = createAsyncThunk('userControl/blockUser', async (args, { rejectWithValue, dispatch }) => {

    try {
        const { data } = await axios.patch(`${BASE_URL}/users/${args.data}/block`, {}, {
            headers: {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }

});

export const unblockUserApi = createAsyncThunk('userControl/unblockUser', async (args, { rejectWithValue }) => {
    try {
        const { data } = await axios.patch(`${BASE_URL}/users/${args.data}/unblock`, {}, {
            headers: {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const sendObservations = createAsyncThunk(
    'userControl/sendObservations',
    async ({ id, message, token }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/admin/${id}`, { observation: message }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const transfer = createAsyncThunk(
    'userControl/transfer',
    async ({ id, clinic_id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`${BASE_URL}/users/${id}/transfer`, { clinic_id: clinic_id });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
)



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
                state.data = action.payload?.students || action.payload?.users || action.payload?.data || (Array.isArray(action.payload) ? action.payload : []);
                state.status = StatusCode.IDLE;
                state.totalPages = action.payload?.totalPages || 0;
            })
            .addCase(getAllUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(getAllUserApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
                state.data = [];
                state.totalPages = 0;
            });

        //! deleteUserApi
        builder
            .addCase(deleteUserApi.fulfilled, (state, action) => {
                state.data = state.data.filter((user) => user.id !== action.payload.id);
            })
            .addCase(deleteUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(deleteUserApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            });

        //! blockUserApi
        builder
            .addCase(blockUserApi.fulfilled, (state, action) => {
                state.data = state.data.map((user) => {
                    if (user.id === action.payload.id) {
                        return action.payload;
                    }
                    return user;
                });
            })
            .addCase(blockUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(blockUserApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            });

        //! unblockUserApi
        builder
            .addCase(unblockUserApi.fulfilled, (state, action) => {
                state.data = state.data.map((user) => {
                    if (user.id === action.payload.id) {
                        return action.payload;
                    }
                    return user;
                });
            })
            .addCase(unblockUserApi.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(unblockUserApi.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            });

        //! sendObservations
        builder
            .addCase(sendObservations.fulfilled, (state, action) => {
                state.data = action.payload;

            })
            .addCase(sendObservations.pending, (state) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(sendObservations.rejected, (state) => {
                state.status = StatusCode.REJECTED;
            });
    }
});

export const { clearData } = UserControlSlice.actions;

export default UserControlSlice.reducer;



export const getAllAdmins = (state) => state.UserControlSlice.data;

export const getTotalPageUser = state => state.UserControlSlice.totalPages
