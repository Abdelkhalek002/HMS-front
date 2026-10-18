import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserInfo } from '../../auth';
import {
  approveUserDocumentsAPI,
  rejectUserDocumentsAPI,
  getUserProfileAPi,
} from '../../users';
import './UserDetails.css';

const UserDetails = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { token, payLoad } = useSelector(getUserInfo) || {};

  const profileInfo = useSelector((state) => state.UserSlice.data) || {};
  const loading = useSelector((state) => state.UserSlice.load);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetId = userId || profileInfo?.id || profileInfo?.student_id;
  const isAdmin =
    payLoad?.type === 'admin' ||
    Boolean(payLoad?.role) ||
    window.location.pathname.startsWith('/ad');

  const docStatus = profileInfo.document_status || 'pending';

  const handleOpenDocModal = () => {
    setIsDocModalOpen(true);
    setShowRejectForm(false);
    setRejectionReason(profileInfo.rejection_reason || '');
  };

  const handleCloseDocModal = () => {
    setIsDocModalOpen(false);
    setShowRejectForm(false);
  };

  // Approve Documents Handler
  const handleApprove = async () => {
    if (!targetId) return;
    setIsSubmitting(true);
    try {
      await dispatch(approveUserDocumentsAPI({ id: targetId, token })).unwrap();
      dispatch(getUserProfileAPi({ id: targetId, token }));
      handleCloseDocModal();
    } catch (error) {
      console.error('Error approving documents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject Documents Handler
  const handleRejectConfirm = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.warn('يرجى كتابة سبب رفض المستندات');
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(
        rejectUserDocumentsAPI({
          id: targetId,
          reason: rejectionReason.trim(),
          token,
        })
      ).unwrap();
      dispatch(getUserProfileAPi({ id: targetId, token }));
      handleCloseDocModal();
    } catch (error) {
      console.error('Error rejecting documents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تفاصيل الطالب</title>
        <meta name="description" content="HSH application user details" />
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="user-details user-details-them">
          {/* Header Bar with Document Status & Trigger Button */}
          <div className="user-docs-header-bar">
            <div>
              <h4 className="user-details-title" style={{ margin: 0 }}>
                تفاصيل الطالب
              </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Document Status Badge */}
              {docStatus === 'approved' ? (
                <span className="doc-status-badge approved">
                  <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                  المستندات معتمدة
                </span>
              ) : docStatus === 'rejected' ? (
                <span className="doc-status-badge rejected">
                  <HighlightOffIcon sx={{ fontSize: 18 }} />
                  المستندات مرفوضة
                </span>
              ) : (
                <span className="doc-status-badge pending">
                  <HourglassEmptyIcon sx={{ fontSize: 18 }} />
                  المستندات قيد المراجعة
                </span>
              )}

              {/* View / Review Documents Button */}
              <Button
                variant="contained"
                color="primary"
                size="small"
                className="user-docs-btn-trigger"
                onClick={handleOpenDocModal}
                startIcon={<DescriptionIcon />}
              >
                {isAdmin ? 'مراجعة المستندات' : 'عرض المستندات'}
              </Button>
            </div>
          </div>

          {/* Rejection notice if document was rejected */}
          {docStatus === 'rejected' && profileInfo.rejection_reason && (
            <div className="rejection-reason-box" style={{ marginTop: 0, marginBottom: '20px' }}>
              <strong>سبب رفض المستندات:</strong>
              {profileInfo.rejection_reason}
            </div>
          )}

          {/* User Information Items */}
          <div className="user-details-item">
            <div className="title">الايميل</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.email || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">الموبايل</div>
            <div className="user-details-value">
              {!loading ? (
                <p style={{ direction: 'ltr', display: 'inline-block' }}>
                  {profileInfo.phoneNumber || profileInfo.phone_number || '-'}
                </p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">النوع</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.gender || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">تاريخ الميلاد</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.birthDay || profileInfo.birth_date || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">الرقم القومي</div>
            <div className="user-details-value">
              {!loading ? (
                <p style={{ direction: 'ltr', display: 'inline-block' }}>
                  {profileInfo.national_id || '-'}
                </p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">الفرقة</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.level_name || profileInfo.level || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">الكلية</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.faculty_name || profileInfo.faculty || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">المحافظة</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.gov_name || profileInfo.governorate || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>

          <div className="user-details-item">
            <div className="title">الجنسية</div>
            <div className="user-details-value">
              {!loading ? (
                <p>{profileInfo.nationality_name || profileInfo.nationality || '-'}</p>
              ) : (
                <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Document Review & Acceptance/Rejection Dialog */}
      <Dialog
        open={isDocModalOpen}
        onClose={handleCloseDocModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: 'docs-dialog-paper',
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DescriptionIcon sx={{ color: '#2563eb' }} />
            <span style={{ fontWeight: 700, fontSize: '18px' }}>
              مستندات الطالب: {profileInfo.userName || profileInfo.username || 'المستخدم'}
            </span>
          </div>
          <IconButton
            aria-label="close"
            onClick={handleCloseDocModal}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Status Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#475569' }}>
              الحالة الحالية:
            </span>
            {docStatus === 'approved' ? (
              <span className="doc-status-badge approved">معتمد ومقبول</span>
            ) : docStatus === 'rejected' ? (
              <span className="doc-status-badge rejected">مرفوض</span>
            ) : (
              <span className="doc-status-badge pending">قيد المراجعة والتدقيق</span>
            )}
          </div>

          {/* Rejection Notice in Modal */}
          {docStatus === 'rejected' && profileInfo.rejection_reason && (
            <div className="rejection-reason-box">
              <strong>سبب الرفض الحالي:</strong>
              {profileInfo.rejection_reason}
            </div>
          )}

          {/* Documents Grid */}
          <div className="docs-grid">
            {/* 1. National ID Card */}
            <div className="doc-card">
              <div className="doc-card-title">
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#2563eb' }}>
                  badge
                </span>
                بطاقة الرقم القومي
              </div>

              <div className="doc-preview-container">
                {profileInfo.national_id_file_url ? (
                  <img
                    src={profileInfo.national_id_file_url}
                    alt="بطاقة الرقم القومي"
                    className="doc-preview-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="doc-empty-box">
                    <span className="material-symbols-outlined">hide_image</span>
                    <p style={{ margin: 0, fontSize: '13px' }}>لم يتم رفع بطاقة الرقم القومي</p>
                  </div>
                )}
                <div className="doc-empty-box" style={{ display: 'none' }}>
                  <span className="material-symbols-outlined">broken_image</span>
                  <p style={{ margin: 0, fontSize: '13px' }}>تعذر عرض ملف الصورة</p>
                </div>
              </div>

              <div className="doc-card-footer">
                {profileInfo.national_id_file_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    href={profileInfo.national_id_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    عرض الملف بالحجم الكامل
                  </Button>
                ) : (
                  <Button size="small" variant="text" disabled>
                    غير متوفر
                  </Button>
                )}
              </div>
            </div>

            {/* 2. University Fees Receipt */}
            <div className="doc-card">
              <div className="doc-card-title">
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>
                  receipt_long
                </span>
                إيصال المصروفات الدراسية
              </div>

              <div className="doc-preview-container">
                {profileInfo.fees_file_url ? (
                  <img
                    src={profileInfo.fees_file_url}
                    alt="إيصال المصروفات"
                    className="doc-preview-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="doc-empty-box">
                    <span className="material-symbols-outlined">hide_image</span>
                    <p style={{ margin: 0, fontSize: '13px' }}>لم يتم رفع إيصال المصروفات</p>
                  </div>
                )}
                <div className="doc-empty-box" style={{ display: 'none' }}>
                  <span className="material-symbols-outlined">broken_image</span>
                  <p style={{ margin: 0, fontSize: '13px' }}>تعذر عرض ملف الصورة</p>
                </div>
              </div>

              <div className="doc-card-footer">
                {profileInfo.fees_file_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    href={profileInfo.fees_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    عرض الملف بالحجم الكامل
                  </Button>
                ) : (
                  <Button size="small" variant="text" disabled>
                    غير متوفر
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Form Input (Expandable) */}
          {showRejectForm && (
            <div className="reject-form-container">
              <form onSubmit={handleRejectConfirm}>
                <h5 style={{ margin: '0 0 10px', fontSize: '14px', color: '#b91c1c' }}>
                  تأكيد رفض المستندات:
                </h5>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="سبب الرفض (إلزامي للطالب)"
                  placeholder="مثال: صورة البطاقة غير واضحة، يرجى رفع صورة واضحة ومقروءة..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isSubmitting}
                  sx={{
                    direction: 'rtl',
                    '& label': {
                      right: '1.75rem !important',
                      left: 'inherit !important',
                      transformOrigin: 'right !important',
                    },
                    '& legend': { textAlign: 'right' },
                    '& .MuiInputBase-input': { textAlign: 'right' },
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-start' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <HighlightOffIcon />}
                  >
                    تأكيد الرفض وإشعار الطالب
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    size="small"
                    onClick={() => setShowRejectForm(false)}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={handleCloseDocModal} variant="outlined" color="inherit">
            إغلاق
          </Button>

          {isAdmin && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Reject Button */}
              <Button
                variant={showRejectForm ? 'contained' : 'outlined'}
                color="error"
                disabled={isSubmitting}
                //startIcon={<HighlightOffIcon />}
                onClick={() => setShowRejectForm((prev) => !prev)}
              >
                {showRejectForm ? 'إخفاء نموذج الرفض' : 'رفض المستندات'}
              </Button>

              {/* Accept / Approve Button */}
              <Button
                variant="contained"
                color="success"
                disabled={isSubmitting || docStatus === 'approved'}
                //startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleOutlineIcon />}
                onClick={handleApprove}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                {docStatus === 'approved' ? 'المستندات معتمدة بالفعل' : 'قبول واعتماد المستندات'}
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetails;
