import React, { useState } from 'react'
import otpPic from "../../../images/vectorOtp-.png";
import OtpInput from 'react-otp-input';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveOtp } from '../../../RTK/ForgetPassword/ForgetPasswordSlice';
import { toast } from 'react-toastify';


const OtpComponent = () => {
  // For Change Route
  const navigate = useNavigate();

  // For Dispatch Action
  const dispatch = useDispatch();

  // For Accecss Otp
  const [otp, setOtp] = useState('');


  // For Handle Save Otp

  const otpHandler = () => {
    if (otp.length === 6) {
      dispatch(saveOtp(+otp));
      navigate('../newpassword');
    } else {
      toast.error("برجاء اداخال رقم التحقق بشكل صحيح")
    }
  }

  return (
    <div className='otp-cotaniner'>
      <div className='image'>
        <img src={otpPic} alt='otp' loading='lazy' />
      </div>
      <h4>برجاء تحقيق الحساب </h4>
      <p className='otp-details'>برجاء ادخال رقم التحقق المكون من 5 حرف</p>
      <OtpInput
        value={otp}
        inputStyle={{ padding: "10px 5px", marginRight: "25px", width: "40px", fontSize: "20px" }}
        onChange={setOtp}
        inputType="text"
        numInputs={6}
        renderInput={(props) => <input  {...props} />}
      />
      <Button onClick={otpHandler} variant="contained" style={{ marginTop: "30px", width: "300px", background: "black", borderRadius: "8px" }}> تحقيق </Button>
    </div>
  )
}

export default OtpComponent
