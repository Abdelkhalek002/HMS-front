import React from 'react'
import {  useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';

const UserProtect = ({children}) => {


    // For Access Data In Local Stroage 
    const userData =  useSelector(getUserInfo) ; 

    if(userData){
        if(userData.payLoad.type === 'user'){
            console.log('You Are User')
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
