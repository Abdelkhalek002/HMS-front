import React, { useState } from 'react'
import "./changepassword.css"
import { Button, FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo } from '../../../RTK/Auth/AuthSlice'
import { changePasswordAPI } from '../../../RTK/User/UserSlice'

const ChangePasswordPage = () => {


    // For Dispatch Action
    const dispatch = useDispatch() ;

    // For Access Token and ID
    const {token , payLoad} = useSelector(getUserInfo) ;

    // For Access Input
    const [passwordOld , setPasswordOld] = useState('')
    const [passwordNew , setPasswordNew] = useState('')
    const [passwordCon, setPasswordCon] = useState('')

    // For Handle Show Password Old
    const [showPasswordOld, setShowPasswordOld] = React.useState(false);
    const handleClickShowPasswordOld = () => setShowPasswordOld((show) => !show);
    const handleMouseDownPasswordOld = (event) => {
      event.preventDefault();
    };

    // For Handle show password new 
    const [showPasswordNew, setShowPasswordNew] = React.useState(false);
    const handleClickShowPasswordNew = () => setShowPasswordNew((show) => !show);
    const handleMouseDownPasswordNew = (event) => {
      event.preventDefault();
    };

    // For Handle Confirm 
    const [showPasswordCon, setShowPasswordCon] = React.useState(false);
    const handleClickShowPasswordCon = () => setShowPasswordCon((show) => !show);
    const handleMouseDownPasswordCon = (event) => {
      event.preventDefault();
    };

    // For Change Password
    const changePasswordHandler = ()=>{
        if(passwordOld !== '' && passwordNew !== '' && passwordCon !== ''){
            if(passwordCon === passwordNew) {
                const data = new FormData()
                data.append('currentPassword' , passwordOld)
                data.append('newPassword' , passwordNew)
                dispatch(changePasswordAPI({token , id :payLoad.userId ,data }))
            }else{
                toast.error('عذار كلمة السر غير متاطبقة')
            }
        }else{
            toast.error('رجاء ادخال جميع الحقول')
        }
    }

  return (
    <div className='k-changepassword-page'>
        <div className='change-container'>
            <h2 className='title'>تغير كلمة السر</h2>
            <div className='input-con'>

                <div className='row'>
                    <label>كلمة السر الحالية</label>
                    <FormControl sx={{ m: 1, width: '32ch' }} variant="outlined">

                        <OutlinedInput
                        value={passwordOld}
                        onChange={(e)=>{setPasswordOld(e.target.value)}}
                        id="outlined-adornment-password"
                        type={showPasswordOld ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPasswordOld}
                                onMouseDown={handleMouseDownPasswordOld}
                                edge="end"
                            >
                                {showPasswordOld ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        }

                        />
                    </FormControl>
                </div>

                <div className='row'>
                    <label>كلمة السر الجديدة</label>
                    <FormControl sx={{ m: 1, width: '32ch' }} variant="outlined">

                        <OutlinedInput
                        value={passwordNew}
                        onChange={(e)=>{setPasswordNew(e.target.value)}}
                        id="outlined-adornment-password"
                        type={showPasswordNew ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPasswordNew}
                                onMouseDown={handleMouseDownPasswordNew}
                                edge="end"
                            >
                                {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        }

                        />
                    </FormControl>
                </div>

                <div className='row'>
                    <label> تاكيد كلمة السر </label>
                    <FormControl sx={{ m: 1, width: '32ch' }} variant="outlined">

                        <OutlinedInput
                        value={passwordCon}
                        onChange={(e)=>{setPasswordCon(e.target.value)}}
                        id="outlined-adornment-password"
                        type={showPasswordCon ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPasswordCon}
                                onMouseDown={handleMouseDownPasswordCon}
                                edge="end"
                            >
                                {showPasswordCon ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        }

                        />
                    </FormControl>
                </div>

                <Button onClick={changePasswordHandler} variant="contained" className='k-btn' >تغير</Button>

            </div>
        </div>
    </div>
  )
}

export default ChangePasswordPage
