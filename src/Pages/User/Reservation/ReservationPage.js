import React, { useEffect, useState } from 'react'
import "./reservation.css"
import {  Button, MenuItem, Select } from '@mui/material'
import { DatePicker,  LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {  getUserInfo } from '../../../RTK/Auth/AuthSlice';
import { createReservationUserAPI } from '../../../RTK/Reservation/ReservationSlice';
import { getUserProfile, getUserProfileAPi } from '../../../RTK/User/UserSlice';
import { getAllClinics, getAllClinicsAPI } from '../../../RTK/Clinic/ClinicSlice';


const ReservationPage = () => {

  // For Dispatch Action
  const dispatch = useDispatch() ; 

  const {token , payLoad} = useSelector(getUserInfo) ;


  // For Access Clinic Data
  const [clinic, setClinic] = React.useState('');

  const handleChangeClinic = (event) => {
    setClinic(event.target.value);
  };




  // For Get User Data
  useEffect(()=>{
      dispatch(getUserProfileAPi({token  , id : payLoad.userId }))
      dispatch(getAllClinicsAPI({token }))
  } , [dispatch , token , payLoad])

  // For Access CLinic
  const clinics = useSelector(getAllClinics) ; 
  console.log(clinics)

  // For Access Resvation Type
  const [typeR, setTypeR] =useState('');

  const handleChangeTypeR = (event) => {
    setTypeR(event.target.value);
  };

  // For Access Date 
  const [date , setDate ] = useState('') ;

  const handleChangeDate = (day , month , year)=>{
    setDate(`${year}-${month.toString.length ===1 ?'0'+month.toString() : month.toString() }-${day.toString().length === 1 ?"0" + day : day  }`)
  }

  // For Create Reservation
  const createReservationHandler = ()=>{
    if(clinic !== ''){
      if(typeR !== '') {
        if(date !=='') {
          const data = new FormData() ; 
          data.append('clinic_id' , `${clinic}`) 
          data.append('date' , date) 
          data.append('examType' , `${typeR}`) 
          dispatch(createReservationUserAPI({token , id : payLoad.userId , data}))
        }else{
          toast.error('برجاء اختيار معاد الكشف')
        }
      }else{
        toast.error('برجاء اختيار نوع الكشف')
      }
    }else{
      toast.error("برجاء اختيار العيادة")
    }
  }

  console.log(date)

  return (
    <section className='k-reservation-page' >

      <div className='reservation-container'>
        <h2 className='title'>حجز الكشف </h2>
        <div className='input-cont'>

          <div className='row'>
            <label className='row-title'>العيادة </label>
              <Select
                style={{width : "300px" , maxWidth : "100%"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={clinic}
                onChange={handleChangeClinic}
              >
                {
                  clinics? 
                  clinics.map((item)=>{
                    return ( <MenuItem key={item.clinic_id} value={item.clinic_id}>{item.clinicName}</MenuItem>)
                  }) : ""
                }

              </Select>
          </div>

          <div className='row'>
            <label className='row-title'>نوع الكشف </label>
              <Select
                style={{width : "300px" , maxWidth : "100%"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={typeR}
                onChange={handleChangeTypeR}
              >
                <MenuItem value={'كشف جديد'}>كشف جديد</MenuItem>
                <MenuItem value={`متابعة`}> متابعة</MenuItem>
                <MenuItem value={"طوارئ"}>طوارئ</MenuItem>
              </Select>
          </div>

          <div className='row'>
            <div className='row-title'>تاريخ الكشف</div>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
            <DemoContainer

              components={[
                'DatePicker',
                'TimePicker',
                'DateTimePicker',
                'DateRangePicker',
              ]}
            >

                <DatePicker onChange={(e)=>{handleChangeDate(e.$D , e.$M + 1 , e.$y); console.log(e)}  }  />


            </DemoContainer>
          </LocalizationProvider>
          </div>

          <Button onClick={createReservationHandler} className='k-btn' variant="contained">حجز</Button>


        </div>
      </div>
    </section>
  )
}

export default ReservationPage
