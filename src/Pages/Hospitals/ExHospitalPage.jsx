import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Add, Delete, Edit } from '@mui/icons-material';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import {  } from '../../RTK/Level/LevelSlice.js';
import StatusCode from '../../StatusCode.js';
import {  Box, Button, Modal, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { CircleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { addNewExhospitalAPI, deleteExhospitalAPI, getAllExhospitalsAPI, updateExhospitalAPI } from '../../RTK/ExHospital/ExHospitalSlice.js';
import Logo from '../../images/Hospital building-rafiki.png';
import op from '../../images/operations.jpg';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';

export default function ExHospitalPage() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFacultyId, setEditFacultyId] = useState(null);


  // Add modal handlers
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Edit modal handlers
  const handleOpenEditModal = (id) => {
    setIsEditModalOpen(true);
    setEditFacultyId(id);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const {data,status}=useSelector(state => state.ExHospitalSlice)
 console.log(data)

  // For Dispatch Aciton
  const dispatch=useDispatch()

  // For Access Token 
  const  {token } = useSelector(getUserInfo) ;

useEffect(()=>{
  dispatch(getAllExhospitalsAPI({token}))
},[dispatch , token])

console.log(status)


const hospName=useRef(null)

// For Add Hostpital
const handleSubmit = (e) => {
  e.preventDefault()
  const args = {
    hospName: hospName.current.value
  };
  dispatch(addNewExhospitalAPI({data : args , token}))
  .unwrap()
    .then((msg) => {
      console.log(msg);
      dispatch(getAllExhospitalsAPI({token}));
      toast.success(msg.message,{
        theme:"colored",
        position:"top-right",
       })
       handleCloseAddModal(); 
    })
    .catch(error => {
      console.error("Error deleting hospital:", error);
      if(error.error==="Request failed with status code 429")
        toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا",{
          theme:"colored",
          position:"top-right"
    })
    else if(error.error==="Request failed with status code 409")
      toast.error(" المستشفي موجودة بالفعل  ",{
        theme:"colored",
        position:"top-right"
      })
}
);
};

// For Update Hospital
const handleUpdate = () => {
  if (editFacultyId && hospName.current) {
    const args = {
      hospName: hospName.current.value,
      id: editFacultyId
    };
    console.log("Args:", args);
    dispatch(updateExhospitalAPI({data : args , token}))
    .unwrap()
      .then((msg) => {
        dispatch(getAllExhospitalsAPI({token}));
        toast.success(msg.message, {
          theme: "colored",
          position: "top-right"
        });
        handleCloseEditModal();
      })
      .catch(error => {
        console.error("Error deleting hospital:", error.error);
        if(error.error==="Request failed with status code 429")
          toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا",{
            theme:"colored",
            position:"top-right"
      })
      else if(error.error==="Request failed with status code 409")
        toast.error(" المحافظة موجودة بالفعل  ",{
          theme:"colored",
          position:"top-right"
        })
  }
  );
  } else {
    console.error("No hospital data available for update");
  }
};

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
    maxWidth: 650, 
  }));

  const handleDelete = (id) => {
    swal({
      title: " هل انت متأكد من الحذف؟",
      text: "لما تحذفه مش هتقدر ترجعه تاني",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(() => {
        dispatch(deleteExhospitalAPI({data : id , token}))
        .unwrap()
          .then((msg) => {
            console.log(msg);
            swal(msg.message, { icon: "success" });
            dispatch(getAllExhospitalsAPI({token}));
          })
          .catch(error => {
            console.error("Error deleting hospital:", error.error);
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
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 230,
    bgcolor: 'white',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };

  return <>
      <Helmet>
        <title>ExHospitals</title>
        <meta name="description" content="HSH application" />
      </Helmet>
      <Modal 
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
            اضافة مستشفي جديدة
          </Typography>
             <form onSubmit={handleSubmit}>
          <div className='popup-all-filed'>
            <div className='row'>
              <label style={{marginRight:"40px"}}>الاسم</label>
              <input className='popup-field' type="text" id='hospName' ref={hospName} style={{width:"180px", marginRight:"10px", marginTop:"40px", height:"30px", borderRadius:"6px"}}/>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:"40px" }}>
            <Button variant="contained" className='popup-btn' style={{borderRadius:"12px"}} onClick={handleSubmit} >حفظ</Button>
          </div>
          </form>
        </Box>
      </Modal>

      <Modal 
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
             تعديل بيانات مستشفي
          </Typography>
             <form onSubmit={handleUpdate}>
          <div className='popup-all-filed'>
            <div className='row'>
              <label style={{marginRight:"40px"}}>الاسم</label>
              <input className='popup-field' type="text" id='levelName' ref={hospName} style={{width:"180px", marginRight:"10px", marginTop:"40px", height:"30px", borderRadius:"6px"}}/>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:"40px" }}>
          <Button
  variant="contained"
  className='popup-btn'
  style={{borderRadius:"12px"}}
  onClick={() => handleUpdate()}
>
  حفظ
</Button>
          </div>
          </form>
        </Box>
      </Modal>


    <div className='k-group-user-page '>
      <h2 className='title'>المستشفيات</h2>
      
      <div className=' k-btn-group '>
      <Tooltip title="اضافة مستشفي جديدة" arrow >
      <IconButton aria-label="add" size='large' color='primary' onClick={handleOpenAddModal} >
      <Add fontSize='large' />  
      </IconButton >
      </Tooltip>
      </div>
      <TableContainerStyled component={Paper} >
        <Table sx={{ minWidth: 700}} aria-label="customized table" >
          <TableHead  >
            <TableRow>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>
              <Tooltip title="المستشفيات" arrow  >
                    <img src={Logo} alt='logo' loading='lazy' className='logo-img' style={{ width:"100px",height:"100px" }} />
              </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>
              <Tooltip title="الاضافة والحذف" arrow  >
                    <img src={op} alt='logo' loading='lazy' className='logo-img' style={{ width:"100px",height:"100px" }} />
              </Tooltip>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((hospital) => (
              <StyledTableRow  key={hospital.exHosp_id}>
                <StyledTableCell align="center">{hospital.hospName}</StyledTableCell>
                <StyledTableCell align="center"className='k-btn-group'>
                  <Tooltip title="تعديل المستشفي" arrow >
                  <IconButton aria-label="edit" size='small' onClick={() => handleOpenEditModal(hospital.exHosp_id)}>
  <Edit fontSize='inherit'/>
</IconButton>
                  </Tooltip>
                  <Tooltip title="حذف مستشفي" arrow >
                    <IconButton
                      aria-label="delete"
                      color='error'
                      size='small'
                      onClick={() => handleDelete(hospital.exHosp_id)}
                    >
                      <Delete fontSize='inherit'/>
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainerStyled>
    </div>
    </>
}


