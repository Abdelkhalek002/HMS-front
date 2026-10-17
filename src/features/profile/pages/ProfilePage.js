import React, { useEffect, useRef, useState } from 'react';
import "./profile.css";
import { Link, NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logout } from "../../auth";
import { getUserProfile, getUserProfileAPi, getUserReservationAPI, sendObservations } from '../../users';
import { Box, Button, Modal, Skeleton, Typography } from '@mui/material';
import StatusCode from '../../../StatusCode';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../services/http';
import userPic from '../../../images/userProfile.jpg';

const ProfilePage = () => {

    // For Dispatch Action
    const dispatch = useDispatch();

    // For Change Route
    const navigate = useNavigate();

    const loading = useSelector(state => state.UserSlice.load);

    const { token, payLoad } = useSelector(getUserInfo);

    // For Access Params In URL
    const [searchParams] = useSearchParams();

    // For Get User Data
    useEffect(() => {
        dispatch(getUserProfileAPi({ id: payLoad.userId, token }));
        dispatch(getUserReservationAPI({ token, page: searchParams.get('page') ? searchParams.get('page') : 1 }));
    }, [dispatch, payLoad, token, searchParams]);

    const Authroized = useSelector(state => state.UserSlice.statusReservation);

    if (Authroized === StatusCode.UNAUTHORIZED) {
        dispatch(logout());
        navigate('/login');
    }

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Add modal handlers
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };
    const profileInfo = useSelector(getUserProfile);


    const observation = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = dispatch(sendObservations({ id: profileInfo.student_id, message: observation.current.value }));
            toast.success(response.message, {
                theme: "colored",
                position: "top-right",
            });
            handleCloseAddModal();
        } catch (error) {
            console.error("Error sending observation:", error);
            if (error.message === "Request failed with status code 429") {
                toast.error("تجاوزت الحد الأقصى من المحاولات، برجاء المحاولة لاحقًا", {
                    theme: "colored",
                    position: "top-right"
                });
            } else {
                toast.error("حدث خطأ أثناء إرسال الملاحظة", {
                    theme: "colored",
                    position: "top-right",
                });
            }
        }
    };


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 230,
        bgcolor: 'white',
        borderRadius: 5,
        boxShadow: 24,
        p: 4,
    };

    console.log(profileInfo);


    return (
        <section className='k-profile-page'>
            <div className='profile-header'>
                <Modal
                    open={isAddModalOpen}
                    onClose={handleCloseAddModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
                            اضافة محافظة جديدة
                        </Typography>
                        <form>
                            <div className='popup-all-filed'>
                                <div className='row'>
                                    <label style={{ marginRight: "40px" }}>الاسم</label>
                                    <input className='popup-field' type="text" id='govName' ref={observation} style={{ width: "180px", marginRight: "10px", marginTop: "40px", height: "30px", borderRadius: "6px" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px" }}>
                                <Button variant="contained" className='popup-btn' style={{ borderRadius: "12px" }} onClick={handleSubmit} >حفظ</Button>
                            </div>
                        </form>
                    </Box>
                </Modal>

                {
                    !loading ?
                        <div className={`image ${profileInfo.status ? 'active' : ''}`}>
                            {(() => {
                                const photo = profileInfo.profile_photo_url;
                                const photoSrc = photo
                                    ? (photo.startsWith('http')
                                        ? photo
                                        : `${BASE_URL}/uploads/${photo.replace(/^\/+/, '')}`)
                                    : userPic;
                                return (
                                    <img
                                        src={photoSrc}
                                        alt='profile'
                                        loading='lazy'
                                        onError={(e) => { e.target.src = userPic; }}
                                    />
                                );
                            })()}
                        </div> :
                        <Skeleton variant="circular" width={40} height={40} />
                }
                {
                    !loading ?
                        <h3>{profileInfo.userName}</h3> :
                        <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                }
                <div className='send-message-btn'>


                    <Link style={{ textDecoration: "none" }} to={"/editprofile"}><button className='edit-profile-btn edite-profile-btn btn-shape'>تعديل الملف الشخصي</button></Link>
                </div>
                <div className='k-user-tabs'>
                    <NavLink end to={"."}>تفاصيل الطالب</NavLink>
                    <NavLink to={"history"}> الكشف</NavLink>
                </div>
            </div>
            <Outlet />
        </section>
    );
}

export default ProfilePage;
