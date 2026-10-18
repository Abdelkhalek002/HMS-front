import React, { useEffect, useState } from 'react'
import "./reservation.css"
import { Button, MenuItem, Select } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../auth';
import { useCreateReservationMutation } from '../reservationApi';
import { getUserProfile, getUserProfileAPi } from '../../users';
import { getAllClinics, getAllClinicsAPI } from '../../lookups';


const ReservationPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createReservation, { isLoading: isCreatingReservation }] = useCreateReservationMutation();
  const auth = useSelector(getUserInfo) || {};
  const token = auth.token;
  const userId = auth.user?.id || auth.payLoad?.userId;

  const userData = useSelector(getUserProfile);

  // For Access Clinic Data
  const [clinic, setClinic] = React.useState('');

  const handleChangeClinic = (event) => {
    setClinic(event.target.value);
  };

  // For Get User Data
  useEffect(() => {
    if (token) {
      dispatch(getUserProfileAPi({ token, id: userId }));
      dispatch(getAllClinicsAPI({ token }));
    }
  }, [dispatch, token, userId]);

  // For Access Clinic
  const clinics = useSelector(getAllClinics);

  // For Access Reservation Type
  const [typeR, setTypeR] = useState('');

  const handleChangeTypeR = (event) => {
    setTypeR(event.target.value);
  };

  // For Access Date 
  const [date, setDate] = useState('');

  const handleChangeDate = (day, month, year) => {
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    setDate(`${year}-${formattedMonth}-${formattedDay}`);
  };

  // Status checks
  const isEmailUnverified = userData?.verified === false || userData?.verified === 0;
  const documentStatus =
    userData?.document_status ||
    (userData?.status === 'approved'
      ? 'approved'
      : userData?.status === 'rejected'
        ? 'rejected'
        : 'pending');
  const isDocumentApproved = documentStatus === 'approved';
  const isDocumentRejected = documentStatus === 'rejected';
  const isDocumentPending = !isDocumentApproved && !isDocumentRejected;

  const canReserve = !isEmailUnverified && isDocumentApproved;

  // For Create Reservation
  const createReservationHandler = async () => {
    if (isEmailUnverified) {
      toast.warn("برجاء تأكيد بريدك الإلكتروني أولاً عن طريق رمز التحقق المرسل لك.", {
        autoClose: 5000,
      });
      navigate('/verify-otp', {
        state: { email: userData?.email || auth.user?.email },
      });
      return;
    }

    if (!isDocumentApproved) {
      const msg = isDocumentRejected
        ? `تم رفض مستنداتك: ${userData?.rejection_reason || "يرجى مراجعة إدارة المستشفى"}`
        : "حسابك قيد مراجعة المستندات من قبل الإدارة، لا يمكنك إجراء حجوزات حالياً";
      toast.warn(msg, { autoClose: 5000 });
      return;
    }

    if (clinic !== '' && clinic !== undefined && clinic !== null) {
      if (typeR !== '') {
        if (date !== '') {
          const payload = {
            clinic_id: Number(clinic),
            date,
            exam_type: `${typeR}`,
          };
          try {
            await createReservation(payload).unwrap();
            toast.success("تم حجز الكشف بنجاح برجاء إحضار الكارنيه وإذن الكلية");
          } catch (error) {
            const rawError =
              (typeof error?.data?.error === "string" ? error.data.error : null) ||
              (typeof error?.data?.message === "string" ? error.data.message : null) ||
              (typeof error?.data === "string" ? error.data : null) ||
              (Array.isArray(error?.data?.errors)
                ? error.data.errors.map((e) => e?.msg || e?.message || String(e)).join(" - ")
                : null) ||
              (typeof error?.error === "string" ? error.error : null) ||
              (typeof error?.message === "string" ? error.message : null) ||
              (typeof error?.data?.error === "object" ? JSON.stringify(error.data.error) : null) ||
              "حدث خطأ أثناء حجز الكشف برجاء اعادة المحاولة";

            const errorMsg = String(rawError);

            if (errorMsg.includes("رمز التحقق") || errorMsg.includes("تأكيد بريدك")) {
              toast.warn(errorMsg, { autoClose: 6000 });
              navigate('/verify-otp', {
                state: { email: userData?.email || auth.user?.email },
              });
              return;
            }

            toast.error(errorMsg);
          }
        } else {
          toast.error('برجاء اختيار معاد الكشف');
        }
      } else {
        toast.error('برجاء اختيار نوع الكشف');
      }
    } else {
      toast.error("برجاء اختيار العيادة");
    }
  };

  return (
    <section className='k-reservation-page'>
      <div className='reservation-container'>
        <h2 className='title'>حجز الكشف</h2>

        {isEmailUnverified && (
          <div className="reservation-status-banner unverified">
            <span className="material-symbols-outlined banner-icon">mark_email_unread</span>
            <div className="banner-body">
              <div className="banner-title">بريدك الإلكتروني غير مؤكد بعد</div>
              <div className="banner-desc">
                يرجى إدخال رمز التحقق (OTP) المرسل إلى بريدك الجامعي لتتمكن من حجز موعد الكشف الطبي.
              </div>
              <Button
                variant="contained"
                color="info"
                size="small"
                className="banner-action-btn"
                onClick={() =>
                  navigate('/verify-otp', {
                    state: { email: userData?.email || auth.user?.email },
                  })
                }
              >
                تأكيد البريد الإلكتروني الآن
              </Button>
            </div>
          </div>
        )}

        {!isEmailUnverified && isDocumentPending && (
          <div className="reservation-status-banner pending">
            <span className="material-symbols-outlined banner-icon">hourglass_top</span>
            <div className="banner-body">
              <div className="banner-title">المستندات قيد مراجعة الإدارة (Pending)</div>
              <div className="banner-desc">
                تم استلام مستنداتك بنجاح وجارٍ التحقق منها ومراجعتها من قبل إدارة المستشفى. ستتمكن من حجز الكشف فور اعتماد حسابك.
              </div>
            </div>
          </div>
        )}

        {!isEmailUnverified && isDocumentRejected && (
          <div className="reservation-status-banner rejected">
            <span className="material-symbols-outlined banner-icon">cancel</span>
            <div className="banner-body">
              <div className="banner-title">تم رفض اعتماد المستندات</div>
              <div className="banner-desc">
                {userData?.rejection_reason
                  ? `سبب الرفض: ${userData.rejection_reason}`
                  : 'يرجى مراجعة إدارة المستشفى أو إعادة فحص المستندات المرفوعة.'}
              </div>
              <Button
                variant="outlined"
                color="error"
                size="small"
                className="banner-action-btn"
                onClick={() => navigate(`/profile/${userId}`)}
              >
                عرض الملف الشخصي والمستندات
              </Button>
            </div>
          </div>
        )}

        <div className='input-cont'>
          <div className='row'>
            <label className='row-title'>العيادة</label>
            <Select
              style={{ width: "300px", maxWidth: "100%" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={clinic}
              disabled={!canReserve}
              onChange={handleChangeClinic}
            >
              {clinics
                ? clinics.map((item) => {
                  const clinicId = item.clinic_id ?? item.id;
                  return (
                    <MenuItem key={clinicId} value={clinicId}>
                      {item.clinicName || item.clinic_name}
                    </MenuItem>
                  );
                })
                : ""}
            </Select>
          </div>

          <div className='row'>
            <label className='row-title'>نوع الكشف</label>
            <Select
              style={{ width: "300px", maxWidth: "100%" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={typeR}
              disabled={!canReserve}
              onChange={handleChangeTypeR}
            >
              <MenuItem value={'كشف جديد'}>كشف جديد</MenuItem>
              <MenuItem value={`متابعة`}>متابعة</MenuItem>
              <MenuItem value={"طوارئ"}>طوارئ</MenuItem>
            </Select>
          </div>

          <div className='row'>
            <div className='row-title'>تاريخ الكشف</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  'DatePicker',
                  'TimePicker',
                  'DateTimePicker',
                  'DateRangePicker',
                ]}
              >
                <DatePicker
                  disabled={!canReserve}
                  onChange={(e) => {
                    handleChangeDate(e.$D, e.$M + 1, e.$y);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <Button
            onClick={createReservationHandler}
            disabled={isCreatingReservation || !canReserve}
            className='k-btn'
            variant="contained"
            style={{
              backgroundColor: !canReserve ? '#94a3b8' : undefined,
              cursor: !canReserve ? 'not-allowed' : undefined,
            }}
          >
            {isCreatingReservation
              ? "جاري الحجز..."
              : isEmailUnverified
                ? "يرجى تأكيد البريد أولاً"
                : isDocumentPending
                  ? "الحساب قيد المراجعة"
                  : isDocumentRejected
                    ? "المستندات مرفوضة"
                    : "حجز"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReservationPage;
