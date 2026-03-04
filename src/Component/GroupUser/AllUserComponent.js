// In AllUserComponent.js
import React, { useEffect } from 'react';
import UserComponent from './UserComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { blockUserApi, deleteUserApi, getAllUserApi, getTotalPageUser, unblockUserApi } from '../../RTK/UserControl/UserControlSlice.js';
import StatusCode from '../../StatusCode.js';
import { Box, Pagination, PaginationItem, Stack } from '@mui/material';
import { CircleLoader } from 'react-spinners';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSearchParams } from 'react-router-dom';



const AllUserComponent = () => {


    // For Access Token
    const {token } = useSelector(getUserInfo) ; 

    // For Access ALll User
    const { status, data: allUserData } = useSelector(state => state.UserControlSlice);

    // For Access Param 
    const [searchParams , setSearchParams] = useSearchParams() ; 

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


    // For Loadding
    if (status === StatusCode.LOADING) {
        return (
        <Box
            sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}
        >
            <CircleLoader color="#0061ff" />
        </Box>
        );
    }



  return (
    <div className='all-users'>
      {allUserData && allUserData.map((item, idx) => (
        <UserComponent
          key={idx}
          email={item.email}
          status={item.status}
          id={item.student_id}
          date={item.birthDay}
          title={item.userName}
          blocked={item.blocked}
          image={item.userImage_file}
          handleDelete={() => handleDelete(item.student_id)} 
          handleBlock={() => handleBlock(item.student_id)}
          handleUnblock={() => handleUnblock(item.student_id)}
        />
      ))}


    </div>
  );
};

export default AllUserComponent;
