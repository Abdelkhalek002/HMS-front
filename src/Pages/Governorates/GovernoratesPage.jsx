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
import { addNewGovernorateAPI, deleteGovernorateAPI, getAllGovsAPI, updateGovernorateAPI } from '../../RTK/Governorate/GovernorateSlice.js';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';

export default function GovernoratesPage() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGovId, setEditGovId] = useState(null);


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
    setEditGovId(id);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const {data,status}=useSelector(state => state.GovernorateSlice)
  console.log(data)

  const dispatch=useDispatch()

// For Get All Gov
useEffect(()=>{
  dispatch(getAllGovsAPI())
},[dispatch])

console.log(status)

// For Access Token 
const {token } = useSelector(getUserInfo) ; 



const govName=useRef(null)

// For Add Gov
const handleSubmit = (e) => {
  e.preventDefault()
  const args = {
    govName: govName.current.value
  };
  dispatch(addNewGovernorateAPI({data : args , token}))
  .unwrap()
    .then((msg) => {
      console.log(msg);
      dispatch(getAllGovsAPI());
      toast.success(msg.message,{
        theme:"colored",
        position:"top-right",
        })
        handleCloseAddModal(); 
    })
    .catch(error => {
      console.error("Error deleting gov:", error.error);
      if(error.error==="Request failed with status code 429")
        toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا",{
          theme:"colored",
          position:"top-right"
    })
    else
    toast.error("المحافظة موجودة بالفعل", {
      theme: "colored",
      position: "top-right",
    });
}
);
};

const handleUpdate = () => {
  if (editGovId && govName.current) {
    const args = {
      govName: govName.current.value,
      id: editGovId
    };
    console.log("Args:", args);
    dispatch(updateGovernorateAPI({data : args , token}))
    .unwrap()
      .then((msg) => {
        dispatch(getAllGovsAPI());
        toast.success(msg.message, {
          theme: "colored",
          position: "top-right"
        });
        handleCloseEditModal();
      })
      .catch(error => {
        console.error("Error deleting gov:", error.error);
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
        dispatch(deleteGovernorateAPI({data : id , token}))
        .unwrap()
          .then((msg) => {
            console.log(msg);
            swal(msg.message, { icon: "success" });
            dispatch(getAllGovsAPI());
          })
          .catch(error => {
            console.error("Error deleting gov:", error.error);
            if(error.error==="Request failed with status code 429")
              toast.error("تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا",{
                theme:"colored",
                position:"top-right"
          })
          else
          toast.error("حدث خطأ ما  ",{
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
        <title>Governorates</title>
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
            اضافة محافظة جديدة
          </Typography>
             <form onSubmit={handleSubmit}>
          <div className='popup-all-filed'>
            <div className='row'>
              <label style={{marginRight:"40px"}}>الاسم</label>
              <input className='popup-field' type="text" id='govName' ref={govName} style={{width:"180px", marginRight:"10px", marginTop:"40px", height:"30px", borderRadius:"6px"}}/>
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
             تعديل بيانات المحافظة
          </Typography>
             <form onSubmit={handleUpdate}>
          <div className='popup-all-filed'>
            <div className='row'>
              <label style={{marginRight:"40px"}}>الاسم</label>
              <input className='popup-field' type="text" id='levelName' ref={govName} style={{width:"180px", marginRight:"10px", marginTop:"40px", height:"30px", borderRadius:"6px"}}/>
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
      <h2 className='title'>المحافظات</h2>
      <div className=' k-btn-group '>
      <Tooltip title="اضافة محافظة جديدة" arrow >
      <IconButton aria-label="add" size='large' color='primary' onClick={handleOpenAddModal} >
      <Add fontSize='large' />  
      </IconButton >
      </Tooltip>
      </div>
      <TableContainerStyled component={Paper} >
        <Table sx={{ minWidth: 700}} aria-label="customized table" >
          <TableHead  >
            <TableRow>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>المحافظة</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>العمليات</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((gov,idx) => (
              <StyledTableRow  key={idx}>
                <StyledTableCell align="center">{gov.govName}</StyledTableCell>
                <StyledTableCell align="center"className='k-btn-group'>
                  <Tooltip title="تعديل المحافظة" arrow >
                  <IconButton aria-label="edit" size='small' onClick={() => handleOpenEditModal(gov.gov_id)}>
  <Edit fontSize='inherit'/>
</IconButton>
                  </Tooltip>
                  <Tooltip title="حذف محافظة" arrow >
                    <IconButton
                      aria-label="delete"
                      color='error'
                      size='small'
                      onClick={() => handleDelete(gov.gov_id)}
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


