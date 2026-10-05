import React, { useEffect, useRef, useState } from 'react';
import "./Login.css";
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import maroPic from "./../../../images/mero.png";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, loginHandlerAPI, loginLoad } from '../../../RTK/Auth/AuthSlice';
import { COUNTERTYPE, SUPERADMINTYPE, TRANSFERTYPE, USERTYPE } from '../../../ActorType';


const LoginPage = () => {


    // For Change Route 
    const navigate = useNavigate();

    // For Check User Auth 
    const Auth = useSelector(getUserInfo);


    useEffect(() => {
        if (Auth) {
            if (Auth.payLoad.type === USERTYPE)
                navigate('/')
            else if (Auth.payLoad.role === SUPERADMINTYPE)
                navigate('/ad')
            else if (Auth.payLoad.role === COUNTERTYPE)
                navigate("/co")
            else if (Auth.payLoad.role === TRANSFERTYPE)
                navigate("/tr")
        }
    }, [Auth, navigate])

    // For Handling Loadding Login
    const load = useSelector(loginLoad);


    // For Dispatch Action
    const dispatch = useDispatch();

    // For Match Password
    const emailRegex = /.*/;
    const passwordRegex = /.*/;


    // For Handle Show / Not show Password
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // For Access input Filed
    const [email, setEmail] = useState('')
    const [validMail, setValidMail] = useState('idle');  // Idle || Valid || error
    const [password, setPassword] = useState('')
    const [validPassword, setVaildPassword] = useState('idle');  // Idle || Valid || error


    const validEmail = (em) => {
        if (emailRegex.test(em) || em === '') {
            return true
        }
        else {
            return false
        }
    }
    const validPasswordHandler = (ps) => {
        if (passwordRegex.test(ps) || ps === '') {
            return true
        }
        else {
            return false
        }
    }


    // For Check Valid Mail
    const checkValidEmail = (em) => {
        setEmail(em)

        if (validEmail(em)) {
            setValidMail('valid')
        } else {
            setValidMail('error')
        }

    }
    // For Check Password
    const checkValidPassword = (ps) => {
        setPassword(ps)
        if (validPasswordHandler(ps)) {
            setVaildPassword('valid')
        } else {
            setVaildPassword('error')
        }

    }

    // For Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validMail === 'valid' && email !== '' && validPassword === 'valid' && password !== '') {
            const userData = { email, password };
            dispatch(loginHandlerAPI({ userData }));
        }
    }
    return (
        <div className='log-form'>
            <div className='main-form'>

                <div className='log-head'>
                    <h2>مرحبا , في جامعة حلوان</h2>
                    <p>من فضلك سجل لتستطيع حجز موعدك</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        className='karim-input'
                        id="outlined-required"
                        placeholder="الايميل الجامعي"
                        name='email'
                        helperText={validMail === 'error' ? 'please enter a valid mail like a example@fci.helwan.edu.eg' : ""}
                        value={email}
                        onChange={(e) => { checkValidEmail(e.target.value) }}
                        error={validMail === 'error' ? true : false}
                    />

                    <FormControl variant="outlined"  >
                        <OutlinedInput
                            onChange={(e) => checkValidPassword(e.target.value)}
                            placeholder='كلمة السر'
                            value={password}
                            name='password'
                            id="outlined-adornment-password"
                            fullWidth

                            className='karim-input'
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>

                            }
                        />

                        {
                            validPassword === 'error' ? (<FormHelperText style={{ width: "320px", maxWidth: "100%" }} error id="component-helper-text">
                                Password should start with uppercase letter and should include lower letter and number and "@" OR "&"
                            </FormHelperText>) : ""
                        }

                    </FormControl>


                    <Link className='forget-pass' to={"/forgetpassword"}>نسيت كلمة السر</Link>
                    <Button fullWidth type='submit' className='log-btn' variant='contained' color="info">  {load ? <i className="fa-spin fa-solid fa-spinner"></i> : "تسجيل الدخول"}</Button>

                </form>
            </div>

            <div className='image'>
                <img src={maroPic} loading='lazy' alt='pic-doc' />
            </div>

        </div>
    )
}

export default LoginPage;
