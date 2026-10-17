import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
// Core Layouts & Domain Features
import {
  ClinicsPage,
  FacultiesPage,
  LevelsPage,
  GovernoratesPage,
  ExHospitalPage,
} from './features/lookups';
import { CounterPage, ReservationPage } from './features/reservations';
import { TransferPage } from './features/transfers';
import {
  LoginPage,
  SignupPage as Signup,
  VerifyEmailPage,
  ForgetPasswordPage,
  ChangePasswordPage,
  SendOtp,
  OtpComponent,
  NewPasswordComponent,
} from './features/auth';

import {
  ProfilePage,
  ProfilePageAdminViewer,
  UserDetails,
  UserHistroy,
  UserHistoryAdmin,
  EditProfile,
} from './features/profile';
import { GroupUserPage } from './features/users';
import { AdminPage } from './features/admins';
import { HistoryPage } from './features/history';
import { NotFound } from './components/ui';
import 'react-toastify/dist/ReactToastify.css';
import { Flip, ToastContainer } from 'react-toastify';
import {
  AppLayout,
  SideBar,
  SideBarAdmin,
  SideBarCounter,
  SideBarTransfer,
  SidebarProvider,
} from './layouts';
import {
  UserGuard as UserProtect,
  AdminGuard as AdminProtect,
  CounterGuard as CounterProtect,
  TransferGuard as TransferProtect,
  PermissionGuard as PermissionProtect,
} from './routes';
import { PERMISSIONS } from './utils/permissionUtils.js';

function App() {

  return (
    <SidebarProvider>
      <ToastContainer limit={3} autoClose={2000} transition={Flip} stacked closeOnClick theme='colored' position='top-right' />

      {/* For Store All Route */}
      <BrowserRouter>
        <Routes>

        {/* Contain All Route User */}
        <Route element={<UserProtect />}>
          <Route path='/' element={<AppLayout sidebar={SideBar} />}>

            {/* Reservation Page */}
            <Route index element={ <ReservationPage /> }   />


            {/* User Profile */}
            <Route path='profile/:userId' element={<ProfilePage />} >
              <Route index path="/profile/:userId" element={<UserDetails />} />
              <Route path='history' element={<UserHistroy />} />
            </Route>

            {/* Edit Profile */}
            <Route path='editprofile' element={<EditProfile />} />
            <Route path='editeprofile' element={<EditProfile />} />
            {/* Change Passsword */}
            <Route path='changepassword' element={<ChangePasswordPage />} />
          </Route>
        </Route>


        {/* Contain All Route For Admin */}
        <Route path='ad' element={<AdminProtect />}>
          <Route element={<AppLayout sidebar={SideBarAdmin} />}>


            {/* For Counter  */}
            <Route index element={<CounterPage />} />

            {/* Profile Admin */}
            <Route path='profile/:userId' element={<ProfilePageAdminViewer />}>
              <Route index  element={<UserDetails />} />
              <Route path='history' element={<UserHistoryAdmin />} />
            </Route>

            {/* Guarded by Transfers permission */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.TRANSFERS_READ} />}>
              <Route path='transfer' element={<TransferPage />} />
            </Route>

            {/* Guarded by Users permission */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.USERS_READ} />}>
              <Route path='allusers' element={<GroupUserPage />} />
            </Route>

            {/* Guarded by Logs permission */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.LOGS_READ} />}>
              <Route path='history' element={<HistoryPage />} />
            </Route>

            {/* Guarded by Admins permission (Admins & System Lookups) */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.ADMINS_READ} />}>
              <Route path='admins' element={<AdminPage />} />
              <Route path='levels' element={<LevelsPage />} />
              <Route path='clinics' element={<ClinicsPage />} />
              <Route path='faculties' element={<FacultiesPage />} />
              <Route path='exhospital' element={<ExHospitalPage />} />
              <Route path='governorates' element={<GovernoratesPage />} />
            </Route>

          </Route>
        </Route>

        {/* Contain All Route Of Counter */}
        <Route path='co' element={ <CounterProtect />}>
          <Route element={<AppLayout sidebar={SideBarCounter} />}>
            <Route index element={<CounterPage />} />

          </Route>
        </Route>
        {/* Contain All Route Of Transfer */}
        <Route path='tr' element={<TransferProtect />}>
          <Route element={<AppLayout sidebar={SideBarTransfer} />}>
            <Route index element={<TransferPage />} />

          </Route>
        </Route>


        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-otp' element={<VerifyEmailPage />} />
        <Route path='/verify-email' element={<Navigate to="/verify-otp" replace />} />
        <Route path='/forgetpassword' element={<ForgetPasswordPage />}>
          <Route index element={<SendOtp />} />
          <Route path='otp' element={<OtpComponent />} />
          <Route path='newpassword' element={<NewPasswordComponent />} />
        </Route>
        <Route path="*" element={<NotFound/>} />


      </Routes>
    </BrowserRouter>
    </SidebarProvider>
  );

}

export default App;
