import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { forgetPasswordAPI, savePassword } from '../../RTK/ForgetPassword/ForgetPasswordSlice';
import StatusCode from '../../StatusCode';
import { useNavigate } from 'react-router-dom';

const NewPasswordComponent = () => {

    // For Change Route
    const navigate = useNavigate() ; 

    // For Dispatch Action
    const dispatch = useDispatch() ;

    // For Access Input
    const [password , setPassword] = useState('') ; 
    const [rePassword , setRePassword] = useState('') ; 

    // For Send Data TO Backend
    const forgetPasswordHandler = ()=>{
        if(password !== '' && rePassword !== ''){
            if(password === rePassword) {
                dispatch(forgetPasswordAPI( {password}))
            }else{
                toast.error('كلمة السر غير متطابقة ')
            }
        }else{
            toast.error("برجاء ادخال الحقول ")
        }
    }

    const state = useSelector(state => state.ForgetPasswordSlice.statusFinal) ; 


    if(state === StatusCode.SUCCESS) {
        navigate('/login')
    }


  return (
    <div className='send-opt-container'>
    <h2>    كلمة السر الجديدة</h2>
    <TextField style={{marginBottom : "20px"}} value={password} onChange={(e)=>setPassword(e.target.value)} className='send-input' fullWidth placeholder='كلمة السر الجديدة'  />
    <TextField value={rePassword} onChange={(e)=>setRePassword(e.target.value)} className='send-input' fullWidth placeholder='تاكيد كلمة السر'  />
    <Button onClick={forgetPasswordHandler} className='send-btn' fullWidth variant="contained" style={{background :"black"}}> تاكيد</Button>
</div>
  )
}

export default NewPasswordComponent
