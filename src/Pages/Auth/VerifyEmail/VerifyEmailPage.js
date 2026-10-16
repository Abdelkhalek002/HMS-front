import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, TextField, CircularProgress } from '@mui/material';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { verifyEmailAPI, resendOtpAPI } from '../../../RTK/Auth/AuthSlice';
import maroPic from '../../../images/mero.png';
import '../Login/Login.css';
import './VerifyEmail.css';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleVerify = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      setIsEditingEmail(true);
      return;
    }

    if (otp.length < 4) {
      toast.error('يرجى إدخال رمز التحقق كاملاً');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(verifyEmailAPI({ data: { email: email.trim(), otp: otp.trim() } })).unwrap();
      toast.success('تم تفعيل بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.');
      navigate('/login');
    } catch (error) {
      const message =
        error?.message ||
        error?.error ||
        (typeof error === 'string' ? error : null) ||
        'رمز التحقق غير صحيح أو منتهي الصلاحية';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    if (!email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني أولاً');
      setIsEditingEmail(true);
      return;
    }

    setResending(true);
    try {
      await dispatch(resendOtpAPI({ data: { email: email.trim() } })).unwrap();
      toast.success('تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني');
      setCountdown(60);
      setOtp('');
    } catch (error) {
      const message =
        error?.message ||
        error?.error ||
        (typeof error === 'string' ? error : null) ||
        'حدث خطأ أثناء إعادة إرسال الرمز، يرجى المحاولة لاحقاً';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="log-form">
      <div className="main-form">
        <div className="verify-container">
          <div className="verify-badge-icon">
            <span className="material-symbols-outlined">mark_email_read</span>
          </div>

          <div className="log-head" style={{ marginBottom: 10 }}>
            <h2>تأكيد البريد الإلكتروني ✉️</h2>
            <p>أدخل رمز التحقق (OTP) المرسل إلى بريدك لتفعيل حسابك</p>
          </div>

          {!isEditingEmail && email ? (
            <div className="verify-email-display">
              <span>{email}</span>
              <button
                type="button"
                className="edit-icon-btn"
                title="تعديل البريد الإلكتروني"
                onClick={() => setIsEditingEmail(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  edit
                </span>
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', marginBottom: 15 }}>
              <TextField
                fullWidth
                size="small"
                className="karim-input"
                label="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@fci.helwan.edu.eg"
              />
              {initialEmail && (
                <Button
                  size="small"
                  onClick={() => setIsEditingEmail(false)}
                  style={{ marginTop: 4, fontSize: 12 }}
                >
                  إلغاء التعديل
                </Button>
              )}
            </div>
          )}

          <form onSubmit={handleVerify} style={{ width: '100%' }}>
            <div className="verify-otp-wrapper">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputType="tel"
                shouldAutoFocus
                inputStyle="verify-otp-input"
                renderInput={(props) => <input {...props} />}
              />
            </div>

            <Button
              fullWidth
              type="submit"
              className="log-btn"
              variant="contained"
              color="info"
              disabled={submitting || otp.length < 4}
              style={{ height: 46 }}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'تأكيد وتفعيل الحساب'}
            </Button>
          </form>

          <div className="resend-section">
            <span>لم يصلك الرمز؟</span>
            {countdown > 0 ? (
              <span>
                إعادة الإرسال خلال{' '}
                <span className="resend-timer-badge">{countdown} ثانية</span>
              </span>
            ) : (
              <button
                type="button"
                className="resend-btn"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'جارٍ الإرسال...' : 'إعادة إرسال رمز التحقق'}
              </button>
            )}
          </div>

          <div className="auth-separator" style={{ width: '100%', marginTop: 24 }}>
            <span>أو</span>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <Link to="/login" style={{ color: '#0284c7', fontSize: 13.5, textDecoration: 'none' }}>
              العودة لتسجيل الدخول
            </Link>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <Link to="/signup" style={{ color: '#64748b', fontSize: 13.5, textDecoration: 'none' }}>
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>

      <div className="image">
        <img src={maroPic} loading="lazy" alt="pic-doc" />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
