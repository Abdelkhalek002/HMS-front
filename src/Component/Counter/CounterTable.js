import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { CSVLink } from 'react-csv';
import excelPic from "./../../images/excel.png";
import { Tooltip } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { acceptOrDeclineAPI, getAllReservationListAPI, getReservationData } from '../../RTK/Admins/CounterSlice';
import StatusCode from '../../StatusCode';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { useState } from 'react';
import printPic from "./../../images/printer-print-svgrepo-com.svg";
import { BASE_URL } from '../../API_Route/GlobalRoute';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'اسم الطالب',
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'الرقم القومي',
  },
  {
    id: 'fat',
    numeric: false,
    disablePadding: false,
    label: 'العيادة',
  },

  {
    id: 'carbs',
    numeric: false,
    disablePadding: false,
    label: 'تاريخ الحجز',
  },
  {
    id: 'fat',
    numeric: false,
    disablePadding: false,
    label: ' نوع الكشف',
  },
  {
    id: 'fat',
    numeric: false,
    disablePadding: false,
    label: 'حالة الكشف',
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'إجراءات',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  console.log(`The Props `)
  console.log(props);
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };



  return (
    <TableHead>
      <TableRow style={{ borderBottom: "none" }} >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'desc'}
              onClick={createSortHandler(headCell.id)}
            >
              <h3>{headCell.label}</h3>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'asc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;


  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >

      {/* Note Here For Access Length Selected Item */}
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        ""
      )}


    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  //   For Handle Excel Print 
  const [excel, setExcel] = React.useState([]);

  // For Access Reservation Data 
  const { data, status } = useSelector(getReservationData);

  const handleSelectAllClick = (event) => {
    if (event.target.checked && data) {
      const newSelected = data.map((n) => n.id ?? n.medicEx_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };


  console.log(data);


  const handleClick = (event, id, rowIt) => {
    console.log(`the ID Selectd ${id}`)

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      console.log("Entered 1")
      setExcel(excel.concat(rowIt))
    } else if (selectedIndex === 0) {
      console.log("Entered 2")
      console.log("Entered 3")
      setExcel(excel.filter((item) => {
        return item.id !== (+id);
      }))
      newSelected = newSelected.concat(selected.slice(1));

    } else if (selectedIndex === selected.length - 1) {
      console.log("Entered 3")
      setExcel(excel.filter((item) => {
        return item.id !== (+id);
      }))
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      console.log("Entered 4")
      console.log("Entered 3")
      setExcel(excel.filter((item) => {
        return item.id !== (+id);
      }))

      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;





  console.log(status)

  // For Dispatch Action
  const dispatch = useDispatch();


  // For Token 
  const { token } = useSelector(getUserInfo);

  // For Access Params
  const [searchParams, setSearchParams] = useSearchParams();

  //  For Accept and Decline 
  const acceptOrDecline = (reservationId, userId, isAccepted) => {
    const status = Boolean(isAccepted);
    dispatch(
      acceptOrDeclineAPI({
        id: reservationId,
        medxId: reservationId,
        status,
        page: searchParams.get('page') ? searchParams.get('page') : 1,
        search: searchParams.get('search') ? searchParams.get('search') : "",
      })
    )
      .unwrap()
      .then(() => {
        toast.success(status ? "تم قبول الكشف بنجاح" : "تم رفض الكشف بنجاح");
      })
      .catch((error) => {
        const errorMsg =
          error?.error ||
          error?.message ||
          (typeof error === 'string' ? error : null) ||
          "حدث خطأ أثناء تعديل حالة الكشف";
        toast.error(errorMsg);
      });
  };

  // For Search 
  const searchHandler = () => {
    searchParams.append('search', searchInput)
    setSearchParams({ ...searchParams, search: searchInput, page: 1 })
    dispatch(getAllReservationListAPI({ token, page: 1, limit: 8, search: searchInput ? searchInput : "" }))
  }

  // For Search Active 
  const [active, setActive] = useState(false);



  // For Access Input 
  const [searchInput, setSearchInput] = useState('');



  return (
    <div  >
      <button onClick={() => window.print()}>Print</button>
      <Box sx={{ width: '1250px', maxWidth: "100%", margin: "20px auto", borderRadius: "20px" }}>
        <div className='k-filter-table'>
          <div onBlur={() => setActive(false)} onFocus={() => setActive(true)} className={`search ${active ? 'search-active' : ""}`}>

            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='ابحث...' />

            <span onClick={searchHandler} className="material-symbols-outlined">
              search
            </span>
          </div>
          <img src={printPic} className='print-btn' alt='print' loading='lazy' onClick={() => window.print()} />

          <CSVLink filename='studentInfo' className='excel-btn' data={excel}> <img src={excelPic} alt='excel' /> </CSVLink>
        </div>
        <Paper style={{ borderRadius: "10px" }} sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data?.length || 0}
              />
              <TableBody>
                {status === StatusCode.SUCCESS && data.length !== 0 ? data.map((row, index) => {
                  const rowId = row.id ?? row.medicEx_id;
                  const isItemSelected = isSelected(rowId);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const studentId = row.student?.id ?? row.student_id;
                  const studentName = row.student?.name ?? row.student_name ?? "";
                  const studentImg = row.student?.userImage || (row.student_image ? `${BASE_URL}/uploads/${row.student_image.replace(/^\/+/, '')}` : "");
                  const nationalId = row.student?.nationalId ?? row.national_id ?? "";
                  const clinicName = row.clinic?.name ?? row.clinic_name ?? "";
                  const displayDate = row.date ? (typeof row.date === "string" && row.date.includes(",") ? row.date.split(",")[0] : String(row.date).slice(0, 10)) : "";
                  const examType = row.examType ?? row.exam_type ?? "";
                  const statusText = row.status ?? "";

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={rowId ?? index}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}

                    >

                      <TableCell onClick={(event) => { handleClick(event, rowId, row) }} padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align='center'
                      >
                        <Link to={`profile/${studentId}`} style={{ color: "black", display: "flex", alignItems: "center" }}>
                          {studentImg ? (
                            <img className='imgage-table' alt='user' src={studentImg} loading='lazy' />
                          ) : null}

                          <Tooltip TransitionProps={{ timeout: 200 }} title={studentName} placement="top">
                            <span>{studentName.length > 13 ? `${studentName.slice(0, 13)}...` : studentName}</span>
                          </Tooltip>
                        </Link>
                      </TableCell>



                      <TableCell align="center">{nationalId}</TableCell>
                      <TableCell align="center">{clinicName}</TableCell>
                      <TableCell align="center">{displayDate}</TableCell>
                      <TableCell align="center">{examType}</TableCell>
                      <TableCell align="center">{statusText}</TableCell>

                      <TableCell align="center" style={{ display: "flex", justifyContent: "center" }}>
                        <div className='k-btn-group'>

                          {
                            statusText === "مقبول" ?
                              <div className='accept-resv'>مقبول</div> :
                              statusText === "مرفوض" ? <div className='rej-resv'>مرفوض</div> :
                                <React.Fragment>
                                  <button onClick={() => acceptOrDecline(rowId, studentId, true)}><span className="material-symbols-outlined">
                                    check
                                  </span></button>
                                  <button onClick={() => acceptOrDecline(rowId, studentId, false)}><span className="material-symbols-outlined">
                                    close
                                  </span></button></React.Fragment>

                          }
                        </div>
                      </TableCell>

                    </TableRow>


                  );
                }) : <TableRow  > <TableCell colSpan={8}>  <h3 style={{ width: "100%", textAlign: "center", fontSize: "25px" }} > غير موجود </h3> </TableCell> </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>

      </Box>
    </div>
  );
}