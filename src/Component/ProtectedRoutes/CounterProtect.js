import React from 'react'
import {  useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { isCounterRole, isMedicalCheckManagerRole, isSuperAdminRole, isSecondSuperAdminRole } from '../../ActorType';
import { isTokenExpired } from '../../API_Route/axiosInterceptor';

const CounterProtect = () => {
 
    // For Dispatch Action
    const dispatch = useDispatch() ;  

    // For Access Data In Local Stroage 
    const userData =  useSelector(getUserInfo) ; 

    if(userData && userData.payLoad){
        if (isTokenExpired(userData.token)) {
            dispatch(logout());
            return <Navigate to={'/login'} />
        }
        const role = userData.payLoad.role;
        if(isCounterRole(role) || isMedicalCheckManagerRole(role) || isSuperAdminRole(role) || isSecondSuperAdminRole(role))
            return <Outlet />
        else{
            return <Navigate to={`/notfound`} />
        }
    }else{
        dispatch(logout()) ; 
        return <Navigate  to={'/login'} />
    }


}

export default CounterProtect
