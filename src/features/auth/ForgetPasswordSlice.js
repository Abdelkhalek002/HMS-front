import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StatusCode from "../../StatusCode";
import axios from "axios";
import { BASE_URL } from "../../services/http/apiClient";
import { normalizeApiError } from "../../utils/apiErrorHelper";

// 1. Request Password Reset OTP (POST /api/v1/auth/forgetPassword)
export const sendOtpAPI = createAsyncThunk(
    "forget/sendOtp",
    async (args, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        const email = typeof args === "string" ? args : args?.email;
        try {
            const response = await axios.post(`${BASE_URL}/auth/forgetPassword`, { email });
            return {
                email,
                message: response.data?.message || "تم إرسال رمز التحقق بنجاح وهو صالح لمدة 10 دقائق.",
            };
        } catch (error) {
            return rejectWithValue(normalizeApiError(error));
        }
    }
);

// 2. Reset / Change Password with OTP (POST /api/v1/auth/resetPassword)
export const resetPasswordAPI = createAsyncThunk(
    "forget/resetPassword",
    async (args, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const stateForget = getState()?.ForgetPasswordSlice || {};
        const email = args?.email || stateForget.email;
        const OTP = String(args?.OTP ?? args?.otp ?? stateForget.otp ?? "").trim();
        const password = args?.password ?? args?.newPassword;
        const password_confirm =
            args?.password_confirm ?? args?.passwordConfirm ?? args?.rePassword ?? password;

        try {
            const response = await axios.post(`${BASE_URL}/auth/resetPassword`, {
                email,
                OTP,
                password,
                password_confirm,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(normalizeApiError(error));
        }
    }
);

// Backward-compatible alias for existing callers
export const forgetPasswordAPI = resetPasswordAPI;

const initialState = {
    email: null,
    otp: null,
    password: null,
    statusOtp: StatusCode.IDLE,
    statusFinal: StatusCode.IDLE,
    errorMessage: null,
};

const ForgetPasswordSlice = createSlice({
    name: "forget",
    initialState,
    reducers: {
        saveOtp: (state, action) => {
            state.otp = action.payload !== null && action.payload !== undefined ? String(action.payload) : null;
        },
        savePassword: (state, action) => {
            state.password = action.payload;
        },
        resetForgetStatus: (state) => {
            state.statusOtp = StatusCode.IDLE;
            state.statusFinal = StatusCode.IDLE;
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        // Send OTP
        builder.addCase(sendOtpAPI.pending, (state) => {
            state.statusOtp = StatusCode.PENDING;
            state.errorMessage = null;
        });
        builder.addCase(sendOtpAPI.fulfilled, (state, action) => {
            state.email = action.payload.email;
            state.statusOtp = StatusCode.SUCCESS;
            state.errorMessage = null;
        });
        builder.addCase(sendOtpAPI.rejected, (state, action) => {
            state.statusOtp = StatusCode.ERROR;
            state.errorMessage = action.payload?.message || "تعذر إرسال رمز التحقق، يرجى المحاولة لاحقاً";
        });

        // Reset Password
        builder.addCase(resetPasswordAPI.pending, (state) => {
            state.statusFinal = StatusCode.PENDING;
            state.errorMessage = null;
        });
        builder.addCase(resetPasswordAPI.fulfilled, (state) => {
            state.statusFinal = StatusCode.SUCCESS;
            state.errorMessage = null;
        });
        builder.addCase(resetPasswordAPI.rejected, (state, action) => {
            state.statusFinal = StatusCode.ERROR;
            state.errorMessage = action.payload?.message || "تعذر تغيير كلمة المرور، تأكد من صحة البيانات";
        });
    },
});

export const { saveOtp, savePassword, resetForgetStatus } = ForgetPasswordSlice.actions;

export default ForgetPasswordSlice.reducer;
