import React from 'react'
import {  useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { TRANSFERTYPE } from '../../ActorType';

const TransferProtect = () => {
 
    // For Dispatch Action
    const dispatch = useDispatch() ;  

    // For Access Data In Local Stroage 
    const userData =  useSelector(getUserInfo) ; 

    if(userData){
        if(userData.payLoad.role === TRANSFERTYPE)
        return <Outlet />
        else{
            return <Navigate to={`/notfound`} />
        }
    }else{
        dispatch(logout()) ; 
        return <Navigate  to={'/login'} />
    }


}

export default TransferProtect
