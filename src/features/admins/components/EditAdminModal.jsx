import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import defaultAdminPic from '../../../images/generic-avatar.jpg';
import { updateAdminApi, getAllAdminsApi } from '../AdminSlice.js';
import { getUserInfo } from '../../auth';
import { isStatusActive } from '../adminFilterUtils.js';

const rtlInputSx = {
  direction: 'rtl',
  '& label': {
    left: 'inherit !important',
    right: '1.75rem !important',
    transformOrigin: 'right !important',
    textAlign: 'right',
  },
  '& legend': {
    textAlign: 'right',
  },
  '& .MuiInputBase-input': {
    textAlign: 'right',
  },
  '& .MuiSelect-icon': {
    left: '7px',
    right: 'auto',
  },
};

const EditAdminModal = ({ open, onClose, admin }) => {
  const dispatch = useDispatch();
  const { token } = useSelector(getUserInfo) || {};

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'COUNTER',
    status: 'ACTIVE',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (admin && open) {
      const isActiveState = isStatusActive(admin.status !== undefined ? admin.status : admin.isActive);
      const currentStatus = isActiveState ? 'ACTIVE' : 'INACTIVE';

      setFormData({
        username: admin.username || admin.title || '',
        email: admin.email || '',
        password: '',
        role: admin.role || 'COUNTER',
        status: currentStatus,
      });

      setPhoto(null);
      setPhotoPreview(admin.image || admin.profile_photo_url || null);
      setShowPassword(false);
    }
  }, [admin, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب ألا يتجاوز 5 ميجابايت');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (photoPreview && photo) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.role) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('username', formData.username.trim());
      payload.append('userName', formData.username.trim());
      payload.append('email', formData.email.trim());
      payload.append('role', formData.role);
      payload.append('status', formData.status);

      if (formData.password && formData.password.trim() !== '') {
        payload.append('password', formData.password);
      }

      if (photo) {
        payload.append('profile_photo', photo);
      }

      await dispatch(
        updateAdminApi({
          id: admin.id,
          data: payload,
          token,
        })
      ).unwrap();

      toast.success('تم تعديل بيانات المسؤول بنجاح');
      dispatch(getAllAdminsApi({ token }));
      onClose();
    } catch (error) {
      const errMsg =
        error?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : 'حدث خطأ أثناء تعديل بيانات المسؤول');
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: '#1f2937' }}>
            تعديل بيانات المسؤول
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} dir="rtl">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, pt: 3 }}>
          {/* Photo Upload Area */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={photoPreview || defaultAdminPic}
                alt="صورة المسؤول"
                sx={{
                  width: 82,
                  height: 82,
                  border: '3px solid #e5e7eb',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  bgcolor: '#f3f4f6',
                  color: '#6b7280',
                  transition: '0.2s',
                  '&:hover': { opacity: 0.85 },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCamera sx={{ fontSize: 34 }} />
              </Avatar>

              {photoPreview && (
                <IconButton
                  size="small"
                  onClick={handleRemovePhoto}
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    bgcolor: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    padding: '2px',
                    color: '#ef4444',
                    '&:hover': { bgcolor: '#fee2e2' },
                  }}
                  title="إزالة الصورة"
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />

            <Button
              size="small"
              variant="text"
              color="primary"
              startIcon={<PhotoCamera />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ mt: 1, fontSize: '13px', fontWeight: 600 }}
            >
              {photo ? 'تغيير الصورة' : 'رفع صورة شخصية جديدة'}
            </Button>
          </Box>

          <TextField
            label="اسم المستخدم"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={rtlInputSx}
          />

          <TextField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={rtlInputSx}
          />

          <TextField
            label="كلمة المرور الجديدة (اتركه فارغاً للإبقاء على الحالية)"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="اتركه فارغاً إذا كنت لا ترغب بتغيير كلمة المرور"
            sx={rtlInputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth required size="small" sx={rtlInputSx}>
            <InputLabel id="edit-role-select-label">الدور / الصلاحية</InputLabel>
            <Select
              labelId="edit-role-select-label"
              name="role"
              value={formData.role}
              label="الدور / الصلاحية"
              onChange={handleChange}
            >
              <MenuItem value="COUNTER">كاونتر (Counter)</MenuItem>
              <MenuItem value="TRANSFER_CLERK">مسؤول التحويلات (Transfer Clerk)</MenuItem>
              <MenuItem value="OBSERVER">ملاحظ (Observer / Auditor)</MenuItem>
              <MenuItem value="MEDICAL_CHECK_MANAGER">مسؤول الكشف الطبي (Medical Check Manager)</MenuItem>
              <MenuItem value="MEDICAL_TESTS_MANAGER">مسؤول التحاليل (Medical Tests Manager)</MenuItem>
              <MenuItem value="SUPER_ADMIN">مدير النظام (Super Admin)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={rtlInputSx}>
            <InputLabel id="edit-status-select-label">حالة الحساب</InputLabel>
            <Select
              labelId="edit-status-select-label"
              name="status"
              value={formData.status}
              label="حالة الحساب"
              onChange={handleChange}
            >
              <MenuItem value="ACTIVE">نشط (Active)</MenuItem>
              <MenuItem value="INACTIVE">غير نشط (Inactive)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={submitting}
            sx={{ borderRadius: '8px' }}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ borderRadius: '8px', minWidth: '120px' }}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'حفظ التعديلات'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAdminModal;
