import React from 'react'
import {  useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { isTokenExpired } from '../../API_Route/axiosInterceptor';

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
        const isUser = userObj.type === 'user' || (!userObj.role && !userData.payLoad?.role) || userObj.role === 'user';
        if(isUser){
            return <Outlet />
        }
        else{
            return <Navigate to={`/notfound`} />
        }
    }else{
        console.log('You Are Not Registerd')
        return <Navigate  to={'/login'} />
    }



}

export default UserProtect
