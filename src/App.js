import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CounterPage from './Pages/Counter/CounterPage';
import ProfilePage from './Pages/Profile/ProfilePage';
import UserDetails from './Component/Profile/UserDetails';
import UserHistroy from './Component/Profile/UserHistroy';
import EditeProfile from './Pages/Profile/EditeProfile';
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
import CounterProtect from './Component/ProtectedRoutes/CounterProtect.js';
import TransferProtect from './Component/ProtectedRoutes/TranferProtect.js';
import SharedComponentTransfer from './Component/Utility/SharedComponentTransfer.js';

function App() {

  return <>
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
            <Route path='editeprofile' element={<EditeProfile />} />
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
          

            {/* For Transfer */}
            <Route path='transfer' element={<TransferPage />} />

            {/* Admin Route */}
            <Route path='allusers' element={<GroupUserPage />} />

            {/* Levels */}
            <Route path='levels' element={<LevelsPage />} />

            {/* Clinics */}
            <Route path='clinics' element={<ClinicsPage />} />

            {/* Faculties */}
            <Route path='faculties' element={<FacultiesPage />} />

            {/* ExHospital */}
            <Route path='exhospital' element={<ExHospitalPage />} />

            {/* Governorates */}
            <Route path='governorates' element={<GovernoratesPage />} />

            {/* History */}
            <Route path='history' element={<HistoryPage />} />

            {/* Admins */}
            <Route path='admins' element={<AdminPage />} />

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


        {/* Global Route For Admin and User */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgetpassword' element={<ForgetPasswordPage />}>
          <Route index element={<SendOtp />} />
          <Route path='otp' element={<OtpComponent />} />
          <Route path='newpassword' element={<NewPasswordComponent />} />
        </Route>
        <Route path="*" element={<NotFound/>} />


      </Routes>
    </BrowserRouter>


  </>

}

export default App;
