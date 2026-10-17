import React, { useState } from 'react'
import "./UploadModal.css"
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo } from '../../auth';
import { toast } from 'react-toastify';
import { updateProfilePicAPI } from '../../users';

const UploadPhotoModal = ({ handleClosePhoto }) => {

    // For Access Token and ID
    const { token, payLoad } = useSelector(getUserInfo);

    // For Dispatch Action 
    const dispatch = useDispatch();

    // For Access Input Photo
    const [photo, setPhoto] = useState('');

    console.log(photo)

    const updatePhotoHandler = () => {
        if (photo) {
            const data = new FormData();
            data.append('user_profile_photo', photo);
            handleClosePhoto();
            dispatch(updateProfilePicAPI({ token, id: payLoad?.userId, data }))
                .unwrap()
                .catch((err) => {
                    toast.error(err || "فشل تحديث الصورة");
                });
        }
        else {
            toast.error("من فضلك اختار صورة اولا");
        }
    };


    return (
        <div className='upload-container'>
            <div className='upload-bb'>
                <input onChange={(e) => { setPhoto(e.target.files[0]) }} type='file' className='upload-in' />
                <span class="material-symbols-outlined">
                    add_photo_alternate
                </span>
                <h5>اضافة صورة </h5>
                <p>او اسحب صورة</p>
            </div>
            <Button onClick={updatePhotoHandler} disabled={!photo ? true : false} fullWidth style={{ marginTop: "10px" }} variant='contained'>تحميل </Button>
        </div>
    )
}

export default UploadPhotoModal
