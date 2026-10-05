// In AllAdminComponent.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import StatusCode from '../../StatusCode.js';
import { CircleLoader } from 'react-spinners';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import AdminComponent from './AdminComponent.js';
import { deleteAdminApi, getAllAdminsApi } from '../../RTK/Admins/AdminSlice.js';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const AllAdminComponent = () => {
  const { token, payLoad } = useSelector(getUserInfo) || {};
  const { status, data: allUserData } = useSelector(state => state.AdminSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getAllAdminsApi({ token, id: payLoad?.userId }));
    }
  }, [token, payLoad?.userId, dispatch]);

  // For Delete Admin
  const handleDelete = (id) => {
    if (!id) {
      toast.error("تعذر تحديد معرف المسؤول للحذف");
      return;
    }

    swal({
      title: " هل انت متأكد من الحذف؟",
      text: "لما تحذفه مش هتقدر ترجعه تاني",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((confirmDelete) => {
        if (confirmDelete) {
          dispatch(deleteAdminApi({ id, token }))
            .unwrap()
            .then((msg) => {
              console.log(msg);
              swal(msg.message || "تم الحذف بنجاح", { icon: "success" });
              dispatch(getAllAdminsApi({ token }));
            })
            .catch(error => {
              console.error("Error deleting user:", error);
              if (error?.status === 429)
                toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا", {
                  theme: "colored",
                  position: "top-right"
                });
              else
                toast.error(error?.data?.message || "حدث خطأ ما برجاء المحاولة لاحقاً", {
                  theme: "colored",
                  position: "top-right"
                });
            });
        }
      });
  };

  // For Loading
  if (status === StatusCode.LOADING) {
    return (
      <div className="users-loading-box">
        <CircleLoader color="#0061ff" />
      </div>
    );
  }

  // For Empty State
  if (!allUserData || allUserData.length === 0) {
    return (
      <div className="empty-users-box">
        <PeopleOutlineIcon className="empty-users-icon" />
        <h3 className="empty-users-title">لا يوجد مسؤولين حالياً</h3>
        <p className="empty-users-desc">لم يتم تسجيل أي حسابات مسؤولين في النظام حتى الآن</p>
      </div>
    );
  }

  return (
    <div className='all-users'>
      {allUserData.map((item, idx) => {
        const adminId = item.id;
        const isActive = item.is_active !== undefined ? item.is_active : item.status;
        const isConfirmed = item.is_confirmed !== undefined ? item.is_confirmed : null;
        const createdAt = item.created_at || item.createdAt || item.date || item.birthDay;

        return (
          <AdminComponent
            key={adminId || idx}
            id={adminId}
            title={item.username || item.userName || item.name}
            email={item.email}
            role={item.role}
            isActive={isActive}
            isConfirmed={isConfirmed}
            date={createdAt}
            blocked={item.blocked}
            image={item.profile_photo_url || item.profile_photo}
            handleDelete={() => handleDelete(adminId)}
          />
        );
      })}
    </div>
  );
};

export default AllAdminComponent;
