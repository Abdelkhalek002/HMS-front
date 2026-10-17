import React, { useEffect, useRef, useState } from 'react';
import './editPro.css';
import userPic from '../../../images/userProfile.jpg';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../../RTK/Auth/AuthSlice';
import {
  getUserProfile,
  getUserProfileAPi,
  updateProfileAPI,
} from '../../../RTK/User/UserSlice';
import { Button, Skeleton } from '@mui/material';
import UploadPhotoModal from './UploadPhotoModal';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../../API_Route/GlobalRoute';

const EditProfile = () => {
  const dispatch = useDispatch();

  // For Token and User info
  const { token, payLoad } = useSelector(getUserInfo);

  // Fetch user profile on load
  useEffect(() => {
    dispatch(getUserProfileAPi({ id: payLoad?.userId, token }));
  }, [dispatch, token, payLoad?.userId]);

  // User profile data
  const profileInfo = useSelector(getUserProfile) || {};
  const loading = useSelector((state) => state.UserSlice?.load);

  // Only username is editable in the modal
  const [name, setName] = useState('');
  const nameRef = useRef(null);

  // Modals state
  const [open, setOpen] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setName(profileInfo.userName || profileInfo.username || '');
  };
  const handleClose = () => setOpen(false);

  const handleUpdatePhoto = () => setUploadPhoto(true);
  const handleClosePhoto = () => setUploadPhoto(false);

  // Modal styling
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    maxWidth: '90%',
    height: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '12px',
    p: 3,
  };

  const stylePhotoModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 520,
    maxWidth: '90%',
    border: '3px solid #EEE',
    height: 320,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 2,
  };

  // Handle username update
  const updateUserHandler = (e) => {
    e.preventDefault();
    const trimmed = (name || '').trim();
    if (!trimmed) {
      toast.error('برجاء إدخال اسم المستخدم');
      return;
    }

    const args = {
      token,
      data: {
        username: trimmed,
      },
    };

    dispatch(updateProfileAPI(args))
      .unwrap()
      .then((res) => {
        toast.success(res?.msg || res?.message || 'تم تحديث اسم المستخدم بنجاح');
        setOpen(false);
        dispatch(getUserProfileAPi({ token }));
      })
      .catch((error) => {
        toast.error(error || 'حدث خطأ أثناء التحديث');
      });
  };

  // Dynamic image resolution using BASE_URL instead of hardcoded localhost
  const getPhotoUrl = (imgPath) => {
    if (!imgPath) return userPic;
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    const cleanPath = imgPath.replace(/^\/+/, '');
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  const currentPhoto = getPhotoUrl(
    profileInfo.profile_photo_url
  );

  return (
    <section className="k-edit-profile-page k-edite-profile-page">
      {/* Upload Photo Modal */}
      <Modal
        keepMounted
        open={uploadPhoto}
        onClose={handleClosePhoto}
        aria-labelledby="upload-photo-modal-title"
        aria-describedby="upload-photo-modal-description"
      >
        <Box sx={stylePhotoModal}>
          <UploadPhotoModal handleClosePhoto={handleClosePhoto} />
        </Box>
      </Modal>

      {/* Edit Username Modal */}
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal-title"
        aria-describedby="edit-profile-modal-description"
      >
        <Box sx={style}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="k-main-over"
          >
            <h3 className="over-title">تعديل اسم المستخدم</h3>
            <p className="over-des">برجاء التأكد من صحة الاسم قبل الحفظ</p>

            <form onSubmit={updateUserHandler}>
              <div className="row" style={{ marginTop: '20px' }}>
                <label htmlFor="name">اسم المستخدم</label>
                <input
                  value={name}
                  ref={nameRef}
                  onChange={(e) => setName(e.target.value)}
                  className="over-input"
                  id="name"
                  placeholder="برجاء ادخال اسم المستخدم"
                  autoFocus
                />
              </div>

              <div className="over-btn" style={{ marginTop: '25px' }}>
                <Button type="submit" variant="contained">
                  حفظ
                </Button>
              </div>
            </form>
          </motion.div>
        </Box>
      </Modal>

      <h2 className="edit-profile-heading edite-profile-heading">تعديل الملف الشخصي</h2>

      <div className="edit-container edite-container">
        {/* Profile Picture Section */}
        <div className="image-profile">
          <div className="image">
            <img
              src={currentPhoto}
              alt="profile"
              onError={(e) => {
                e.target.src = userPic;
              }}
            />
          </div>
          <div className="edit-image-info edite-image-info">
            <button onClick={handleUpdatePhoto} className="upload-image-btn updload-image-btn">
              تحميل صورة جديدة
            </button>
            <p className="image-size">... يفضل صورة بمقاس 800 * 800 بكسل على الأقل</p>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="edit-personal edite-personal">
          <div className="personal-card">
            <div className="personal-heading peronsal-heading">
              <h3>المعلومات الشخصية</h3>
              <button onClick={handleOpen}>
                تعديل الاسم{' '}
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
            <div className="personal-data peronsal-data">
              <div className="data-card">
                <h4>الاسم</h4>
                {!loading ? (
                  <p>{profileInfo.userName || profileInfo.username || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>

              <div className="data-card">
                <h4>الايميل</h4>
                {!loading ? (
                  <p>{profileInfo.email || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>

              <div className="data-card">
                <h4>الموبايل</h4>
                {!loading ? (
                  <p>{profileInfo.phoneNumber || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>

              <div className="data-card">
                <h4>الرقم القومي</h4>
                {!loading ? (
                  <p>{profileInfo.national_id || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>

              <div className="data-card">
                <h4>المحافظة</h4>
                {!loading ? (
                  <p>{profileInfo.gov_name || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>

              <div className="data-card">
                <h4>الكلية</h4>
                {!loading ? (
                  <p>{profileInfo.faculty_name || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>

              <div className="data-card">
                <h4>المستوي</h4>
                {!loading ? (
                  <p>{profileInfo.level_name || '-'}</p>
                ) : (
                  <Skeleton width={60} height={20} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
