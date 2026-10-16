import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import CounterPage from './Pages/Counter/CounterPage';
import ProfilePage from './Pages/Profile/ProfilePage';
import UserDetails from './Component/Profile/UserDetails';
import UserHistroy from './Component/Profile/UserHistroy';
import EditProfile from './Pages/Profile/EditProfile';
import ReservationPage from './Pages/User/Reservation/ReservationPage';
import GroupUserPage from './Pages/GroupUser/GroupUserPage';
import LoginPage from './Pages/Auth/Login/LoginPage';
import 'react-toastify/dist/ReactToastify.css';
import { Flip, ToastContainer } from 'react-toastify';
import LevelsPage from './Pages/Levels/LevelsPage.jsx';
import ClinicsPage from './Pages/Clinics/ClinicsPage.jsx';
import SharedComponentUser from './Component/Utility/SharedComponent';
import SharedComponentAdmin from './Component/Utility/SharedComponentAdmin.js';
import ChangePasswordPage from './Pages/ChangePassword/ChangePasswordPage.js';
import Signup from './Pages/Auth/Signup/Signup.js';
import VerifyEmailPage from './Pages/Auth/VerifyEmail/VerifyEmailPage.js';
import GovernoratesPage from './Pages/Governorates/GovernoratesPage.jsx';
import ExHospitalPage from './Pages/Hospitals/ExHospitalPage.jsx';
import FacultiesPage from './Pages/Faculties/FacultiesPage.jsx';
import ForgetPasswordPage from './Pages/ForgetPassword/ForgetPasswordPage.js';
import SendOtp from './Component/ForgetPassword/SendOtp.js';
import OtpComponent from './Component/ForgetPassword/OtpComponent.js';
import NewPasswordComponent from './Component/ForgetPassword/NewPasswordComponent.js';
import NotFound from './Pages/NotFound/NotFound.jsx';
import HistoryPage from './Pages/History/HistoryPage.jsx';
import AdminPage from './Pages/Admins/AdminPage.jsx';
import TransferPage from './Pages/Transfer/TransferPage.js';
import UserProtect from './Component/ProtectedRoutes/UserProtect.js';
import AdminProtect from './Component/ProtectedRoutes/AdminProtect.js';
import ProfilePageAdminViewer from './Pages/Profile/ProfilePageAdminViewer.js';
import UserHistoryAdmin from './Component/Profile/UserHistoryAdmin.js';
import SharedComponentCounter from './Component/Utility/SharedComponentCounter.js';
import SharedComponentTransfer from './Component/Utility/SharedComponentTransfer.js';
import CounterProtect from './Component/ProtectedRoutes/CounterProtect.js';
import TransferProtect from './Component/ProtectedRoutes/TranferProtect.js';
import { SidebarProvider } from './Component/Utility/SidebarContext.js';
import PermissionProtect from './Component/ProtectedRoutes/PermissionProtect.js';
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
          <Route path='/' element={ <SharedComponentUser /> }>

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
          <Route  element={<SharedComponentAdmin />} >


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
          <Route element={<SharedComponentCounter />}>
            <Route index element={<CounterPage />} />

          </Route>
        </Route>
        {/* Contain All Route Of Transfer */}
        <Route path='tr' element={<TransferProtect />}>
          <Route element={<SharedComponentTransfer />}>
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
