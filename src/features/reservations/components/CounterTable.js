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
import { Tooltip } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { acceptOrDeclineAPI, getAllReservationListAPI, getReservationData } from '../../../RTK/Admins/CounterSlice';
import StatusCode from '../../../StatusCode';
import { getUserInfo } from '../../../RTK/Auth/AuthSlice';
import { useState } from 'react';
import { BASE_URL } from '../../../API_Route/GlobalRoute';
import { useTableSelection } from '../../../components/table/useTableSelection';
import TableToolbar from '../../../components/table/TableToolbar';

const headCells = [
  {
    id: 'studentName',
    numeric: false,
    disablePadding: true,
    label: 'اسم الطالب',
    sortable: true,
  },
  {
    id: 'nationalId',
    numeric: false,
    disablePadding: false,
    label: 'الرقم القومي',
    sortable: true,
  },
  {
    id: 'clinic',
    numeric: false,
    disablePadding: false,
    label: 'العيادة',
    sortable: true,
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'تاريخ الحجز',
    sortable: true,
  },
  {
    id: 'examType',
    numeric: false,
    disablePadding: false,
    label: ' نوع الكشف',
    sortable: true,
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'حالة الكشف',
    sortable: true,
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'إجراءات',
    sortable: false,
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
              'aria-label': 'تحديد جميع الحجوزات',
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
            {headCell.sortable !== false ? (
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
            ) : (
              <h3>{headCell.label}</h3>
            )}
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
  const [orderBy, setOrderBy] = React.useState('date');

  const {
    selected,
    excel,
    handleClick,
    isSelected,
    selectAll,
    clearSelection,
  } = useTableSelection();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // For Access Reservation Data 
  const { data, status } = useSelector(getReservationData);

  const sortedData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      let aVal = '';
      let bVal = '';
      if (orderBy === 'studentName') {
        aVal = a.student?.name ?? a.student_name ?? '';
        bVal = b.student?.name ?? b.student_name ?? '';
      } else if (orderBy === 'nationalId') {
        aVal = String(a.student?.nationalId ?? a.national_id ?? '');
        bVal = String(b.student?.nationalId ?? b.national_id ?? '');
      } else if (orderBy === 'clinic') {
        aVal = a.clinic?.name ?? a.clinic_name ?? '';
        bVal = b.clinic?.name ?? b.clinic_name ?? '';
      } else if (orderBy === 'date') {
        aVal = a.date ?? '';
        bVal = b.date ?? '';
      } else if (orderBy === 'examType') {
        aVal = a.examType ?? a.exam_type ?? '';
        bVal = b.examType ?? b.exam_type ?? '';
      } else if (orderBy === 'status') {
        aVal = a.status ?? '';
        bVal = b.status ?? '';
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked && sortedData) {
      selectAll(sortedData);
    } else {
      clearSelection();
    }
  };





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

  // For Access Input 
  const [searchInput, setSearchInput] = useState('');



  return (
    <div>
      <Box sx={{ width: '1250px', maxWidth: "100%", margin: "20px auto", borderRadius: "20px" }}>
        <TableToolbar
          searchValue={searchInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
          onSearchSubmit={searchHandler}
          excelData={excel}
          excelFilename="studentInfo"
        />
        <Paper style={{ borderRadius: "10px" }} sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={sortedData?.length || 0}
              />
              <TableBody>
                {status === StatusCode.SUCCESS && sortedData.length !== 0 ? sortedData.map((row, index) => {
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