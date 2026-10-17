import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import { parseJwtPayload } from "../../utils/jwt";

export const singupAPI = createAsyncThunk('auth/signup', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.post('/auth/signup', args.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const verifyEmailAPI = createAsyncThunk('auth/verifyEmail', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.post('/auth/verify-otp', args.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const verifyOtpAPI = verifyEmailAPI;

export const resendOtpAPI = createAsyncThunk('auth/resendOtp', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.post('/auth/resend-otp', args.data);
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

const normalizeAuthPayload = (payload) => {
    if (!payload) return null;
    const token = payload?.token;
    const decoded = parseJwtPayload(token);
    const rawUser = payload?.data || payload?.user || decoded || {};
    const role = rawUser?.role || decoded?.role || payload?.payLoad?.role || null;
    const userType =
        decoded?.userType ||
        decoded?.type ||
        payload?.payLoad?.type ||
        (role && role !== 'user' && role !== 'USER' ? 'admin' : 'user');
    const userId = rawUser?.id ?? decoded?.id ?? rawUser?.userId;
    const username = rawUser?.username || rawUser?.userName || decoded?.username || '';
    const email = rawUser?.email || decoded?.email || '';
    const permissions = rawUser?.permissions || decoded?.permissions || payload?.payLoad?.permissions || [];

    const userObj = {
        ...decoded,
        ...rawUser,
        id: userId,
        userId: userId,
        username: username,
        userName: username,
        email: email,
        role: role,
        type: userType,
        permissions: permissions,
    };

    return {
        ...payload,
        token,
        user: userObj,
        data: userObj,
        payLoad: {
            ...(payload?.payLoad || {}),
            ...userObj,
            userId,
            username,
            email,
            role,
            type: userType,
            permissions,
        },
    };
};

const loadStoredAuth = () => {
    try {
        const stored = localStorage.getItem('auth');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return normalizeAuthPayload(parsed);
    } catch (e) {
        return null;
    }
};

const initialState = {
    user: loadStoredAuth(),
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
            const normalized = normalizeAuthPayload(action.payload);
            state.user = normalized;
            state.load = false;
            state.error = null;
            localStorage.setItem("auth", JSON.stringify(normalized));
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
