import React from 'react'
import {  useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { isTokenExpired } from '../../API_Route/axiosInterceptor';

import {
    isAdminDashboardRole,
    isCounterRole,
    isMedicalCheckManagerRole,
    isTransferRole,
    isExternalHospitalAdminRole
} from '../../ActorType';

const UserProtect = ({children}) => {

    const dispatch = useDispatch();

    // For Access Data In Local Stroage 
    const userData =  useSelector(getUserInfo) ; 

    if(userData){
        if (isTokenExpired(userData.token)) {
            dispatch(logout());
            return <Navigate to={'/login'} />
        }
        const userObj = userData.user || userData.payLoad || {};
        const role = userObj.role || userData.payLoad?.role;
        const isUser = (!role || role === 'user' || userObj.type === 'user');

        if(isUser){
            return <Outlet />
        } else if (isAdminDashboardRole(role)) {
            return <Navigate to={'/ad'} />
        } else if (isCounterRole(role) || isMedicalCheckManagerRole(role)) {
            return <Navigate to={'/co'} />
        } else if (isTransferRole(role) || isExternalHospitalAdminRole(role)) {
            return <Navigate to={'/tr'} />
        } else {
            return <Navigate to={'/ad'} />
        }
    }else{
        console.log('You Are Not Registerd')
        return <Navigate  to={'/login'} />
    }



}

export default UserProtect
