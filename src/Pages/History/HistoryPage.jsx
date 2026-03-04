import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import {  Delete } from '@mui/icons-material';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import {  } from '../../RTK/Level/LevelSlice.js';
import StatusCode from '../../StatusCode.js';
import {  Box , Pagination, PaginationItem, Stack, Tooltip } from '@mui/material';
import { Helmet } from 'react-helmet';
import { CircleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteHistoryAPI, getAllHistoryAPI } from '../../RTK/History/HistorySlice.js';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';
import { useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


export default function HistoryPage() {

  const {data,status}=useSelector(state => state.HistorySlice)

//  For Dispatch Action
  const dispatch=useDispatch(); 

// For Access Token 
const {token } = useSelector(getUserInfo) ; 


// For Change Params in URL
const [searchParams , setSearchParams] = useSearchParams({page : 1}) ; 


// For Get All History
useEffect(()=>{
  dispatch(getAllHistoryAPI({token , page : searchParams.get('page' ) ?searchParams.get('page' ) : 1 }))
},[dispatch , token , searchParams])




  // For Handle Pagaintion
  const showResultOfPag = (npage)=>{
    // dispatch(getAllReservationListAPI({token , page :npage ? npage: 1})) ; 
    setSearchParams({page : npage })
  }



// if(status===StatusCode.ERROR){
//   return<>
//   <Box
//     sx={{
//       height: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}
//   >
//     <Typography variant="h4" component="h4" className='text-center'>
//       حدث خطأ ما
//     </Typography>
//   </Box>
// </>
// }

if(status===StatusCode.LOADING){
  return<>
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
      </>
}


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.common.white,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
    borderRadius: 18,
    margin: 'auto',
    maxWidth: 1020, 
  }));

  const handleDelete = () => {
    swal({
      title: " هل انت متأكد من الحذف؟",
      text: "لما تحذفه مش هتقدر ترجعه تاني",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(() => {
        dispatch(deleteHistoryAPI({token}))
        .unwrap()
          .then((msg) => {
            console.log(msg);
            swal(msg.message, { icon: "success" });
            dispatch(getAllHistoryAPI({token}));
          })
          .catch(error => {
            console.error("Error deleting faculty:", error.error);
            if(error.error==="Request failed with status code 429")
              toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا",{
                theme:"colored",
                position:"top-right"
          })
          else
          toast.error("حدث خطأ ما برجاء ",{
            theme:"colored",
            position:"top-right"
          })
      }
      );
    });
  };
  

  return <>
      <Helmet>
        <title>History</title>
        <meta name="description" content="HSH application" />
      </Helmet>



    <div className='k-group-user-page '>
      <h2 className='title'>السجل</h2>
      <div className='k-btn-group'>
                  <Tooltip title="حذف السجل" arrow >
                    <IconButton
                      aria-label="delete"
                      color='error'
                      size='small'
                      onClick={() => handleDelete()}
                    >
                      <Delete fontSize='inherit'/>
                    </IconButton>
                  </Tooltip>
                </div>
      <TableContainerStyled component={Paper} >
        <Table sx={{ minWidth:200}} aria-label="customized table" >
          <TableHead  >
            <TableRow>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>السجل</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الزمن</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>العملية</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>محتوي العملية</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.adminLogs? data.adminLogs.map((history) => (
              <StyledTableRow  key={history.history_id}>
                <StyledTableCell align="center">{history.admin_name}</StyledTableCell>
                <StyledTableCell align="center">{history.timestamp}</StyledTableCell>
                <StyledTableCell align="center">{history.method}</StyledTableCell>
                <StyledTableCell align="center">{history.body}</StyledTableCell>
              </StyledTableRow>
            )):""}
          </TableBody>
        </Table>
      </TableContainerStyled>
      <div style={{display : "flex" , justifyContent :"center" , marginTop : "30px" }}>
          <Stack spacing={2} >
          <Pagination
            color="primary"
            count={data.totalPages}
            onClick={(e)=> showResultOfPag(e.target.innerText)}
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
    </>
}


