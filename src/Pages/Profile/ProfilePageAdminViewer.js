import React from 'react';
import { useEffect, useRef, useState } from 'react';
import "./profile.css";
import { NavLink, Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from "./../../RTK/Auth/AuthSlice";
import { getUserProfile, getUserProfileAPi, getUserReservationAPI } from '../../RTK/User/UserSlice';
import { Box, Button, Modal, Skeleton, Typography } from '@mui/material';

import { sendObservations } from '../../RTK/UserControl/UserControlSlice.js';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../API_Route/GlobalRoute';
import userPic from '../../images/userProfile.jpg';

const ProfilePageAdminViewer = () => {
   // For Dispatch Action
   const dispatch = useDispatch();

   // For Change Route
   

   const loading = useSelector(state => state.UserSlice.load);

   const { token } = useSelector(getUserInfo) || {};

    // For Access Param
    const { userId } = useParams();

    // For Access Params In URL
    const [searchParams] = useSearchParams();

    // For Get User Data
    useEffect(() => {
        if (token && userId) {
            dispatch(getUserProfileAPi({ id: userId, token }));
            dispatch(getUserReservationAPI({ token, userId, page: searchParams.get('page') ? searchParams.get('page') : 1 }));
        }
    }, [dispatch, userId, token, searchParams]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Add modal handlers
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };
    const profileInfo = useSelector(getUserProfile) || {};

    const observation = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = observation.current?.value?.trim();
        if (!msg) {
            toast.error("برجاء إدخال نص الملاحظة");
            return;
        }
        try {
            const targetId = userId || profileInfo?.student_id || profileInfo?.id;
            const res = await dispatch(sendObservations({ id: targetId, message: msg, token })).unwrap();
            toast.success(res?.message || res?.msg || "تم إرسال الملاحظة بنجاح", {
                theme: "colored",
                position: "top-right",
            });
            if (observation.current) observation.current.value = "";
            handleCloseAddModal();
        } catch (error) {
            console.error("Error sending observation:", error);
            if (error?.message === "Request failed with status code 429") {
                toast.error("تجاوزت الحد الأقصى من المحاولات، برجاء المحاولة لاحقًا", {
                    theme: "colored",
                    position: "top-right"
                });
            } else {
                toast.error(error?.message || "حدث خطأ أثناء إرسال الملاحظة", {
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

   console.log(profileInfo) ; 


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
                            إرسال ملاحظة للطالب
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <div className='popup-all-filed'>
                                <div className='row' style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                    <label style={{ marginRight: "20px", fontWeight: "bold" }}>الملاحظة</label>
                                    <input
                                        className='popup-field'
                                        type="text"
                                        id='observationText'
                                        ref={observation}
                                        placeholder="اكتب الملاحظة هنا..."
                                        style={{ flex: 1, marginRight: "10px", height: "36px", borderRadius: "6px", padding: "0 8px" }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                                <Button type="submit" variant="contained" className='popup-btn' style={{ borderRadius: "12px" }}>إرسال</Button>
                            </div>
                        </form>
                   </Box>
               </Modal>

               {
                   !loading ?
                       <div className={`image ${profileInfo.status ? 'active' : ''}`}>
                            <img
                                src={
                                    profileInfo.userImage_file
                                        ? (profileInfo.userImage_file.startsWith('http')
                                            ? profileInfo.userImage_file
                                            : `${BASE_URL}/uploads/${profileInfo.userImage_file.replace(/^\/+/, '')}`)
                                        : userPic
                                }
                                alt='profile'
                                loading='lazy'
                                onError={(e) => { e.target.src = userPic; }}
                            />
                       </div> :
                       <Skeleton variant="circular" width={40} height={40} />
               }
               {
                   !loading ?
                       <h3>{profileInfo.userName}</h3> :
                       <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
               }
               <div className='send-message-btn'>
                   <button className='message-btn btn-shape' onClick={handleOpenAddModal}>
                       <span className="material-symbols-outlined">
                           send
                       </span>
                   </button>

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

export default ProfilePageAdminViewer
