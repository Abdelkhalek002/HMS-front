import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { toast } from 'react-toastify';

import {
  useGetReservationByIdQuery,
  useUpdateReservationStatusMutation,
  useInitiateTransferMutation,
} from '../reservationApi';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permissionUtils';
import userPicFallback from '../../../images/userProfile.jpg';
import './ReservationDetails.css';

/**
 * Format date string into Cairo local time (Arabic locale).
 */
const formatCairoDateTime = (dateStr) => {
  if (!dateStr) return { date: '—', time: '—' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: String(dateStr), time: '—' };

    const dateFormatted = d.toLocaleDateString('ar-EG', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

    const timeFormatted = d.toLocaleTimeString('ar-EG', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return { date: dateFormatted, time: timeFormatted };
  } catch {
    return { date: String(dateStr), time: '—' };
  }
};

/**
 * Format ISO timestamp into clean Arabic date & time.
 */
const formatTimestamp = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString('ar-EG', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return String(dateStr);
  }
};

const ReservationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // RTK Query: View Single Reservation by ID
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReservationByIdQuery(id);

  // RTK Query: Mutations
  const [updateReservationStatus, { isLoading: isUpdatingStatus }] =
    useUpdateReservationStatusMutation();
  const [initiateTransfer, { isLoading: isInitiatingTransfer }] =
    useInitiateTransferMutation();

  // Permission Checks
  const { canMutate } = usePermission();
  const canApprove = canMutate(PERMISSIONS.RESERVATIONS_APPROVE);
  const canTransfer = canMutate(PERMISSIONS.TRANSFERS_WRITE);

  // Local Modal States
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferReason, setTransferReason] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  // Extract reservation object
  const reservation = responseData?.data || responseData;

  // Copy National ID Handler
  const handleCopyNationalId = (nid) => {
    if (!nid) return;
    navigator.clipboard.writeText(nid);
    toast.info('تم نسخ الرقم القومي');
  };

  // Status Action Handlers
  const handleAcceptConfirm = async () => {
    try {
      await updateReservationStatus({ id, status: 'مقبول' }).unwrap();
      toast.success('تم قبول الكشف بنجاح');
      setIsAcceptDialogOpen(false);
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || 'حدث خطأ أثناء قبول الكشف';
      toast.error(errMsg);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      await updateReservationStatus({ id, status: 'مرفوض' }).unwrap();
      toast.success('تم رفض الكشف');
      setIsRejectDialogOpen(false);
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || 'حدث خطأ أثناء رفض الكشف';
      toast.error(errMsg);
    }
  };

  const handleTransferSubmit = async (e) => {
    e?.preventDefault();
    if (!transferReason.trim()) {
      toast.error('يرجى إدخال سبب التحويل');
      return;
    }
    try {
      await initiateTransfer({
        id,
        transfer_reason: transferReason.trim(),
        notes: transferNotes.trim() || undefined,
      }).unwrap();
      toast.success('تم تحويل الكشف بنجاح إلى قسم التحويلات');
      setIsTransferModalOpen(false);
      setTransferReason('');
      setTransferNotes('');
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || 'حدث خطأ أثناء تحويل الكشف';
      toast.error(errMsg);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Back Button Handler
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/reservations');
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="resv-details-container">
        <div style={{ marginBottom: 24 }}>
          <Skeleton variant="text" width={240} height={30} />
          <Skeleton variant="rounded" width="100%" height={90} sx={{ mt: 2 }} />
        </div>
        <div className="resv-content-grid">
          <div className="resv-col-patient">
            <Skeleton variant="rounded" width="100%" height={450} />
          </div>
          <div className="resv-col-exam">
            <Skeleton variant="rounded" width="100%" height={450} />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !reservation) {
    const errorMsg =
      error?.data?.message || error?.error || 'تعذر تحميل بيانات الكشف الطبي أو الكشف غير موجود';
    return (
      <div className="resv-details-container">
        <div
          className="resv-card"
          style={{ textAlign: 'center', padding: '60px 24px' }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 60, color: '#ef4444', mb: 2 }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            حدث خطأ أثناء تحميل الحجز
          </h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>{errorMsg}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              type="button"
              className="resv-btn resv-btn-secondary"
              onClick={handleBack}
            >
              العودة لقائمة الحجوزات
            </button>
            <button
              type="button"
              className="resv-btn resv-btn-accept"
              onClick={() => refetch()}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Computed Values & Context
  const patientName =
    reservation.patientName ||
    reservation.name ||
    reservation.user?.name ||
    'غير محدد';
  const nationalId = reservation.nationalId || reservation.user?.national_id;
  const phoneNumber =
    reservation.phoneNumber || reservation.user?.phone_number;
  const clinicName = reservation.clinicName || 'العيادة العامة';
  const examType = reservation.examType || 'كشف طبي';
  const status = reservation.status || 'تحت الانتظار';
  const isEmergencyExam =
    examType.includes('طوارئ') || examType.includes('طواريْ');
  const isWalkIn =
    reservation.user?.is_walk_in === true ||
    (!reservation.user?.id && !reservation.user?.user_id);
  const studentId = reservation.user?.id || reservation.user?.user_id;

  const { date: appointmentDate, time: appointmentTime } = formatCairoDateTime(
    reservation.date || reservation.time
  );

  const photoUrl =
    reservation.userImage ||
    reservation.user?.profile_photo_url ||
    userPicFallback;

  const transfer = reservation.transfer;
  const isPendingStatus =
    status === 'تحت الانتظار' || status === 'معلق' || status === 'pending';

  return (
    <div className="resv-details-container">
      <Helmet>
        <title>{`تفاصيل الكشف #${reservation.id || id} | إدارة المستشفى`}</title>
      </Helmet>

      {/* Printable Ticket Header (Appears only on window.print()) */}
      <div className="resv-print-ticket-only">
        <h2>مستشفى الطلبة الجامعي - تذكرة حجز كشف طبي</h2>
        <p>تذكرة كشف رقم: #{reservation.id || id}</p>
        <p>تاريخ الطباعة: {formatTimestamp(new Date().toISOString())}</p>
      </div>

      {/* Header & Breadcrumbs Section */}
      <div className="resv-details-header">
        <div className="resv-breadcrumbs">
          <Link to="/reservations" className="resv-breadcrumb-link">
            إدارة الحجوزات والكاونتر
          </Link>
          <span className="resv-breadcrumb-separator">/</span>
          <span>تفاصيل الحجز رقم #{reservation.id || id}</span>
        </div>

        <div className="resv-header-main">
          <div className="resv-header-title-box">
            <Tooltip title="العودة لقائمة الحجوزات" placement="top">
              <button
                type="button"
                className="resv-back-btn"
                onClick={handleBack}
              >
                <ArrowForwardIcon fontSize="small" />
              </button>
            </Tooltip>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 className="resv-page-title">تفاصيل الكشف الطبي</h1>
                <span className="resv-id-pill">#{reservation.id || id}</span>
              </div>
            </div>

            <div className="resv-header-badges">
              {/* Status Badge */}
              {status === 'تحت الانتظار' || status === 'معلق' || status === 'pending' ? (
                <span className="resv-status-badge pending">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    hourglass_empty
                  </span>
                  تحت الانتظار
                </span>
              ) : status === 'مقبول' ? (
                <span className="resv-status-badge accepted">
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  مقبول
                </span>
              ) : status === 'مرفوض' ? (
                <span className="resv-status-badge rejected">
                  <CancelIcon sx={{ fontSize: 16 }} />
                  مرفوض
                </span>
              ) : status === 'محول' ? (
                <span className="resv-status-badge transferred">
                  <LocalHospitalIcon sx={{ fontSize: 16 }} />
                  محول لمستشفى خارجية
                </span>
              ) : (
                <span className="resv-status-badge accepted">{status}</span>
              )}

              {/* Exam Type Badge */}
              <span
                className={`resv-type-badge ${isEmergencyExam ? 'emergency' : ''}`}
              >
                <MedicalServicesIcon sx={{ fontSize: 16 }} />
                {examType}
              </span>
            </div>
          </div>

          <div className="resv-header-actions">
            <button
              type="button"
              className="resv-btn resv-btn-print"
              onClick={handlePrint}
            >
              <PrintIcon fontSize="small" />
              طباعة التذكرة
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="resv-content-grid">
        {/* Patient Information Card */}
        <div className="resv-col-patient">
          <div className="resv-card">
            <div className="resv-card-header">
              <h2 className="resv-card-title">
                <span className="card-icon teal">
                  <PersonIcon fontSize="small" />
                </span>
                بيانات المريض / الطالب
              </h2>
              {/* Walk-in indicator */}
              {isWalkIn ? (
                <span className="resv-walkin-badge walkin">
                  كشف طوارئ - غير مسجل
                </span>
              ) : (
                <span className="resv-walkin-badge student">
                  <CheckCircleIcon sx={{ fontSize: 14 }} />
                  طالب مسجل
                </span>
              )}
            </div>

            {/* Top Profile Box */}
            <div className="resv-patient-profile-top">
              <img
                src={photoUrl}
                alt={patientName}
                className="resv-patient-avatar"
                onError={(e) => {
                  e.target.src = userPicFallback;
                }}
              />
              <div className="resv-patient-meta">
                <h3 className="resv-patient-name">{patientName}</h3>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  {isWalkIn ? 'مريض كاونتر طوارئ' : 'طالب جامعي منتظم'}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="resv-info-list">
              {/* National ID */}
              <div className="resv-info-item">
                <span className="resv-info-label">
                  الرقم القومي
                  {nationalId && (
                    <Tooltip title="نسخ الرقم" placement="top">
                      <ContentCopyIcon
                        sx={{ fontSize: 14, cursor: 'pointer', color: '#2563eb' }}
                        onClick={() => handleCopyNationalId(nationalId)}
                      />
                    </Tooltip>
                  )}
                </span>
                <span className="resv-info-value">
                  {nationalId || 'غير متوفر'}
                </span>
              </div>

              {/* Phone Number */}
              <div className="resv-info-item">
                <span className="resv-info-label">
                  <PhoneIcon sx={{ fontSize: 14 }} />
                  رقم الهاتف للتواصل
                </span>
                <span className="resv-info-value">
                  {phoneNumber ? (
                    <a href={`tel:${phoneNumber}`} dir="ltr">
                      {phoneNumber}
                    </a>
                  ) : (
                    'غير متوفر'
                  )}
                </span>
              </div>

              {/* Academic Details (if registered student) */}
              {!isWalkIn && (
                <div className="resv-info-grid-2">
                  <div className="resv-info-item">
                    <span className="resv-info-label">
                      <SchoolIcon sx={{ fontSize: 14 }} />
                      الكلية
                    </span>
                    <span className="resv-info-value">
                      {reservation.facultyName ||
                        reservation.user?.faculty_name ||
                        'غير محدد'}
                    </span>
                  </div>
                  <div className="resv-info-item">
                    <span className="resv-info-label">الفرقة الدراسية</span>
                    <span className="resv-info-value">
                      {reservation.levelName ||
                        reservation.user?.level_name ||
                        'غير محدد'}
                    </span>
                  </div>
                </div>
              )}

              {/* Geographic Details */}
              <div className="resv-info-grid-2">
                <div className="resv-info-item">
                  <span className="resv-info-label">
                    <LocationOnIcon sx={{ fontSize: 14 }} />
                    المحافظة
                  </span>
                  <span className="resv-info-value">
                    {reservation.govName ||
                      reservation.user?.gov_name ||
                      'غير محدد'}
                  </span>
                </div>
                <div className="resv-info-item">
                  <span className="resv-info-label">
                    <PublicIcon sx={{ fontSize: 14 }} />
                    الجنسية
                  </span>
                  <span className="resv-info-value">
                    {reservation.nationalityName ||
                      reservation.user?.nationality_name ||
                      'مصري'}
                  </span>
                </div>
              </div>

              {/* View Full Student Profile Button (if registered) */}
              {!isWalkIn && studentId && (
                <div style={{ marginTop: 8 }}>
                  <Link
                    to={`/profile-viewer/${studentId}`}
                    className="resv-btn resv-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                    عرض السجل الكامل لملف الطالب
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clinic & Examination Card */}
        <div className="resv-col-exam">
          <div className="resv-card">
            <div className="resv-card-header">
              <h2 className="resv-card-title">
                <span className="card-icon">
                  <MedicalServicesIcon fontSize="small" />
                </span>
                بيانات العيادة وموعد الكشف
              </h2>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                معرف العيادة: #{reservation.clinicId || '—'}
              </span>
            </div>

            {/* Clinic Banner */}
            <div className="resv-clinic-banner">
              <div className="resv-clinic-icon-circle">
                <LocalHospitalIcon fontSize="inherit" />
              </div>
              <div className="resv-clinic-info">
                <h3 className="resv-clinic-title">{clinicName}</h3>
                <span className="resv-clinic-subtitle">
                  قسم الكشف الطبي والعيادات التخصصية بمستشفى الطلبة
                </span>
              </div>
            </div>

            {/* Appointment Time Box */}
            <div className="resv-appointment-time-box">
              <div className="resv-time-block">
                <span className="label">
                  <CalendarMonthIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} />
                  تاريخ الحجز المعتمد
                </span>
                <span className="value">{appointmentDate}</span>
              </div>
              <div style={{ width: 1, height: 35, background: '#e9d5ff' }} />
              <div className="resv-time-block">
                <span className="label">
                  <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} />
                  وقت الحجز (توقيت القاهرة)
                </span>
                <span className="value">{appointmentTime}</span>
              </div>
            </div>

            {/* Exam Metadata Grid */}
            <div className="resv-info-grid-2">
              <div className="resv-info-item">
                <span className="resv-info-label">نوع الكشف الطبي</span>
                <span className="resv-info-value">{examType}</span>
              </div>

              <div className="resv-info-item">
                <span className="resv-info-label">حالة الكشف</span>
                <span className="resv-info-value">{status}</span>
              </div>

              <div className="resv-info-item">
                <span className="resv-info-label">تاريخ إنشاء الطلب</span>
                <span className="resv-info-value">
                  {formatTimestamp(reservation.createdAt)}
                </span>
              </div>

              <div className="resv-info-item">
                <span className="resv-info-label">آخر تحديث للبيانات</span>
                <span className="resv-info-value">
                  {formatTimestamp(reservation.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* External Hospital Transfer Card (Conditional) */}
          {transfer && (
            <div className="resv-card resv-transfer-card">
              <div className="resv-card-header">
                <h2 className="resv-card-title">
                  <span className="card-icon purple">
                    <LocalHospitalIcon fontSize="small" />
                  </span>
                  بيانات التحويل لمستشفى خارجية
                </h2>
                <span
                  className={`resv-status-badge ${
                    transfer.status === 'completed' ? 'accepted' : 'transferred'
                  }`}
                >
                  {transfer.status === 'completed'
                    ? 'تم التحويل بنجاح'
                    : 'قيد التحديد والمتابعة'}
                </span>
              </div>

              <div className="resv-transfer-hospital-banner">
                <div className="resv-transfer-icon">
                  <LocalHospitalIcon fontSize="inherit" />
                </div>
                <div>
                  <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>
                    المستشفى المحول إليها:
                  </span>
                  <h4 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#1e293b' }}>
                    {transfer.externalHospital ||
                      transfer.hospital_name ||
                      'قيد التحديد من قبل قسم التحويلات'}
                  </h4>
                </div>
              </div>

              <div className="resv-info-list">
                <div className="resv-info-item">
                  <span className="resv-info-label">سبب التحويل الطبي:</span>
                  <div className="resv-notes-quote">
                    {transfer.transferReason || 'لا يوجد سبب محدد'}
                  </div>
                </div>

                {transfer.notes && (
                  <div className="resv-info-item">
                    <span className="resv-info-label">ملاحظات إضافية:</span>
                    <span className="resv-info-value">{transfer.notes}</span>
                  </div>
                )}

                <div style={{ marginTop: 8 }}>
                  <Link
                    to="/transfers"
                    className="resv-btn resv-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    الانتقال إلى جدول التحويلات الخارجية
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Administrative Actions Card */}
        <div className="resv-col-full">
          <div className="resv-actions-card">
            <div className="resv-actions-wrapper">
              <div className="resv-actions-prompt">
                <span className="resv-actions-prompt-title">
                  الإجراءات الإدارية والطبية
                </span>
                <span className="resv-actions-prompt-sub">
                  {isPendingStatus
                    ? 'هذا الكشف بانتظار اتخاذ إجراء طبي (قبول / رفض / تحويل خارجي).'
                    : `تم اتخاذ إجراء مسبق على هذا الكشف (الحالة الحالية: ${status}).`}
                </span>
              </div>

              <div className="resv-actions-btn-group">
                {isPendingStatus ? (
                  <>
                    {/* Accept Button */}
                    <button
                      type="button"
                      className="resv-btn resv-btn-accept"
                      disabled={!canApprove || isUpdatingStatus}
                      onClick={() => setIsAcceptDialogOpen(true)}
                    >
                      {isUpdatingStatus ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <CheckCircleIcon fontSize="small" />
                      )}
                      قبول الكشف
                    </button>

                    {/* Reject Button */}
                    <button
                      type="button"
                      className="resv-btn resv-btn-reject"
                      disabled={!canApprove || isUpdatingStatus}
                      onClick={() => setIsRejectDialogOpen(true)}
                    >
                      <CancelIcon fontSize="small" />
                      رفض الكشف
                    </button>

                    {/* Transfer Button */}
                    <button
                      type="button"
                      className="resv-btn resv-btn-transfer"
                      disabled={!canTransfer || isInitiatingTransfer}
                      onClick={() => setIsTransferModalOpen(true)}
                    >
                      {isInitiatingTransfer ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <LocalHospitalIcon fontSize="small" />
                      )}
                      تحويل لمستشفى خارجية
                    </button>
                  </>
                ) : (
                  <div className="resv-info-banner completed">
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                    <span>تم حفظ الحالة النهائية لهذا الكشف بنجاح</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Confirmation Dialog */}
      <Dialog
        open={isAcceptDialogOpen}
        onClose={() => setIsAcceptDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        dir="rtl"
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
          تأكيد قبول الكشف الطبي
        </DialogTitle>
        <DialogContent>
          <p style={{ margin: '8px 0', color: '#475569', fontSize: 14 }}>
            هل أنت متأكد من قبول الكشف الطبي للمريض{' '}
            <strong>{patientName}</strong> في عيادة{' '}
            <strong>{clinicName}</strong>؟
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setIsAcceptDialogOpen(false)}
            variant="outlined"
            disabled={isUpdatingStatus}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAcceptConfirm}
            variant="contained"
            color="success"
            disabled={isUpdatingStatus}
            startIcon={
              isUpdatingStatus ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            تأكيد القبول
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        dir="rtl"
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, color: '#dc2626' }}>
          تأكيد رفض الكشف الطبي
        </DialogTitle>
        <DialogContent>
          <p style={{ margin: '8px 0', color: '#475569', fontSize: 14 }}>
            هل أنت متأكد من رفض حجز الكشف للمريض{' '}
            <strong>{patientName}</strong>؟ لا يمكن التراجع عن هذا الإجراء بعد
            التأكيد.
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setIsRejectDialogOpen(false)}
            variant="outlined"
            disabled={isUpdatingStatus}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
            disabled={isUpdatingStatus}
            startIcon={
              isUpdatingStatus ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            تأكيد الرفض
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Modal Dialog */}
      <Dialog
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        maxWidth="sm"
        fullWidth
        dir="rtl"
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
          تحويل الكشف إلى مستشفى خارجية
        </DialogTitle>
        <form onSubmit={handleTransferSubmit}>
          <DialogContent>
            <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 14 }}>
              سيتم إرسال الكشف رقم #{reservation.id || id} للمريض{' '}
              <strong>{patientName}</strong> إلى قسم التحويلات لتحديد المستشفى
              الخارجية المناسبة.
            </p>

            <TextField
              label="سبب التحويل الطبي *"
              fullWidth
              required
              multiline
              rows={3}
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder="اكتب التشخيص المبدئي أو سبب التحويل..."
              sx={{ mb: 2 }}
            />

            <TextField
              label="ملاحظات إضافية (اختياري)"
              fullWidth
              multiline
              rows={2}
              value={transferNotes}
              onChange={(e) => setTransferNotes(e.target.value)}
              placeholder="أي توصيات أو تعليمات موجهة لقسم التحويلات..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setIsTransferModalOpen(false)}
              variant="outlined"
              disabled={isInitiatingTransfer}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: '#7c3aed', '&:hover': { background: '#6d28d9' } }}
              disabled={isInitiatingTransfer || !transferReason.trim()}
              startIcon={
                isInitiatingTransfer ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <LocalHospitalIcon />
                )
              }
            >
              تأكيد وإرسال التحويل
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ReservationDetailsPage;
