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
import excelPic from "./../../images/excel.png" ; 
import { Tooltip } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { acceptOrDeclineAPI, getAllReservationListAPI, getReservationData } from '../../RTK/Admins/CounterSlice';
import StatusCode from '../../StatusCode';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { useState } from 'react';
import printPic from "./../../images/printer-print-svgrepo-com.svg" ; 


function createData(id, name, calories, fat, carbs, protein) {
  return {id,name,calories,fat,carbs,protein,};
}



const rows = [
  createData(1, 'كريم محمد احمد', "301112301011929", "انف واذن وحنجرة", "2024-5-22"),
  createData(2, 'Donut', 452, 25.0, 51, 4.9),
  createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),

];




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
    label: 'قبول او رفض',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =props;
  console.log(`The Props `)
  console.log(props) ; 
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };



  return (
    <TableHead>
      <TableRow style={{borderBottom: "none"}} >
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
const [excel , setExcel ] = React.useState([] ) ;

  // For Access Reservation Data 
  const {data , status} = useSelector(getReservationData)  ;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.medicEx_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };


  console.log(data) ; 


  const handleClick = (event, id , rowIt ) => {
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
      setExcel(excel.filter((item)=>{
        return item.id !== (+id) ;
      }))
        newSelected = newSelected.concat(selected.slice(1));
      
    } else if (selectedIndex === selected.length - 1) {
      console.log("Entered 3")
      setExcel(excel.filter((item)=>{
        return item.id !== (+id) ;
      }))
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      console.log("Entered 4")
      console.log("Entered 3")
      setExcel(excel.filter((item)=>{
        return item.id !== (+id) ;
      }))

      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = rows ;



  console.log(status)

  // For Dispatch Action
  const dispatch = useDispatch() ; 


  // For Token 
  const {token} = useSelector(getUserInfo) ; 

  // For Access Params
  const [searchParams , setSearchParams ] = useSearchParams() ; 

  //  For Accept and Decline 
  const acceptOrDecline = (medxId , userId , res)=>{
    dispatch(acceptOrDeclineAPI({token ,medxId ,   res , page : searchParams.get('page') ? searchParams.get('page') : 1 , searchKey : "" }))
  }

  // For Search 
  const searchHandler = ()=>{
    searchParams.append('search' , searchInput)
    setSearchParams({...searchParams , search : searchInput , page : 1})
    dispatch(getAllReservationListAPI({token , page :  1  , search : searchInput ? searchInput : ""} ))
  }

  // For Search Active 
  const [active , setActive] = useState(false) ; 



  // For Access Input 
  const [searchInput , setSearchInput] = useState('') ; 

 

  return (
    <div  >  
        <button onClick={()=>window.print()}>Print</button>      
        <Box  sx={{ width: '1000px' , maxWidth : "100%" , margin : "20px auto" , borderRadius : "20px" }}>
        <div className='k-filter-table'>
          <div  onBlur={()=>setActive(false)} onFocus={()=>setActive(true)} className={`search ${active ? 'search-active' : ""}`}>

            <input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}  placeholder='ابحث...' />

              <span  onClick={searchHandler} className="material-symbols-outlined">
              search
              </span>
          </div>
          <img src={printPic } className='print-btn' alt='print' loading='lazy' onClick={()=>window.print()} />     

          <CSVLink filename='studentInfo' className='excel-btn' data={excel}> <img src={excelPic} alt='excel' /> </CSVLink>
        </div>
        <Paper style={{borderRadius : "10px"}} sx={{ width: '100%', mb: 2 }}>
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
                rowCount={rows.length}
                />
                <TableBody> 
                { status === StatusCode.SUCCESS && data.length !==0 ?  data.map((row, index) => {
                    const isItemSelected = isSelected(row.medicEx_id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.medicEx_id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                          
                      >
                          
                              <TableCell  onClick={(event) =>{  handleClick(event, row.medicEx_id, row )}}padding="checkbox">
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
                              <Link to={`profile/${row.student_id}`} style={{ color :"black", display : "flex" , alignItems : "center"}}>
                              <img className='imgage-table' alt='user' src={`http://localhost:7000/api/v1/uploads/${row.student_image}`} loading='lazy' />
                              
                              <Tooltip TransitionProps={{ timeout: 200 }} title={row.student_name} placement="top">
                              { row.student_name > 13 ?  `${row.student_name.slice(0 , 13)}...` : row.student_name}
                              </Tooltip>
                              </Link>
                              </TableCell>
                            
                              

                            <TableCell  align="center">{row.national_id}</TableCell>
                            <TableCell  align="center">{row.clinic_name}</TableCell>
                            <TableCell  align="center">{row.date.length === 9 ?   row.date.slice(0 , 9) :row.date.slice(0 , 8)}</TableCell>
                            <TableCell  align="center">{row.examType}</TableCell>
                            <TableCell  align="center">{row.status}</TableCell>

                            <TableCell align="center" style={ {display : "flex" , justifyContent: "center"}}>
                            <div className='k-btn-group'>
                                
                                {
                                  row.status === "مقبول" ?
                                  <div className='accept-resv'>مقبول</div> :
                                  row.status === "مرفوض" ? <div className='rej-resv'>مرفوض</div> :
                                  <React.Fragment>
                                  <button onClick={()=> acceptOrDecline(row.medicEx_id , row.student_id , 1)}><span class="material-symbols-outlined">
                                  check
                                  </span></button>
                                  <button onClick={()=> acceptOrDecline(row.medicEx_id , row.student_id , 0)}><span class="material-symbols-outlined">
                                  close
                                  </span></button></React.Fragment>

                                }
                            </div>
                            </TableCell>
                          
                      </TableRow>

                    
                    );
                }) : <TableRow  > <TableCell  colSpan={8}>  <h3 style={{width : "100%" , textAlign : "center" , fontSize :"25px"}} > غير موجود </h3> </TableCell> </TableRow>
              }
                {emptyRows > 0 && (
                    <TableRow
                    style={{
                        height: (dense ? 33 : 53) * emptyRows,
                    }}
                    >
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
            
        </Paper>
        
        </Box>
    </div>
  );
}