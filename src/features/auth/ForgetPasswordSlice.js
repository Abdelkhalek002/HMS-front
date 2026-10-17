import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StatusCode from "../../StatusCode";
import axios from "axios";
import { BASE_URL } from "../../services/http/apiClient";
import { toast } from "react-toastify";

export const forgetPasswordAPI = createAsyncThunk("forget/forgetpassword", async (args, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    try {
        const response = await axios.post(`${BASE_URL}/auth/forgetPassword`, {
            email: getState().ForgetPasswordSlice.email,
            OTP: getState().ForgetPasswordSlice.otp,
            newPassword: args.password,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const sendOtpAPI = createAsyncThunk("forget/sendOtp", async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await axios.post(`${BASE_URL}/auth/sendOtp`, { email: args.email });
        return args.email;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialState = {
    email: null,
    otp: null,
    password: null,
    statusOtp: StatusCode.IDLE,
    statusFinal: StatusCode.IDLE,
};

const ForgetPasswordSlice = createSlice({
    name: "forget",
    initialState,
    reducers: {
        saveOtp: (state, action) => {
            state.otp = action.payload;
        },
        savePassword: (state, action) => {
            state.password = action.payload;
        },
    },
    extraReducers: (builder) => {
        // For Handle Send OTP
        builder.addCase(sendOtpAPI.fulfilled, (state, action) => {
            state.email = action.payload;
            state.statusOtp = StatusCode.SUCCESS;
            toast.success("تم ارسال الرمز علي حسابك برجاء التحقق");
        });
        builder.addCase(sendOtpAPI.pending, () => {});
        builder.addCase(sendOtpAPI.rejected, (state) => {
            toast.error('عذار حدثت مشكلة برجاء اعادة كتابة الايميل والمحاولة مرة اخري');
            state.statusFinal = StatusCode.ERROR;
        });
        // For Handle ForgetPassword
        builder.addCase(forgetPasswordAPI.fulfilled, (state) => {
            toast.success('تم تغير كلمة السر بنجاح برجاء اعادة تسجيل الدخول');
            state.statusFinal = StatusCode.SUCCESS;
        });
        builder.addCase(forgetPasswordAPI.rejected, (state) => {
            toast.error("عذار رقم التحقق غير صحيح");
            state.statusFinal = StatusCode.ERROR;
        });
    },
});

export const { saveOtp, savePassword } = ForgetPasswordSlice.actions;

export default ForgetPasswordSlice.reducer;
