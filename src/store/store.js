import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import AuthSlice from "../features/auth/AuthSlice";
import UserSlice from "../features/users/UserSlice";
import LevelSlice from "../features/lookups/LevelSlice";
import ClinicSlice from "../features/lookups/ClinicSlice";
import ReservationSlice from "../features/reservations/ReservationSlice";
import FacultySlice from "../features/lookups/FacultySlice";
import ExHospitalSlice from "../features/lookups/ExHospitalSlice";
import GovernorateSlice from "../features/lookups/GovernorateSlice";
import ForgetPasswordSlice from "../features/auth/ForgetPasswordSlice";
import HistorySlice from "../features/history/HistorySlice";
import AdminSlice from "../features/admins/AdminSlice";
import UserControlSlice from "../features/users/UserControlSlice";
import CounterSlice from "../features/admins/CounterSlice";
import TransferSlice from "../features/transfers/TransferSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    AuthSlice,
    UserSlice,
    LevelSlice,
    ClinicSlice,
    ReservationSlice,
    FacultySlice,
    ExHospitalSlice,
    GovernorateSlice,
    ForgetPasswordSlice,
    HistorySlice,
    AdminSlice,
    UserControlSlice,
    CounterSlice,
    TransferSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
