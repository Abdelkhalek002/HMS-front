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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Add, Delete, Edit } from '@mui/icons-material';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import StatusCode from '../../StatusCode.js';
import { Box, Button, Modal, Pagination, PaginationItem, Stack, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { CircleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';
import { createEmergencyReservationAPI, deleteEmergencyReservationAPI, getAllEmergencyReservationListAPI, getTotalPageReservation, updateEmergencyReservationAPI } from '../../RTK/Admins/CounterSlice.js';
import { useSearchParams } from 'react-router-dom';

export default function EmergencyExPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editClinicId, setEditClinicId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const resName = useRef(null);
  const { data: EmergRes, status } = useSelector(state => state.CounterSlice);
  const { token, payLoad } = useSelector(getUserInfo);
  const totalPage = useSelector(getTotalPageReservation);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && payLoad.userId) {
      dispatch(getAllEmergencyReservationListAPI({ token, id: payLoad.userId, page: searchParams.get('page') || 1 }));
    }
  }, [token, payLoad.userId, dispatch, searchParams]);

  const showResultOfPag = (event, value) => {
    setSearchParams({ page: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const args = { resName: resName.current.value };
    dispatch(createEmergencyReservationAPI(args))
      .unwrap()
      .then((msg) => {
        dispatch(getAllEmergencyReservationListAPI({ token, id: payLoad.userId, page: searchParams.get('page') || 1 }));
        toast.success(msg.message, { theme: "colored", position: "top-right" });
        setIsAddModalOpen(false);
      })
      .catch((error) => {
        toast.error("Error: " + error.error, { theme: "colored", position: "top-right" });
      });
  };

  const handleUpdate = () => {
    if (editClinicId && resName.current) {
      const args = { resName: resName.current.value, id: editClinicId };
      dispatch(updateEmergencyReservationAPI(args))
        .unwrap()
        .then((msg) => {
          dispatch(getAllEmergencyReservationListAPI({ token, id: payLoad.userId, page: searchParams.get('page') || 1 }));
          toast.success(msg.message, { theme: "colored", position: "top-right" });
          setIsEditModalOpen(false);
        })
        .catch((error) => {
          toast.error("Error: " + error.error, { theme: "colored", position: "top-right" });
        });
    } else {
      toast.error("No emergency reservation data available for update", { theme: "colored", position: "top-right" });
    }
  };

  if (status === StatusCode.LOADING) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircleLoader color="#0061ff" />
      </Box>
    );
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: { backgroundColor: theme.palette.common.white, color: theme.palette.common.black },
    [`&.${tableCellClasses.body}`]: { fontSize: 16 },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': { backgroundColor: theme.palette.common.white },
    '&:last-child td, &:last-child th': { border: 0 },
  }));

  const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
    borderRadius: 18,
    margin: 'auto',
    maxWidth: 1130,
  }));

  const handleDelete = (id) => {
    swal({
      title: " هل انت متأكد من الحذف؟",
      text: "لما تحذفه مش هتقدر ترجعه تاني",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteEmergencyReservationAPI({ token, id }))
          .unwrap()
          .then((msg) => {
            swal(msg.message, { icon: "success" });
            dispatch(getAllEmergencyReservationListAPI({ token, id: payLoad.userId, page: searchParams.get('page') || 1 }));
          })
          .catch((error) => {
            toast.error("Error: " + error.error, { theme: "colored", position: "top-right" });
          });
      }
    });
  };

  const formatDate = (dateString) => {
    return dateString.slice(0, 10);
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

  return (
    <>
      <Helmet>
        <title>Emergency Reservations</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <div className='k-group-user-page '>
      <h2 className='title'>الكشوفات الطارئة</h2>
      <div className=' k-btn-group '>
      <Tooltip title="اضافة مرحلة جديدة" arrow >
      <IconButton aria-label="add" size='large' color='primary' onClick={() => setIsAddModalOpen(true)} >
       <Add fontSize='large' />  
      </IconButton >
      </Tooltip>
      </div>
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" className="text-center">
            اضافة كشف طاريء جديدة
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="popup-all-filed">
              <div className="row">
                <label style={{ marginRight: "40px" }}>الاسم</label>
                <input
                  autoFocus
                  className="popup-field"
                  type="text"
                  id="resName"
                  ref={resName}
                  style={{ width: "180px", marginRight: "10px", marginTop: "40px", height: "30px", borderRadius: "6px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px" }}>
              <Button variant="contained" className="popup-btn" style={{ borderRadius: "12px" }} onClick={handleSubmit}>
                حفظ
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" className="text-center">
            تعديل بيانات الكشف
          </Typography>
          <form onSubmit={handleUpdate}>
            <div className="popup-all-filed">
              <div className="row">
                <label style={{ marginRight: "40px" }}>الاسم</label>
                <input
                  className="popup-field"
                  type="text"
                  id="clinicName"
                  ref={resName}
                  style={{ width: "180px", marginRight: "10px", marginTop: "40px", height: "30px", borderRadius: "6px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px" }}>
              <Button variant="contained" className="popup-btn" style={{ borderRadius: "12px" }} onClick={handleUpdate}>
                حفظ
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Box sx={{ height: "100vh", width: "100%", margin: "auto", display: "flex", alignItems: "center" }}>
        <div style={{ height: "550px", width: "100%", margin: "auto" }}>
          <TableContainerStyled component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الكشف</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الاسم</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الرقم القومي</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الموعد</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>العيادة</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>المرحلة </StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الكلية</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>المحافظة</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>الجنسية</StyledTableCell>
              <StyledTableCell align="center" style={{fontSize:"18px", fontWeight:"bold"}}>العمليات</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {EmergRes ? (
                  EmergRes.map((row) => (
                    <StyledTableRow key={row.id}>
            <StyledTableCell align="center">{row.state.replace(/['"]+/g, '')}</StyledTableCell>
                <StyledTableCell align="center">{row.Name}</StyledTableCell>
                <StyledTableCell align="center">{row.national_id}</StyledTableCell>
                <StyledTableCell align="center" >{formatDate(row.time)}</StyledTableCell>
                <StyledTableCell align="center">{row.clinic_name}</StyledTableCell>
                <StyledTableCell align="center">{row.level_name}</StyledTableCell>
                <StyledTableCell align="center">{row.faculty_name}</StyledTableCell>
                <StyledTableCell align="center">{row.gov_name}</StyledTableCell>
                <StyledTableCell align="center">{row.Nationlaity}</StyledTableCell>
                      <StyledTableCell align="center">
                        <IconButton onClick={() => {
                          setIsEditModalOpen(true);
                          setEditClinicId(row.id);
                        }}>
                          <Edit style={{ color: "#ff9800" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.id)}>
                          <Delete style={{ color: "#f44336" }} />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={3}>
                      لا يوجد بيانات
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainerStyled>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <Pagination
              count={totalPage}
              page={parseInt(searchParams.get('page')) || 1}
              onChange={showResultOfPag}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
      </Box>
    </div>
    </>
  );
}
