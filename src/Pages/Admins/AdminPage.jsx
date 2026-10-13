import React, { useRef, useState } from 'react';
import "./AdminPage.css";
import AllAdminComponent from '../../Component/GroupAdmin/AllAdminComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { addNewAdminApi, getAllAdminsApi } from '../../RTK/Admins/AdminSlice';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { toast } from 'react-toastify';
import defaultAdminPic from '../../images/generic-avatar.jpg';
import {
  COUNTERTYPE,
  SECONDSUPERADMIN,
  SUPERADMINTYPE,
  TRANSFERTYPE,
  VIEWERTYPE,
  MEDICAL_CHECK_MANAGER,
  EXTERNAL_HOSPITAL_ADMIN,
  isSuperAdminRole
} from '../../ActorType';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 480 },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  p: { xs: 2.5, sm: 3.5 },
  outline: 'none',
  direction: 'rtl'
};

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

const AdminPage = () => {
  const dispatch = useDispatch();
  const { token, payLoad } = useSelector(getUserInfo) || {};
  const isSuperAdmin = isSuperAdminRole(payLoad?.role);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: COUNTERTYPE
  });

  const handleOpenAddModal = () => {
    setFormData({
      userName: '',
      email: '',
      password: '',
      role: COUNTERTYPE
    });
    setPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    if (!submitting) {
      setPhoto(null);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsAddModalOpen(false);
    }
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
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.role) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('username', formData.userName.trim());
      payload.append('userName', formData.userName.trim());
      payload.append('name', formData.userName.trim());
      payload.append('email', formData.email.trim());
      payload.append('password', formData.password);
      payload.append('role', formData.role);

      if (photo) {
        payload.append('profile_photo', photo);
      }

      await dispatch(addNewAdminApi({ data: payload, token })).unwrap();
      toast.success('تمت إضافة المسؤول بنجاح');
      dispatch(getAllAdminsApi({ token }));
      handleCloseAddModal();
    } catch (error) {
      const errMsg =
        error?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : 'حدث خطأ أثناء إضافة المسؤول');
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='k-group-user-page'>
      <div className='admin-header-row'>
        <h2 className='title'>المسؤولين</h2>
        {isSuperAdmin && (
          <Button
            variant='contained'
            color='primary'
            startIcon={<PersonAddAlt1Icon />}
            onClick={handleOpenAddModal}
            className='add-admin-btn'
          >
            إضافة مسؤول جديد
          </Button>
        )}
      </div>

      <AllAdminComponent />

      {/* Add Admin Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        aria-labelledby='add-admin-modal-title'
      >
        <Box sx={modalStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Typography id='add-admin-modal-title' variant='h6' component='h3' style={{ fontWeight: 700, color: '#1f2937' }}>
              إضافة مسؤول جديد
            </Typography>
            <IconButton onClick={handleCloseAddModal} size='small' disabled={submitting}>
              <CloseIcon />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit} dir='rtl'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Photo Upload Area */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={photoPreview || defaultAdminPic}
                    alt='معاينة الصورة'
                    sx={{
                      width: 82,
                      height: 82,
                      border: '3px solid #e5e7eb',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      bgcolor: '#f3f4f6',
                      color: '#6b7280',
                      transition: '0.2s',
                      '&:hover': {
                        opacity: 0.85,
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoCamera sx={{ fontSize: 34 }} />
                  </Avatar>

                  {photoPreview && (
                    <IconButton
                      size='small'
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
                      title='حذف الصورة'
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />

                <Button
                  size='small'
                  variant='text'
                  color='primary'
                  startIcon={<PhotoCamera />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mt: 1, fontSize: '13px', fontWeight: 600 }}
                >
                  {photo ? 'تغيير الصورة' : 'رفع صورة شخصية (اختياري)'}
                </Button>
              </div>

              <TextField
                label='اسم المسؤول'
                name='userName'
                value={formData.userName}
                onChange={handleChange}
                fullWidth
                required
                autoFocus
                size='small'
                sx={rtlInputSx}
              />

              <TextField
                label='البريد الإلكتروني'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                size='small'
                sx={rtlInputSx}
              />

              <TextField
                label='كلمة المرور'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                size='small'
                sx={rtlInputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'
                        size='small'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <FormControl fullWidth required size='small' sx={rtlInputSx}>
                <InputLabel id='role-select-label'>الدور / الصلاحية</InputLabel>
                <Select
                  labelId='role-select-label'
                  name='role'
                  value={formData.role}
                  label='الدور / الصلاحية'
                  onChange={handleChange}
                >
                  <MenuItem value={COUNTERTYPE}>كاونتر (Counter)</MenuItem>
                  <MenuItem value={TRANSFERTYPE}>تحويلات (Transfer)</MenuItem>
                  <MenuItem value={SECONDSUPERADMIN}>مدير ثان (Second Manager)</MenuItem>
                  <MenuItem value={VIEWERTYPE}>ملاحظ (Viewer)</MenuItem>
                  <MenuItem value={MEDICAL_CHECK_MANAGER}>مسئول الكشف الطبي (Medical Check Manager)</MenuItem>
                  <MenuItem value={EXTERNAL_HOSPITAL_ADMIN}>أدمن مستشفي خارجي (External Hospital Admin)</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <Button
                variant='outlined'
                onClick={handleCloseAddModal}
                disabled={submitting}
                style={{ borderRadius: '8px' }}
              >
                إلغاء
              </Button>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={submitting}
                style={{ borderRadius: '8px', minWidth: '100px' }}
              >
                {submitting ? <CircularProgress size={22} color='inherit' /> : 'إضافة'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminPage; 
