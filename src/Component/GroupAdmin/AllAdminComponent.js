// In AllUserComponent.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { blockUserApi, deleteUserApi, getAllUserApi, unblockUserApi } from '../../RTK/UserControl/UserControlSlice.js';
import StatusCode from '../../StatusCode.js';
import { Box } from '@mui/material';
import { CircleLoader } from 'react-spinners';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import AdminComponent from './AdminComponent.js';
import { deleteAdminApi, getAllAdminsApi } from '../../RTK/Admins/AdminSlice.js';

const AllAdminComponent = () => {
  const { token, payLoad } = useSelector(getUserInfo);
  const { status, data: allUserData } = useSelector(state => state.AdminSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && payLoad.userId) {
      dispatch(getAllAdminsApi({ token, id: payLoad.userId }));
    }
  }, [token, payLoad.userId, dispatch]);


//   For Delete Admin
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
            dispatch(deleteAdminApi(id))
            .unwrap()
            .then((msg) => {
                console.log(msg);
                swal(msg.message, { icon: "success" });
                dispatch(getAllAdminsApi());
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
        <AdminComponent
          key={idx}
          email={item.email}
          status={item.status}
          id={item.student_id}
          date={item.birthDay}
          title={item.userName}
          blocked={item.blocked}
          handleDelete={() => handleDelete(item.user_id)} 

        />
      ))}
    </div>
  );
};

export default AllAdminComponent;
