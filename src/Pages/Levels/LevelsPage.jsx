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
import { addNewLevelsAPI, deleteLevelsAPI, getAllLevelsAPI, updateLevelsAPI } from '../../RTK/Level/LevelSlice.js';
import StatusCode from '../../StatusCode.js';
import {  Box, Button, Modal, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { CircleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';

export default function LevelsPage() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLevelId, setEditLevelId] = useState(null);


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
    setEditLevelId(id);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const {data:level,status}=useSelector(state => state.LevelSlice)
  const {token } = useSelector(getUserInfo) ;

  const dispatch=useDispatch()

useEffect(()=>{
  dispatch(getAllLevelsAPI())
},[token , dispatch])



const levelName=useRef(null)

const handleSubmit = (e) => {
  e.preventDefault()
  const args = {
    levelName: levelName.current.value
  };
  dispatch(addNewLevelsAPI({data : args , token}))
  .unwrap()
    .then((msg) => {
      dispatch(getAllLevelsAPI());
      toast.success(msg.message,{
        theme:"colored",
        position:"top-right"
       })
      handleCloseAddModal(); 
    })
    .catch(error => {
      if(error.status=== 429)
        toast.error(error.data.message,{
          theme:"colored",
          position:"top-right"
    })
    else if(error.status=== 409)
    toast.error(error.data.message, {
      theme: "colored",
      position: "top-right",
    });
}
);
};

const handleUpdate = () => {
  // Check if the editLevelId is not null
  if (editLevelId && levelName.current) {
    // Find the level object with the given editLevelId
    const args = {
      levelName: levelName.current.value,
      id: editLevelId
    };
    dispatch(updateLevelsAPI({data : args , token}))
    .unwrap()
      .then((msg) => {
        dispatch(getAllLevelsAPI());
        toast.success(msg.message, {
          theme: "colored",
          position: "top-right"
        });
        handleCloseEditModal();
      })
      .catch(error => {
        console.error("Error deleting level:", error.status);
        if(error.status===429)
          toast.error(error.data.message,{
            theme:"colored",
            position:"top-right"
      })
      else if(error.status===409)
      toast.error(error.data.message,{
        theme:"colored",
        position:"top-right"
      })
  }
  );
  } else {
    console.error("No level data available for update");
  }
};






// TODO ADDED LATER
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
        dispatch(deleteLevelsAPI({data : id , token}))
        .unwrap()
          .then((msg) => {
            swal(msg.message, { icon: "success" });
            dispatch(getAllLevelsAPI());
          })
          .catch(error => {
            console.error("Error deleting level:", error);
            if(error.status=== 429)
              toast.error(error.data.message,{
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
      }
    );
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
        <title>Levels</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <Modal 
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
            اضافة مرحلة جديدة
          </Typography>
             <form onSubmit={handleSubmit}>
          <div className='popup-all-filed'>
            <div className='row'>
              <label style={{marginRight:"40px"}}>الاسم</label>
              <input className='popup-field' type="text" id='levelName' ref={levelName} style={{width:"180px", marginRight:"10px", marginTop:"40px", height:"30px", borderRadius:"6px"}}/>
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
             تعديل بيانات المرحلة
          </Typography>
             <form onSubmit={handleUpdate}>
          <div className='popup-all-filed'>
            <div className='row'>
              <label style={{marginRight:"40px"}}>الاسم</label>
              <input className='popup-field' type="text" id='levelName' ref={levelName} style={{width:"180px", marginRight:"10px", marginTop:"40px", height:"30px", borderRadius:"6px"}}/>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:"40px" }}>
          <Button
  variant="contained"
  className='popup-btn'
  style={{borderRadius:"12px"}}
  onClick={(e) => handleUpdate(e)}
>
  حفظ
</Button>
          </div>
          </form>
        </Box>
      </Modal>


    <div className='k-group-user-page '>
      <h2 className='title'>المراحل</h2>
      <div className=' k-btn-group '>
      <Tooltip title="اضافة مرحلة جديدة" arrow >
      <IconButton aria-label="add" size='large' color='primary' onClick={handleOpenAddModal} >
       <Add fontSize='large' />  
      </IconButton >
      </Tooltip>
      </div>
      <TableContainerStyled component={Paper} >
        <Table sx={{ minWidth: 700}} aria-label="customized table" >
          <TableHead  >
            <TableRow>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>المرحلة</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>العمليات</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {level.map((level) => (
              <StyledTableRow  key={level.level_id}>
                <StyledTableCell align="center">{level.levelName}</StyledTableCell>
                <StyledTableCell align="center"className='k-btn-group'>
                  <Tooltip title="تعديل المرحلة" arrow >
                  <IconButton aria-label="edit" size='small' onClick={() => handleOpenEditModal(level.level_id)}>
  <Edit fontSize='inherit'/>
</IconButton>


                  </Tooltip>
                  <Tooltip title="حذف المرحلة" arrow >
                    <IconButton
                      aria-label="delete"
                      color='error'
                      size='small'
                      onClick={() => handleDelete(level.level_id)}
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


