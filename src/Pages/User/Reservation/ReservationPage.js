import React, { useEffect, useState } from 'react'
import "./reservation.css"
import {  Button, MenuItem, Select } from '@mui/material'
import { DatePicker,  LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {  getUserInfo } from '../../../RTK/Auth/AuthSlice';
import { useCreateReservationMutation } from '../../../RTK/Reservation/reservationApi';
import { getUserProfile, getUserProfileAPi } from '../../../RTK/User/UserSlice';
import { getAllClinics, getAllClinicsAPI } from '../../../RTK/Clinic/ClinicSlice';


const ReservationPage = () => {

  // For Dispatch Action
  const dispatch = useDispatch() ; 

  const [createReservation, { isLoading: isCreatingReservation }] = useCreateReservationMutation();
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
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    setDate(`${year}-${formattedMonth}-${formattedDay}`);
  }

  // For Create Reservation
  const createReservationHandler = async () => {
    if (clinic !== '' && clinic !== undefined && clinic !== null) {
      if (typeR !== '') {
        if (date !== '') {
          const payload = {
            clinic_id: Number(clinic),
            date,
            examType: `${typeR}`,
          };
          try {
            await createReservation(payload).unwrap();
            toast.success("تم حجز الكشف بنجاح برجاء إحضار الكارنيه وإذن الكلية");
          } catch (error) {
            const errorMsg =
              error?.data?.error ||
              error?.data?.message ||
              (typeof error?.data === "string" ? error.data : null) ||
              "حدث خطأ أثناء حجز الكشف برجاء اعادة المحاولة";
            toast.error(errorMsg);
          }
        } else {
          toast.error('برجاء اختيار معاد الكشف');
        }
      } else {
        toast.error('برجاء اختيار نوع الكشف');
      }
    } else {
      toast.error("برجاء اختيار العيادة");
    }
  };

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
                    const clinicId = item.clinic_id ?? item.id;
                    return ( <MenuItem key={clinicId} value={clinicId}>{item.clinicName || item.clinic_name}</MenuItem>)
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

          <Button
            onClick={createReservationHandler}
            disabled={isCreatingReservation}
            className='k-btn'
            variant="contained"
          >
            {isCreatingReservation ? "جاري الحجز..." : "حجز"}
          </Button>


        </div>
      </div>
    </section>
  )
}

export default ReservationPage
