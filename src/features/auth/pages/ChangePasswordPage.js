import React, { useState, useEffect, useRef } from 'react';
import './changepassword.css';
import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
    CircularProgress,
    TextField,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    EmailOutlined,
    CheckCircle,
    Cancel,
    SendOutlined,
    InfoOutlined,
    LockReset,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logout } from '../AuthSlice';
import { sendOtpAPI, resetPasswordAPI } from '../ForgetPasswordSlice';
import { parseApiError } from '../../../utils/apiErrorHelper';
import { tokenStorage } from '../../../services/storage/tokenStorage';

const PASSWORD_REGEX = /^[A-Z][a-z0-9#@$]{7,39}$/;

const ChangePasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Access user auth & profile info
    const authInfo = useSelector(getUserInfo);
    const profileUser = useSelector((state) => state.user?.user);

    const detectedEmail =
        authInfo?.user?.email ||
        authInfo?.payLoad?.email ||
        profileUser?.email ||
        '';

    const [email, setEmail] = useState(detectedEmail);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 60s cooldown for OTP resend
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);

    // Keep email synced if auth state finishes loading after mount
    useEffect(() => {
        if (!email && detectedEmail) {
            setEmail(detectedEmail);
        }
    }, [detectedEmail, email]);

    // Cleanup countdown timer on unmount
    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    const startCooldown = (seconds = 60) => {
        setCooldown(seconds);
        if (cooldownRef.current) clearInterval(cooldownRef.current);

        cooldownRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Live password validation criteria
    const startsWithUpper = /^[A-Z]/.test(password);
    const hasValidLength = password.length >= 8 && password.length <= 40;
    const hasValidFormat = PASSWORD_REGEX.test(password);
    const isMatching = password && passwordConfirm && password === passwordConfirm;
    const isMismatch = passwordConfirm && password !== passwordConfirm;

    // 1. Request OTP via email
    const handleSendOtp = async () => {
        const targetEmail = (email || detectedEmail || '').trim();

        if (!targetEmail) {
            toast.error('يرجى كتابة البريد الإلكتروني الخاص بالحساب');
            return;
        }

        setIsSendingOtp(true);
        try {
            const res = await dispatch(sendOtpAPI({ email: targetEmail })).unwrap();
            setOtpSent(true);
            startCooldown(60);
            toast.success(res?.message || 'تم إرسال رمز التحقق بنجاح وهو صالح لمدة 10 دقائق');
        } catch (error) {
            const { message } = parseApiError(error, 'تعذر إرسال رمز التحقق، يرجى المحاولة لاحقاً');
            toast.error(message);
        } finally {
            setIsSendingOtp(false);
        }
    };

    // 2. Submit Password Change
    const handleSubmitChange = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const targetEmail = (email || detectedEmail || '').trim();

        if (!targetEmail) {
            toast.error('البريد الإلكتروني مفقود، يرجى كتابة بريدك الإلكتروني');
            return;
        }

        const cleanOtp = String(otp).trim();
        if (!cleanOtp || cleanOtp.length !== 6) {
            toast.error('يرجى إدخال رمز التحقق المكون من 6 أرقام');
            return;
        }

        if (!password) {
            toast.error('يرجى إدخال كلمة المرور الجديدة');
            return;
        }

        if (!PASSWORD_REGEX.test(password)) {
            toast.error(
                'كلمة المرور يجب أن تبدأ بحرف كبير وتتكون من 8 إلى 40 حرفاً (أرقام، أحرف صغيرة، رموز #، @، $)'
            );
            return;
        }

        if (!passwordConfirm) {
            toast.error('يرجى تأكيد كلمة المرور الجديدة');
            return;
        }

        if (password !== passwordConfirm) {
            toast.error('كلمتا المرور غير متطابقتين');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await dispatch(
                resetPasswordAPI({
                    email: targetEmail,
                    OTP: cleanOtp,
                    password,
                    password_confirm: passwordConfirm,
                })
            ).unwrap();

            toast.success(
                'تم تغيير كلمة المرور بنجاح، يرجى تسجيل الدخول بكلمة المرور الجديدة',
                { autoClose: 4000 }
            );

            // Invalidate existing session and redirect to login
            dispatch(logout());
            tokenStorage.clearAuth();
            navigate('/login');
            return;
        } catch (error) {
            const { message } = parseApiError(error, 'تعذر تغيير كلمة المرور، يرجى التأكد من البيانات');
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="k-changepassword-page">
            <div className="change-card">
                {/* Header */}
                <div className="card-header">
                    <div className="card-header-icon">
                        <LockReset sx={{ fontSize: 28 }} />
                    </div>
                    <div className="card-header-text">
                        <h2>تغيير كلمة المرور</h2>
                        <p>حماية حسابك عبر التحقق من البريد الإلكتروني وإعادة تعيين كلمة المرور</p>
                    </div>
                </div>

                <div className="card-body">
                    {/* Step Tracker */}
                    <div className="steps-indicator">
                        <div className={`step-item ${otpSent ? 'completed' : 'active'}`}>
                            <div className="step-bubble">1</div>
                            <span className="step-label">طلب رمز التحقق (OTP)</span>
                        </div>
                        <div className={`step-connector ${otpSent ? 'filled' : ''}`}></div>
                        <div className={`step-item ${otpSent ? 'active' : ''}`}>
                            <div className="step-bubble">2</div>
                            <span className="step-label">تعيين كلمة المرور الجديدة</span>
                        </div>
                    </div>

                    {/* Step 1: Email Box & Send OTP */}
                    <div className="email-banner">
                        <div className="email-info">
                            <EmailOutlined className="email-icon" />
                            <div>
                                <div className="email-text-label">البريد الإلكتروني المرتبط بالحساب</div>
                                {detectedEmail ? (
                                    <div className="email-address">{detectedEmail}</div>
                                ) : (
                                    <TextField
                                        size="small"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{ mt: 0.5, width: 240 }}
                                    />
                                )}
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            className="btn-send-otp"
                            disabled={isSendingOtp || cooldown > 0}
                            onClick={handleSendOtp}
                        >
                            {isSendingOtp
                                ? 'جارٍ الإرسال...'
                                : cooldown > 0
                                    ? `إعادة الإرسال بعد (${cooldown} ثانية)`
                                    : otpSent
                                        ? 'إعادة إرسال الرمز'
                                        : 'إرسال رمز التحقق'}
                        </Button>
                    </div>

                    {/* Notification info after OTP sent */}
                    {otpSent && (
                        <div className="info-box">
                            <InfoOutlined fontSize="small" />
                            <span>
                                تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني بنجاح (صالح لمدة 10 دقائق).
                            </span>
                        </div>
                    )}

                    {/* Step 2: Form Fields */}
                    <form onSubmit={handleSubmitChange}>
                        {/* OTP Code */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="otp-input">
                                <span className="required-star">*</span> رمز التحقق (OTP)
                            </label>
                            <div className="otp-input-row">
                                <FormControl fullWidth variant="outlined" size="small">
                                    <OutlinedInput
                                        id="otp-input"
                                        placeholder="أدخل الرمز المكون من 6 أرقام (مثال: 123456)"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                                        }
                                        inputProps={{
                                            maxLength: 6,
                                            inputMode: 'numeric',
                                            style: { letterSpacing: '4px', fontWeight: 'bold' },
                                        }}
                                    />
                                </FormControl>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="new-password-input">
                                <span className="required-star">*</span> كلمة المرور الجديدة
                            </label>
                            <FormControl fullWidth variant="outlined" size="small">
                                <OutlinedInput
                                    id="new-password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    placeholder="أدخل كلمة المرور الجديدة"
                                    onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="تبديل إظهار كلمة المرور"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            {/* Live Password Rules */}
                            <div className="password-rules-box">
                                <div className="rules-title">شروط كلمة المرور:</div>
                                <div className={`rule-item ${startsWithUpper ? 'valid' : 'invalid'}`}>
                                    {startsWithUpper ? (
                                        <CheckCircle sx={{ fontSize: 16 }} />
                                    ) : (
                                        <Cancel sx={{ fontSize: 16 }} />
                                    )}
                                    <span>تبدأ بحرف كبير إنجليزي (A-Z)</span>
                                </div>
                                <div className={`rule-item ${hasValidLength ? 'valid' : 'invalid'}`}>
                                    {hasValidLength ? (
                                        <CheckCircle sx={{ fontSize: 16 }} />
                                    ) : (
                                        <Cancel sx={{ fontSize: 16 }} />
                                    )}
                                    <span>الطول بين 8 إلى 40 حرفاً</span>
                                </div>
                                <div className={`rule-item ${hasValidFormat ? 'valid' : 'invalid'}`}>
                                    {hasValidFormat ? (
                                        <CheckCircle sx={{ fontSize: 16 }} />
                                    ) : (
                                        <Cancel sx={{ fontSize: 16 }} />
                                    )}
                                    <span>تحتوي على أحرف وأرقام أو رموز</span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm-password-input">
                                <span className="required-star">*</span> تأكيد كلمة المرور الجديدة
                            </label>
                            <FormControl fullWidth variant="outlined" size="small">
                                <OutlinedInput
                                    id="confirm-password-input"
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    value={passwordConfirm}
                                    placeholder="أعد إدخال كلمة المرور للتأكيد"
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="تبديل إظهار تأكيد كلمة المرور"
                                                onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            {/* Matching Feedback */}
                            {isMatching && (
                                <div className="match-indicator match">
                                    <CheckCircle sx={{ fontSize: 16 }} />
                                    <span>كلمتا المرور متطابقتان</span>
                                </div>
                            )}
                            {isMismatch && (
                                <div className="match-indicator mismatch">
                                    <Cancel sx={{ fontSize: 16 }} />
                                    <span>كلمة المرور غير متطابقة</span>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="submit-btn-con">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                className="btn-submit-change"
                                disabled={isSubmitting || !otp || !password || !passwordConfirm}
                            // startIcon={
                            //     isSubmitting ? (
                            //         <CircularProgress size={18} color="inherit" />
                            //     ) : (
                            //         <LockReset />
                            //     )
                            // }
                            >
                                {isSubmitting ? 'جارٍ تغيير كلمة المرور...' : 'تأكيد وتغيير كلمة المرور'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChangePasswordPage;
