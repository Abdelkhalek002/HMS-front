import React, { useState } from 'react'
import "./UploadModal.css"
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo } from '../../RTK/Auth/AuthSlice'
import { toast } from 'react-toastify'
import { updateProfilePicAPI } from '../../RTK/User/UserSlice'

const UploadPhotoModal = ({handleClosePhoto}) => {

    // For Access Token and ID
    const {token , payLoad} = useSelector(getUserInfo) ; 

    // For Dispatch Action 
    const dispatch = useDispatch() ; 

    // For Access Input Photo
    const [photo , setPhoto ] = useState('') ; 

    console.log(photo)

    // For Update Profile Pic
    const updatePhotoHandler = ()=>{
        if(photo !== ''){
            const data = new FormData()
            data.append('userImage_file' , photo)
            handleClosePhoto()
            dispatch(updateProfilePicAPI({token , id : payLoad.userId , data: photo  }))
        }
        else{
            toast.error("من فضلك اختار صورة اولا")
        }
    }


  return (
    <div className='upload-container'>
        <div className='upload-bb'>
            <input  onChange={(e)=>{setPhoto(e.target.files[0])}} type='file' className='upload-in' />
            <span  class="material-symbols-outlined">
                add_photo_alternate
            </span>
            <h5>اضافة صورة </h5>
            <p>او اسحب صورة</p>
        </div>
        <Button onClick={updatePhotoHandler} disabled={!photo ? true : false } fullWidth style={{marginTop : "10px"}} variant='contained'>تحميل </Button>
    </div>
  )
}

export default UploadPhotoModal
