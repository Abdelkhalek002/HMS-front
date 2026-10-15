import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, getUserProfileAPi } from '../../RTK/User/UserSlice'
import { Box, Button, Modal, Skeleton, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { sendObservations } from '../../RTK/UserControl/UserControlSlice.js'
import { toast } from 'react-toastify'
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js'

const UserDetails = () => {

    const { userId } = useParams();
    const dispatch = useDispatch();



    const profileInfo = useSelector(state => state.UserSlice.data) || {};
    const loading = useSelector(state => state.UserSlice.load);


    return <>
        <Helmet>
            <title>User Details</title>
            <meta name="description" content="HSH application" />
        </Helmet>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className=' user-details user-details-them'>
                <h4 className='user-details-title'>تفاصيل الطالب</h4>
                <div className='user-details-item'>
                    <div className='title'>الايميل</div>
                    <div className='user-details-value'>
                        {
                            !loading ?
                                <p>{profileInfo.email}</p> :
                                <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                        }</div>
                </div>
                <div className='user-details-item'>
                    <div className='title'>الموبايل </div>
                    <div className='user-details-value'>
                        {
                            !loading ?
                                <p>{profileInfo.phoneNumber}</p> :
                                <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                        }
                    </div>
                </div>

                <div className='user-details-item'>
                    <div className='title'>النوع</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.gender}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>

                <div className='user-details-item'>
                    <div className='title'>تاريخ الميلاد</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.birthDay}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>

                <div className='user-details-item'>
                    <div className='title'>الرقم القومي</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.national_id}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>

                <div className='user-details-item'>
                    <div className='title'> الفرقة</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.level_name}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>

                <div className='user-details-item'>
                    <div className='title'> الكلية</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.faculty_name}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>

                <div className='user-details-item'>
                    <div className='title'> المحافظة</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.gov_name}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>

                <div className='user-details-item'>
                    <div className='title'> الجنسية</div>
                    <div className='user-details-value'>{
                        !loading ?
                            <p>{profileInfo.nationality_name}</p> :
                            <Skeleton width={200} height={20} style={{ marginBottom: "10px" }} />
                    }</div>
                </div>
            </div>
        </motion.div>
    </>
}

export default UserDetails
