import React, { useEffect, useRef, useState } from 'react'
import "./editePro.css"
import userPic from "./../../images/userProfile.jpg";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import EditePopup from './EditePopup';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { getUserProfile, getUserProfileAPi, updateProfileAPI } from '../../RTK/User/UserSlice';
import { Backdrop, Button, Fade, Skeleton, Typography } from '@mui/material';
import { getAllLevels, getAllLevelsAPI } from '../../RTK/Level/LevelSlice';
import UploadPhotoModal from './UploadPhotoModal';
import { toast } from 'react-toastify';
import { getAllGovernorates, getAllGovsAPI } from '../../RTK/Governorate/GovernorateSlice';
import { motion } from 'framer-motion';
import StatusCode from '../../StatusCode.js';
import { CircleLoader } from 'react-spinners';



const EditeProfile = () => {

  // For Dispatch Action
  const dispatch = useDispatch();

  // For Get Token and ID 
  const { token, payLoad } = useSelector(getUserInfo);

  // For Get UserInfo 
  useEffect(() => {
    dispatch(getAllLevelsAPI({ token }))
    dispatch(getUserProfileAPi({ id: payLoad.userId, token }));
    dispatch(getAllGovsAPI({ token }))

  }, [dispatch, token, payLoad.userId])

  // For Access User Profile
  const profileData = useSelector(getUserProfile);


  // For Access Inputs 
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState('');
  const [gov_id, setGov] = useState(0);
  const [level_id, setLevel] = useState(0);

  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const naitonalIdRef = useRef(null)
  const govRef = useRef(null)
  const levelRef = useRef(null)

  // For Handle Loadding
  const loading = useSelector(state => state.UserSlice.load);

  // For Get All Level and Government
  const levels = useSelector(getAllLevels);
  const govs = useSelector(getAllGovernorates);
  console.log(govs);

  // For Access User Info 
  const profileInfo = useSelector(getUserProfile)


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    height: 440,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: "7px"
  };

  const stylePhotoModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 520,
    maxWidth: "100%",
    border: "3px solid #EEE",
    height: 320,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    Padding: 9

  };

  // For Handle Update User  
  const updateUserHandler = (e) => {
    e.preventDefault();
    if (!name || !phone || !nationalId || gov_id === 0 || gov_id === 0) {
      toast.error("برجاء ادخال جميع البيانات");
    } else {
      const args = {
        id: payLoad.userId,
        token,
        data: {
          userName: name,
          phoneNumber: phone,
          national_id: nationalId,
          gov_id,
          level_id
        }
      };
      dispatch(updateProfileAPI(args))
        .unwrap()
      dispatch(getUserProfileAPi({ id: payLoad.userId, token }))
        .then((msg) => {
          toast.success(msg.message);
          setOpen(false)
        })
        .catch((error) => {
          toast.error(error)
        });
    }
  };

  // For Handle Edit Modal 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setName(profileData.userName ? profileData.userName : "");
    setNationalId(profileData.national_id ? profileData.national_id : "")
    setPhone(profileData.phoneNumber)
    setGov(profileData.gov_id)
    setLevel(profileData.level_id)
  }
  const handleClose = () => setOpen(false);

  // For Handle Upload Photo Modal
  const [uploadPhoto, setUploadPhoto] = React.useState(false);
  const handleUpdatePhoto = () => setUploadPhoto(true);
  const handleClosePhoto = () => setUploadPhoto(false);


  // if (loading === true) {
  //   return <>
  //     <Box
  //       sx={{
  //         height: '100vh',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       <CircleLoader color="#0061ff" />
  //     </Box>
  //   </>
  // }

  
  return (
    <section className='k-edite-profile-page'>

      <Modal
        keepMounted
        open={uploadPhoto}
        onClose={handleClosePhoto}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={stylePhotoModal} >
          <UploadPhotoModal handleClosePhoto={handleClosePhoto} />

        </Box>
      </Modal>

      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >


        <Box sx={style}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='k-main-over'
          >
            {/* <div className='image-over'>
              <img src='' alt='' loading='lazy'/>
            </div> */}

            <h3 className='over-title'>تعديل البيانات</h3>
            <p className='over-des'>برجاء التاكد من البيانات قبل الحفظ</p>

            <form onSubmit={updateUserHandler}>



              <div className='collection'>
                <div className='row'>
                  <label htmlFor='name'>الاسم</label>
                  <input value={name} ref={nameRef} onChange={(e) => { setName(e.target.value) }} className='over-input' id='name' placeholder='برجاء ادخال الاسم' />
                </div>

                <div className='row'>
                  <label htmlFor='phone'>الموبيل</label>
                  <input value={phone} ref={phoneRef} onChange={(e) => setPhone(e.target.value)} className='over-input' id='phone' placeholder='برجاء ادخال الموبيل' />
                </div>
              </div>




              <div className='collection'>

                <div className='row'>
                  <label htmlFor='gov'>المحافظة</label>
                  <select value={gov_id} ref={govRef} onChange={(e) => setGov(e.target.value)} className='over-input' id='gove'>
                    <option selected value={0} ><p style={{ color: "green" }}>اختار المحافظة </p></option>
                    {
                      govs ?
                        govs.map((item) => {
                          return <option key={item.gov_id} value={item.gov_id} >{item.govName} </option>
                        }) : ""
                    }
                  </select>
                </div>

                <div className='row'>
                  <label htmlFor='level'>المستوي</label>
                  <select value={level_id} ref={levelRef} onChange={(e) => setLevel(e.target.value)} className='over-input' id='level'>
                    <option value={0} selected ><p style={{ color: "green" }}>اختار المستوي </p></option>

                    {
                      levels ?
                        levels.map((item) => {
                          return <option key={item.level_id} value={item.level_id} >{item.levelName} </option>
                        }) : ""
                    }
                  </select>
                </div>

              </div>

              <div className='row last-row'>
                <label htmlFor='name'>الرقم القومي</label>
                <input value={nationalId ? nationalId : ""} ref={naitonalIdRef} onChange={(e) => setNationalId(e.target.value)} className='over-input' placeholder='برجاء ادخال الرقم القومي' />
              </div>

              <div className='over-btn'>
                <Button type="submit" variant="contained" onClick={(e) => updateUserHandler(e)}>تعديل</Button>
              </div>
            </form>
          </motion.div>
        </Box>
      </Modal>

      <h2 className='edite-profile-heading'>تعديل الملف الشخصي</h2>


      <div className='edite-container'>

        <div className='image-profile'>
          <div className='image'>
            <img src={`http://localhost:7000/api/v1/uploads/${profileInfo.userImage_file}`} alt='ll' />
          </div>
          <div className='edite-image-info'>
            <button onClick={handleUpdatePhoto} className='updload-image-btn'>
              تحميل صورة جديدة
            </button>
            <p className='image-size'>... At least 800 * 800 px reccommended</p>
          </div>
        </div>

        <div className='edite-personal'>
          <div className='personal-card'>
            <div className='peronsal-heading'>
              <h3>المعلومات الشخصية </h3>
              <button onClick={handleOpen}> تعديل <span className="material-symbols-outlined">
                edit
              </span></button>


            </div>
            <div className='peronsal-data'>

              <div className='data-card'>
                <h4>الاسم</h4>
                {
                  !loading ?
                    <p>{profileInfo.userName}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>

              <div className='data-card'>
                <h4>الايميل</h4>
                {
                  !loading ?
                    <p>{profileInfo.email}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>

              <div className='data-card'>
                <h4>الموبيل</h4>
                {
                  !loading ?
                    <p>{profileInfo.phoneNumber}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>
              <div className='data-card'>
                <h4>الرقم القومي</h4>
                {
                  !loading ?
                    <p>{profileInfo.national_id}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>

              <div className='data-card'>
                <h4> المحافظة</h4>
                {
                  !loading ?
                    <p>{profileInfo.gov_name}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>

              <div className='data-card'>
                <h4> الكلية</h4>
                {
                  !loading ?
                    <p>{profileInfo.faculty_name}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>

              <div className='data-card'>
                <h4> المستوي</h4>
                {
                  !loading ?
                    <p>{profileInfo.level_name}</p> :
                    <Skeleton width={60} height={20} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditeProfile
