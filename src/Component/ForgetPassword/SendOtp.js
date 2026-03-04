import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { sendOtpAPI } from '../../RTK/ForgetPassword/ForgetPasswordSlice';
import { toast } from 'react-toastify';
import StatusCode from '../../StatusCode';
import { useNavigate } from 'react-router-dom';

const SendOtp = () => {


  // For Change Route
  const navigate = useNavigate() ;

  // For Dispatch Aciton 
  const dispatch = useDispatch() ; 

  // For Access Email Input
  const [email , setEmail ] = useState('') ;

  // For Handle Send OTP
  const sendOtpHandeler = ()=>{
    if(email !== ''){
      dispatch(sendOtpAPI({email }))
    }else{
      toast.error("الرجاء ادخال الايميل الجامعي")
    }
  }

  // For Check send OTP
  const status = useSelector(state => state.ForgetPasswordSlice.statusOtp)

  if(status === StatusCode.SUCCESS){
    navigate('otp')
  }

  return (
    <div className='send-opt-container'>
        <h2>برجاء ادخال الايميل الجامعي الخاص بك</h2>
        <TextField onChange={(e)=>setEmail(e.target.value)} className='send-input' fullWidth placeholder='الايميل الجامعي'  />
        <Button onClick={sendOtpHandeler} className='send-btn' fullWidth variant="contained" style={{background :"black"}}>ارسال الرمز</Button>
    </div>
  )
}

export default SendOtp
