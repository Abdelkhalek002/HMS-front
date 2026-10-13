import React from 'react'
import {  useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { isAdminDashboardRole } from '../../ActorType';
import { isTokenExpired } from '../../API_Route/axiosInterceptor';
import NotFoundAdmin from '../../Pages/NotFound/NotFoundSuperAdmin';

const AdminProtect = ({children}) => {

    // For Dispatch Action
    const dispatch = useDispatch() ;  

    // For Access Data In Local Stroage 
    const userData =  useSelector(getUserInfo) ; 

    if(userData && userData.payLoad){
        if (isTokenExpired(userData.token)) {
            dispatch(logout());
            return <Navigate to={'/login'} />
        }
        if(isAdminDashboardRole(userData.payLoad.role))
            return <Outlet />
        else{
            return  <Navigate to={`/notfound`} />
        }
    }else{
        dispatch(logout()) ; 
        return <Navigate  to={'/login'} />
    }



}

export default AdminProtect
