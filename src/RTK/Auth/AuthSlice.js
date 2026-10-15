import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";

export const singupAPI = createAsyncThunk('auth/signup', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.post('/auth/signup', args.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const loginHandlerAPI = createAsyncThunk('auth/login', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.post('/auth/login', args.userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    user: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem("auth")) : null,
    load: false,
    error: null,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.load = false;
            state.error = null;
            localStorage.removeItem("auth");
        }
    },
    extraReducers: (builder) => {
        // For Login
        builder.addCase(loginHandlerAPI.pending, (state) => {
            state.load = true;
            state.error = null;
        });
        builder.addCase(loginHandlerAPI.fulfilled, (state, action) => {
            state.user = action.payload;
            state.load = false;
            state.error = null;
            localStorage.setItem("auth", JSON.stringify(action.payload));
        });
        builder.addCase(loginHandlerAPI.rejected, (state, action) => {
            state.load = false;
            state.error = action.payload;
        });

        // For Sign up
        builder.addCase(singupAPI.pending, (state) => {
            state.load = true;
            state.error = null;
        });
        builder.addCase(singupAPI.fulfilled, (state) => {
            state.load = false;
            state.error = null;
        });
        builder.addCase(singupAPI.rejected, (state, action) => {
            state.load = false;
            state.error = action.payload;
        });
    }
});

export const loginLoad = state => state.AuthSlice.load;
export const getUserInfo = state => state.AuthSlice.user;
export const getToken = state => state.AuthSlice.user?.token;

export default AuthSlice.reducer;
export const { logout } = AuthSlice.actions;

