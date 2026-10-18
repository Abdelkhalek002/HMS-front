import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/http/apiClient";
import StatusCode from "../../StatusCode";
import { getAllReservationListAPI } from "../admins/CounterSlice";
import { toast } from "react-toastify";

// For Update Transfer
export const updateTransferAPI = createAsyncThunk(
  "transfer/update",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const transferId = args.data?.transfer?.id ?? args.data?.transfer_id;
    const studentId = args.data?.user?.id ?? args.data?.student?.id ?? args.data?.student_id;

    try {
      const response = await apiClient.put(`/admin/transfer/${transferId}`, {
        student_id: studentId,
        user_id: studentId,
        transferReason: args.data?.transfer?.reason,
        notes: args.data?.transfer?.notes,
        exHosp_id: parseInt(args.data?.hospital),
        hospital_id: parseInt(args.data?.hospital),
      });
      dispatch(
        getAllReservationListAPI({
          page: args.page ? args.page : 1,
          searchKey: "",
        }),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// For Transfer Student
export const transferAPI = createAsyncThunk(
  "transfer/make",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const studentId = args.data?.user?.id ?? args.data?.student?.id ?? args.data?.student_id;
    const medicExId = args.data?.id ?? args.data?.medicEx_id ?? args.data?.reservation_id;
    const clinicId = args.data?.clinic?.id ?? args.data?.clinic_id ?? args.data?.clinicId;
    const studentName =
      args.data?.user?.name ??
      args.data?.student?.name ??
      args.data?.student_name ??
      args.data?.patient_name;

    try {
      const response = await apiClient.post(`/admin/transfer`, {
        student_id: studentId,
        user_id: studentId,
        transferReason: "لايوجود",
        notes: "مش دوكش",
        medicEx_id: medicExId,
        reservation_id: medicExId,
        clinic_id: clinicId,
        exHosp_id: parseInt(args.data?.hospital),
        hospital_id: parseInt(args.data?.hospital),
      });
      dispatch(
        getAllReservationListAPI({
          page: args.page ? args.page : 1,
          searchKey: "",
        }),
      );
      return studentName;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  status: StatusCode.IDLE,
};

const TransferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // For Transfer Student
    builder.addCase(transferAPI.fulfilled, () => {
      toast.success(`تم تحويل الطالب بنجاح`);
    });
    builder.addCase(transferAPI.pending, (state) => {
      state.status = StatusCode.LOADING;
    });
    builder.addCase(transferAPI.rejected, (state, action) => {
      state.status = StatusCode.ERROR;
      console.log(action.payload);
    });
    // For Update Transfer Student
    builder.addCase(updateTransferAPI.fulfilled, () => {
      toast.success("تم تعديل البينات بنجاح");
    });
    builder.addCase(updateTransferAPI.pending, () => {});
    builder.addCase(updateTransferAPI.rejected, () => {
      toast.error("حدث خطا برجاء المحاولة مرة اخري");
    });
  },
});

export default TransferSlice.reducer;
