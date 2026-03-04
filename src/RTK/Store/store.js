import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../Auth/AuthSlice";
import UserSlice from "../User/UserSlice";
import LevelSlice from "../Level//LevelSlice";
import ClinicSlice from "../Clinic/ClinicSlice.js";
import ReservationSlice from "../Reservation/ReservationSlice.js";
import FacultySlice from "../Faculty/FacultySlice.js";
import ExHospitalSlice from "../ExHospital/ExHospitalSlice.js";
import GovernorateSlice from "../Governorate/GovernorateSlice.js";
import ForgetPasswordSlice from "../ForgetPassword/ForgetPasswordSlice.js";
import HistorySlice from "../History/HistorySlice.js";
import AdminSlice from "../Admins/AdminSlice.js";
import UserControlSlice from "../UserControl/UserControlSlice.js";
import CounterSlice from "../Admins/CounterSlice.js";
import TransferSlice from "../Transfer/TransferSlice.js";


const store = configureStore({
    reducer: {
        AuthSlice,
        UserSlice,
        LevelSlice,
        ClinicSlice,
        ReservationSlice,
        FacultySlice,
        ExHospitalSlice,
        GovernorateSlice ,
        ForgetPasswordSlice,
        HistorySlice,
        AdminSlice,
        UserControlSlice , 
        CounterSlice , 
        TransferSlice
    }
})

export default store