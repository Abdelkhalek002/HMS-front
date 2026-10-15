import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import { toast } from "react-toastify";
import StatusCode from "../../StatusCode";

// For Delete Reservation
export const deleteReservationAPI = createAsyncThunk(
  "user/deleteReservation",
  async (args, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token =
      args?.token ||
      (typeof args === "string" ? args : null) ||
      getState()?.AuthSlice?.user?.token;
    const userId =
      args?.userId ||
      getState()?.AuthSlice?.user?.payLoad?.userId;
    const reservationId = args?.id ?? args?.medxId;
    console.log(args);
    try {
      await axios.delete(
        `${BASE_URL}/myreservations/${userId}/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return reservationId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// For Get All Reservation
export const getUserReservationAPI = createAsyncThunk(
  "user/getreservationlist",
  async (args, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token =
      args?.token ||
      (typeof args === "string" ? args : null) ||
      getState()?.AuthSlice?.user?.token;
    const page = args?.page || 1;
    const studentQuery = args?.userId || args?.id ? `&student_id=${args.userId || args.id}` : "";
    try {
      const response = await axios.get(
        `${BASE_URL}/myreservations?page=${page}&limit=5${studentQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// For Update Profile Pic
export const updateProfilePicAPI = createAsyncThunk(
  "user/updateProfilePic",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch, getState } = thunkAPI;
    const token =
      args?.token ||
      (typeof args === "string" ? args : null) ||
      getState()?.AuthSlice?.user?.token;
    try {
      const formData =
        args.data instanceof FormData ? args.data : new FormData();
      if (!(args.data instanceof FormData)) {
        formData.append("user_image_file", args.data);
      }
      const response = await axios.put(`${BASE_URL}/users/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile photo updated:", response.data);
      dispatch(getUserProfileAPi({ token }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message,
      );
    }
  },
);

// For Update Profile Data
export const updateProfileAPI = createAsyncThunk(
  "user/updateProfile",
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch, getState } = thunkAPI;
    const token =
      args?.token ||
      (typeof args === "string" ? args : null) ||
      getState()?.AuthSlice?.user?.token;
    const username =
      args.data?.username || args.data?.userName || args.data?.name || "";
    try {
      const response = await axios.put(
        `${BASE_URL}/users/me`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Profile data updated:", response.data);
      dispatch(getUserProfileAPi({ token }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message,
      );
    }
  },
);

// For Change Password
export const changePasswordAPI = createAsyncThunk(
  "user/changepassword",
  async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axios.post(
        `${BASE_URL}/password/change/${args.id}`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// For Get Profile Data
export const getUserProfileAPi = createAsyncThunk(
  "user/profile",
  async (args, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const currentUser = getState()?.AuthSlice?.user;
    const currentUserId = currentUser?.payLoad?.userId;

    const token =
      args?.token ||
      (typeof args === "string" ? args : null) ||
      currentUser?.token;

    const isAdmin =
      currentUser?.payLoad?.type === "admin" ||
      Boolean(currentUser?.payLoad?.role);

    // If an id is provided and it's an admin viewing or different from current user,
    // request /users/:id. Otherwise (student accessing own profile or no id provided), request /users/me.
    const url =
      args?.id && (isAdmin || String(args.id) !== String(currentUserId))
        ? `${BASE_URL}/users/${args.id}`
        : `${BASE_URL}/users/me`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const raw =
        response.data?.result ||
        response.data?.student?.[0] ||
        response.data?.user ||
        response.data?.data ||
        response.data ||
        {};

      const birthDayVal =
        raw.birthDay ||
        (raw.birth_date ? String(raw.birth_date).slice(0, 10) : "");

      const mapped = {
        ...raw,
        id: raw.id ?? raw.student_id,
        student_id: raw.student_id ?? raw.id,
        userName: raw.userName || raw.username || "",
        username: raw.username || raw.userName || "",
        email: raw.email || "",
        profile_photo_url: raw.profile_photo_url || "",
        userImage_file:
          raw.profile_photo_url ||
          raw.userImage_file ||
          raw.user_image_file ||
          raw.photo ||
          "",
        photo:
          raw.profile_photo_url ||
          raw.photo ||
          raw.userImage_file ||
          raw.user_image_file ||
          "",
        user_image_file:
          raw.profile_photo_url ||
          raw.user_image_file ||
          raw.userImage_file ||
          raw.photo ||
          "",
        phoneNumber: raw.phoneNumber || raw.phone_number || "",
        phone_number: raw.phone_number || raw.phoneNumber || "",
        gender: raw.gender || "",
        birthDay: birthDayVal,
        birth_date: raw.birth_date || birthDayVal,
        national_id: raw.national_id ? String(raw.national_id) : "",
        level_name: raw.level_name || raw.level || "",
        level: raw.level || raw.level_name || "",
        faculty_name: raw.faculty_name || raw.faculty || "",
        faculty: raw.faculty || raw.faculty_name || "",
        gov_name: raw.gov_name || raw.governorate || "",
        governorate: raw.governorate || raw.gov_name || "",
        nationality_name: raw.nationality_name || raw.nationality || "",
        nationality: raw.nationality || raw.nationality_name || "",
        status: raw.status !== undefined ? raw.status : (raw.is_active ?? 1),
        is_active: raw.is_active !== undefined ? raw.is_active : (raw.status ?? 1),
        gov_id: raw.gov_id,
        level_id: raw.level_id,
        faculty_id: raw.faculty_id,
        nationality_id: raw.nationality_id,
      };

      return mapped;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  data: {},
  reservationData: [],
  load: false, // idle  | success | load
  error: "", // Auth || not-Auth  || error ,
  statusReservation: StatusCode.IDLE,
  status: StatusCode.IDLE,
  totalHistoryPage: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get User Profile
    builder.addCase(getUserProfileAPi.fulfilled, (state, action) => {
      state.data = action.payload;
      state.load = false;
    });
    builder.addCase(getUserProfileAPi.rejected, (state, action) => {
      state.load = false;
    });
    builder.addCase(getUserProfileAPi.pending, (state, action) => {
      state.load = true;
    });
    // Forget Password
    builder.addCase(changePasswordAPI.fulfilled, (state, action) => {
      toast.success("تم تغيير كلمة السر بنجاح");
    });
    builder.addCase(changePasswordAPI.pending, (state, action) => { });
    builder.addCase(changePasswordAPI.rejected, (state, action) => {
      toast.error("كلمة المرور القديمة غير صحيحة برجاء المحاولة مرة اخرى");
    });
    // For Upload Profile Picture
    builder.addCase(updateProfilePicAPI.fulfilled, (state, action) => {
      console.log("Photo Upload Successfully");
      toast.success("تم تغير صورة البروفيل بنجاح");
      const updated = action.payload?.result;
      if (updated) {
        const photoVal =
          action.payload?.profile_photo_url ||
          updated.profile_photo_url
        if (state.data) {
          state.data = {
            ...state.data,
            ...updated,
            profile_photo_url: photoVal || state.data.profile_photo_url,
          };
        }
      }
    });
    builder.addCase(updateProfilePicAPI.pending, (state, action) => { });
    builder.addCase(updateProfilePicAPI.rejected, (state, action) => {
      toast.error("حدث خطا اثناء رفع الصورة برجاء اعادة المحاولة");
    });
    // For Get Reservation List
    builder.addCase(getUserReservationAPI.fulfilled, (state, action) => {
      state.reservationData = action.payload?.results ?? action.payload?.data ?? (Array.isArray(action.payload) ? action.payload : []);
      state.statusReservation = StatusCode.SUCCESS;
      state.totalHistoryPage = action.payload?.totalPages ?? 1;
    });
    builder.addCase(getUserReservationAPI.pending, (state, action) => {
      state.statusReservation = StatusCode.LOADING;
    });
    builder.addCase(getUserReservationAPI.rejected, (state, action) => {
      if (action.payload?.response?.status === 403) {
        state.statusReservation = StatusCode.UNAUTHORIZED;
      } else {
        state.statusReservation = StatusCode.ERROR;
      }
    });
    // For Delete Reservation
    builder.addCase(deleteReservationAPI.fulfilled, (state, action) => {
      state.status = StatusCode.SUCCESS;
      console.log(state.reservationData);
      if (state.reservationData && state.reservationData.length !== 0) {
        state.reservationData = state.reservationData.filter((item) => {
          return (item.id ?? item.medicEx_id) !== action.payload;
        });
      }
      toast.success("تم مسح الكشف بنجاح");
    });
    builder.addCase(deleteReservationAPI.rejected, (state, action) => {
      state.status = StatusCode.UNAUTHORIZED;
    });

    // For Update User Data
    builder.addCase(updateProfileAPI.fulfilled, (state, action) => {
      toast.success("تم تعديل البينات بنجاح");
    });
  },
});

export const getUserProfile = (state) => state.UserSlice.data;

export const getUserReservationList = (state) =>
  state.UserSlice.reservationData;

export const getTotalHistoryPage = (state) => state.UserSlice.totalHistoryPage;

export default UserSlice.reducer;
