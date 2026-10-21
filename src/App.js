import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
// Core Layouts & Domain Features
import {
  SystemDataPage,
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
  StaffSidebar,
  SidebarProvider,
} from './layouts';
import {
  UserGuard as UserProtect,
  StaffGuard as StaffProtect,
  PermissionGuard as PermissionProtect,
  StudentDocumentGuard,
} from './routes';
import { PERMISSIONS } from './utils/permissionUtils.js';

function App() {
  return (
    <SidebarProvider>
      <ToastContainer limit={3} autoClose={2000} transition={Flip} stacked closeOnClick theme='colored' position='top-right' />

      {/* For Store All Route */}
      <BrowserRouter>
        <Routes>

        {/* Contain All Route User (Students / Patients) */}
        <Route element={<UserProtect />}>
          <Route path='/' element={<AppLayout sidebar={SideBar} />}>
            {/* Reservation Page */}
            <Route index element={<ReservationPage />} />

            {/* Guarded when documents are not pending */}
            <Route element={<StudentDocumentGuard />}>
              {/* User Profile */}
              <Route path='profile/:userId' element={<ProfilePage />} >
                <Route index path="/profile/:userId" element={<UserDetails />} />
                <Route path='history' element={<UserHistroy />} />
              </Route>

              {/* Edit Profile */}
              <Route path='editprofile' element={<EditProfile />} />
              <Route path='editeprofile' element={<EditProfile />} />
              {/* Change Password */}
              <Route path='changepassword' element={<ChangePasswordPage />} />
            </Route>
          </Route>
        </Route>

        {/* Contain All Staff Resource Routes */}
        <Route element={<StaffProtect />}>
          <Route element={<AppLayout sidebar={StaffSidebar} />}>

            {/* Reservations & Counter Management */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.RESERVATIONS_READ} />}>
              <Route path='reservations' element={<CounterPage />} />
            </Route>

            {/* Profile Admin / Staff Viewer */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.USERS_READ} />}>
              <Route path='profile-viewer/:userId' element={<ProfilePageAdminViewer />}>
                <Route index element={<UserDetails />} />
                <Route path='history' element={<UserHistoryAdmin />} />
              </Route>
            </Route>

            {/* Medical Transfers */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.TRANSFERS_READ} />}>
              <Route path='transfers' element={<TransferPage />} />
            </Route>

            {/* Users / Students Management */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.USERS_READ} />}>
              <Route path='users' element={<GroupUserPage />} />
            </Route>

            {/* Audit Logs */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.LOGS_READ} />}>
              <Route path='history' element={<HistoryPage />} />
            </Route>

            {/* Admins & System Data */}
            <Route element={<PermissionProtect requiredPermission={PERMISSIONS.ADMINS_READ} />}>
              <Route path='admins' element={<AdminPage />} />
              <Route path='system-data' element={<SystemDataPage />} />
            </Route>

          </Route>
        </Route>

        {/* Public & Auth Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-otp' element={<VerifyEmailPage />} />
        <Route path='/verify-email' element={<Navigate to="/verify-otp" replace />} />
        <Route path='/forgetpassword' element={<ForgetPasswordPage />}>
          <Route index element={<SendOtp />} />
          <Route path='otp' element={<OtpComponent />} />
          <Route path='newpassword' element={<NewPasswordComponent />} />
        </Route>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
