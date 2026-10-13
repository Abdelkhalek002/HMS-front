import React, { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, PaginationItem, Skeleton, Stack } from '@mui/material';
import StatusCode from '../../StatusCode';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { deleteReservationAPI, getTotalHistoryPage, getUserReservationAPI } from '../../RTK/User/UserSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSearchParams } from 'react-router-dom';
import { getAllReservationListAPI } from '../../RTK/Admins/CounterSlice';



const UserHistroy = () => {

    // For Change Param 
    const [searchParams , setSearchParams] = useSearchParams({page : 1}) ; 

    // For Access Total History Page 
    const historyPages = useSelector(getTotalHistoryPage) ; 

    // For Access History Of User 
    const {statusReservation , reservationData} = useSelector(state => state.UserSlice) ; 

    // For Access Token and ID 
    const {token , payLoad} = useSelector(getUserInfo) ; 

    // For Dispatch Action
    const dispatch = useDispatch() ; 

    // For Handle Pagaintion
    const showResultOfPage = (npage)=>{
        setSearchParams({page : npage})
        dispatch(getUserReservationAPI({token , page : npage ? npage : 1} ))
    }

    // For handle Delete Reservation
    const deleteReservationHandler = (medxId)=>{
        console.log(medxId)
        dispatch(deleteReservationAPI({token , userId : payLoad.userId , medxId}   ))
    }




  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className='user-history user-details-them'>

        <h3 className='history-title'>تاريخ كشف الطالب</h3>

            {
                statusReservation === StatusCode.LOADING ? 
                (
                <Stack spacing={2}>
                    <Skeleton variant="rounded" style={{maxWidth : "100%" , width : "100%"}}   height={47} />
                    <Skeleton variant="rounded" style={{maxWidth : "100%" , width : "100%"}} height={47} />
                    <Skeleton variant="rounded" style={{maxWidth : "100%" , width : "100%"}} height={47} />
                    <Skeleton variant="rounded" style={{maxWidth : "100%" , width : "100%"}} height={47} />
                    <Skeleton variant="rounded" style={{maxWidth : "100%" , width : "100%"}} height={47} />
                </Stack>
                ) : ""
            }


            {
                statusReservation === StatusCode.SUCCESS ? (
                    <TableContainer  component={Paper}>
                    <Table  sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell style= {{fontWeight : "bold" , fontSize : "15px"}}>اسم العيادة</TableCell>
                            <TableCell style= {{fontWeight : "bold" , fontSize : "15px"}} align="center">تاريخ الحجز</TableCell>
                            <TableCell style= {{fontWeight : "bold" , fontSize : "15px"}} align="center">نوع الكشف</TableCell>
                            <TableCell style= {{fontWeight : "bold" , fontSize : "15px"}} align="center">حالة الطلب</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {reservationData.length !==0 && statusReservation === StatusCode.SUCCESS ? reservationData.map((row) => (
                            <TableRow
                            key={row.clinic_id  }
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.clinic_name}
                            </TableCell>
                            <TableCell align="center">{row.date.length === 9 ?   row.date.slice(0 , 9) :row.date.slice(0 , 8)}</TableCell>
                            <TableCell align="center">{row.examType}</TableCell>
                            <TableCell align="center">{row.status === 'تحت الانتظار' ? <DeleteIcon onClick={()=>deleteReservationHandler(row.medicEx_id)} style={{cursor : "pointer"}} color='error' /> : <div className='success-reserve'>تم الكشف</div>  }</TableCell>
                            </TableRow>
                        )) 
                        :reservationData.length ===0 && statusReservation === StatusCode.SUCCESS? (<TableRow> <TableCell colSpan={4} align="center"><h2>لاتوجود كشوفات</h2></TableCell></TableRow>) 
                        : statusReservation === StatusCode.LOADING ? 
                        <TableRow> <TableCell colSpan={4} align="center"><Skeleton variant="rounded" width={210} height={40} /></TableCell></TableRow>
                        :""
                    }
                        </TableBody>
                    </Table>
                </TableContainer>
                ) : ""
            }

            <div style={{display : "flex" , justifyContent :"center" , marginTop : "30px" }}>
          <Stack spacing={2} >
          <Pagination
            color="primary"
            count={historyPages}
            onClick={(e)=> showResultOfPage(e.target.innerText)}
            renderItem={(item) => { console.log(item)
              if(item.page == searchParams.get('page') && item.type !== 'next')
                item.selected = true
              else
              item.selected = false 
               return(
              <PaginationItem
              color='primary'
                selected={searchParams.get('page') == item.page ? true : false}
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                

                {...item }
                
              />
            )}
}
          />
        </Stack>
        </div>
        </div>
    </motion.div>
  )
}

export default UserHistroy
