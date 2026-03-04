import React from 'react'
import {  useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { COUNTERTYPE } from '../../ActorType';

const CounterProtect = () => {
 
    // For Dispatch Action
    const dispatch = useDispatch() ;  

    // For Access Data In Local Stroage 
    const userData =  useSelector(getUserInfo) ; 

    if(userData){
        if(userData.payLoad.role === COUNTERTYPE)
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
