import React from 'react';
import UserComponent from './UserComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../auth';
import { blockUserApi, deleteUserApi, getAllUserApi, unblockUserApi } from '../UserControlSlice.js';
import StatusCode from '../../../StatusCode.js';
import { Button, Skeleton } from '@mui/material';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useSearchParams } from 'react-router-dom';

const AllUserComponent = () => {

    // For Access Token
    const { token } = useSelector(getUserInfo) || {}; 

    // For Access All Users
    const { status, data: allUserData } = useSelector(state => state.UserControlSlice);

    // For Access Param 
    const [searchParams] = useSearchParams(); 

    // For Dispatch Action
    const dispatch = useDispatch() ; 


    // For Delete User
    const handleDelete = (id) => {
        swal({
            title: " هل انت متأكد من الحذف؟",
            text: "لما تحذفه مش هتقدر ترجعه تاني",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((confirmDelete) => {
            if (confirmDelete) {
                dispatch(deleteUserApi({data : id , token}))
                .unwrap()
                .then((msg) => {
                    console.log(msg);
                    swal(msg.message, { icon: "success" });
                    dispatch(getAllUserApi({token}));
                })
                .catch(error => {
                    console.error("Error deleting user:", error.error);
                    if (error.error === "Request failed with status code 429")
                        toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا", {
                            theme: "colored",
                            position: "top-right"
                        })
                    else
                        toast.error("حدث خطأ ما برجاء ", {
                            theme: "colored",
                            position: "top-right"
                        })
                });
            }
        });
    };


    // For Block User 
    const handleBlock = (id) => {
        console.log(`the Search Params Here ${searchParams.get('page')}`)
        swal({
            title: " هل انت متأكد من الحظر؟",
            text: "لما تحظره مش هتقدر ترجعه تاني",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((confirmBlock) => {
            if (confirmBlock) {
                dispatch(blockUserApi({data : id , token} ))
                .unwrap()
                .then((msg) => {
                    console.log(msg);
                    swal(msg.message, { icon: "success" });
                    dispatch(getAllUserApi({ token, page : searchParams.get('page') ?searchParams.get('page'):1 }));
                })
                .catch(error => {
                    console.error("Error blocking user:", error.error);
                    if (error.error === "Request failed with status code 429")
                        toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا", {
                            theme: "colored",
                            position: "top-right"
                        })
                    else
                        toast.error("حدث خطأ ما برجاء ", {
                            theme: "colored",
                            position: "top-right"
                        })
                });
            }
        });
    };

    // For unBlock User
    const handleUnblock = (id) => {
        swal({
            title: " هل انت متأكد من الغاء الحظر؟",
            text: "لما تلغي الحظر مش هتقدر ترجعه تاني",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((confirmUnblock) => {
            if (confirmUnblock) {
                dispatch(unblockUserApi({data : id , token}))
                .unwrap()
                .then((msg) => {
                    console.log(msg);
                    swal(msg.message, { icon: "success" });
                    dispatch(getAllUserApi({ token, page : searchParams.get('page') ?searchParams.get('page') :1 }));
                })
                .catch(error => {
                    console.error("Error unblocking user:", error.error);
                    if (error.error === "Request failed with status code 429")
                        toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا", {
                            theme: "colored",
                            position: "top-right"
                        })
                    else
                        toast.error("حدث خطأ ما برجاء ", {
                            theme: "colored",
                            position: "top-right"
                        })
                });
            }
        });
    };


    const currentPage = parseInt(searchParams.get('page'), 10) || 1;
    const pageSize = 8;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedUsers =
        allUserData && allUserData.length > pageSize
            ? allUserData.slice(startIndex, startIndex + pageSize)
            : (allUserData || []);

    // 1. Loading State (Card Skeletons)
    if (status === StatusCode.LOADING || (status === StatusCode.IDLE && (!allUserData || allUserData.length === 0))) {
        return (
            <div className='all-users'>
                {Array.from({ length: pageSize }).map((_, idx) => (
                    <div className='user-card' key={idx} style={{ opacity: 0.85 }}>
                        <div className='user-header'>
                            <Skeleton variant="circular" width={50} height={50} />
                            <div className='det' style={{ flex: 1, marginRight: "16px" }}>
                                <Skeleton variant="text" width="60%" height={22} />
                                <Skeleton variant="text" width="85%" height={16} />
                            </div>
                        </div>
                        <div className='user-status' style={{ marginTop: "20px" }}>
                            <div className='user-status-row' style={{ marginBottom: "10px" }}>
                                <Skeleton variant="text" width="40%" height={16} />
                                <Skeleton variant="text" width="30%" height={16} />
                            </div>
                            <div className='user-status-row'>
                                <Skeleton variant="text" width="35%" height={16} />
                                <Skeleton variant="rounded" width={55} height={20} style={{ borderRadius: 12 }} />
                            </div>
                        </div>
                        <div className='circle'>
                            <Skeleton variant="circular" width={37} height={37} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // 2. Error State
    if (status === StatusCode.ERROR) {
        return (
            <div className="empty-users-box">
                <PeopleOutlineIcon className="empty-users-icon" style={{ color: '#ef4444' }} />
                <h3 className="empty-users-title">تعذر تحميل بيانات المستخدمين</h3>
                <p className="empty-users-desc">حدث خطأ أثناء الاتصال بالخادم، برجاء المحاولة لاحقاً</p>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: '16px', borderRadius: '8px' }}
                    onClick={() => dispatch(getAllUserApi({ token, page: currentPage }))}
                >
                    إعادة المحاولة
                </Button>
            </div>
        );
    }

    // 3. Empty State
    if (!allUserData || allUserData.length === 0) {
        return (
            <div className="empty-users-box">
                <PeopleOutlineIcon className="empty-users-icon" />
                <h3 className="empty-users-title">لا يوجد مستخدمين حالياً</h3>
                <p className="empty-users-desc">لم يتم تسجيل أي مستخدمين في النظام حتى الآن</p>
            </div>
        );
    }

    // 4. Render Users
    return (
        <div className='all-users'>
            {paginatedUsers.map((item, idx) => (
                <UserComponent
                    key={item.student_id || item.id || idx}
                    email={item.email}
                    status={item.status}
                    id={item.student_id || item.id}
                    date={item.birthDay}
                    title={item.userName}
                    blocked={item.blocked}
                    image={item.userImage_file || item.profile_photo_url}
                    handleDelete={() => handleDelete(item.student_id || item.id)} 
                    handleBlock={() => handleBlock(item.student_id || item.id)}
                    handleUnblock={() => handleUnblock(item.student_id || item.id)}
                />
            ))}
        </div>
    );
};

export default AllUserComponent;
