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
import { Button, Modal, Tooltip } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterAPI, getAllReservationListAPI, getReservationData } from '../../RTK/Admins/CounterSlice';
import StatusCode from '../../StatusCode';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { transferAPI, updateTransferAPI } from '../../RTK/Transfer/TransferSlice';
import printPic from "./../../images/printer-print-svgrepo-com.svg" ; 
import advancedPic from "./../../images/icons8-advanced-search-50.png" ; 
import { getAllFaculties } from '../../RTK/Faculty/FacultySlice';
import { getAllClinics } from '../../RTK/Clinic/ClinicSlice';
import { getAllLevels } from '../../RTK/Level/LevelSlice';


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
const createSortHandler = (property) => (event) => {
onRequestSort(event, property);
};



return (
<TableHead>
    <TableRow style={{borderBottom: "none"}} >
    <TableCell padding="checkbox">
        
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
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={createSortHandler(headCell.id)}
        >
            <h3>{headCell.label}</h3>
            {orderBy === headCell.id ? (
            <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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



const style = {
    position: 'absolute' ,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    height : 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius :"7px"
  };


const handleRequestSort = (event, property) => {
const isAsc = orderBy === property && order === 'asc';
setOrder(isAsc ? 'desc' : 'asc');
setOrderBy(property);
};

const handleSelectAllClick = (event) => {
if (event.target.checked) {
    const newSelected = rows.map((n) => n.id);
    setSelected(newSelected);
    return;
}
setSelected([]);
};

//   For Handle Excel Print 
const [excel , setExcel ] = useState([] ) ;

// For Access Reservation Data 
const {data , status} = useSelector(getReservationData)  ;

console.log(data) ; 


const handleClick = (event, id , rowIt ) => {
console.log(`the ID Selectd ${id}`)

const selectedIndex = selected.indexOf(id);
let newSelected = [];

if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, id);
    setExcel(excel.concat(rowIt))
} else if (selectedIndex === 0) {

    setExcel(excel.filter((item)=>{
    return item.id !== (+id) ;
    }))
    newSelected = newSelected.concat(selected.slice(1));
    
} else if (selectedIndex === selected.length - 1) {
    setExcel(excel.filter((item)=>{
    return item.id !== (+id) ;
    }))
    newSelected = newSelected.concat(selected.slice(0, -1));
} else if (selectedIndex > 0) {
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


// For Dispatch Action
const dispatch = useDispatch() ; 


// For Token 
const {token} = useSelector(getUserInfo) ; 


// For Access Hospital
const hospital=useSelector(state => state.ExHospitalSlice)

// For Access Params
const [searchParams , setSearchParams ] = useSearchParams() ; 

// For Access Hosptial Select 
const [hos , setHos] = useState(0) ;
const [updateHos , setUpdateHos ] = useState(0) ; 

// For Overlay 
const [open, setOpen] = React.useState(false);
const [updateOpen, setUpdateOpen] = useState(false);
const [advancedSearchModal , setAdvancedSearchModal] = useState(false) ;


// For Handle Transfer Modal
const handleOpen = (data) =>{
    setTransferData(data);    
    setOpen(true);
}
const handleClose = () => setOpen(false);

// For Handle Update Transfer Modal
const handleUpdateOpen = (data) =>{
    setUpdateTransferData(data);    
    setUpdateOpen(true);
}
const handleUpdateClose = () => setUpdateOpen(false);

// For Handle AdvancedSearch Modal
const handleAdvancedOpen = (data)=>{
    setAdvancedSearchModal(true) ;
}
const handleCloseAdvanced = ()=>{
    setAdvancedSearchModal(false) ; 
}

// For Access Data Transfer 
const [transferData , setTransferData] = useState(null) ; 
const [updateTransferData , setUpdateTransferData] = useState(null ); 

// For Transfer Student 
const transferHandler = ( event)=>{
    event.preventDefault() ; 

        if(transferData){
                if(hos !== 0 ){
                    dispatch(transferAPI({token , data :{...transferData , hospital : hos}  , page : searchParams.get("page") ? searchParams.get("page") : 1  } ))
                }else{
                    toast.success("برجاء اختيار المستشفي")
                }
                handleClose()
        }

    else{
        toast.error('برجاء اختيار المستشفي')
    }
}

// For Update Transfer
const updatetransferHandler = ( event)=>{
    event.preventDefault() ; 

        if(updateTransferData){
                if(updateHos != 0 ){
                    dispatch(updateTransferAPI({token , data :{...updateTransferData , hospital : updateHos}  , page : searchParams.get("page") ? searchParams.get("page") : 1  } ))
                }else{
                    toast.success("برجاء اختيار المستشفي")
                }
                handleClose()
        }

    else{
        toast.error('برجاء اختيار المستشفي')
    }
}

/// For Search 
const searchHandler = ()=>{
    searchParams.append('search' , searchInput)
    setSearchParams({...searchParams , search : searchInput , page : 1})
    dispatch(getAllReservationListAPI({token , page :  1  , search : searchInput ? searchInput : ""} ))
}

// For Search Active 
const [active , setActive] = useState(false) ; 

// For Access Input 
const [searchInput , setSearchInput] = useState('') ; 


// Start Advanced Search 
const AdvancedSearchStyle = {
    position: 'absolute' ,
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    outline : "none" , 
    height : 350,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius :"6px" , 

  };

//  For Access Advanced Input
const [level , setLevel] = useState( ""); 
const [levelID , setLevelID] = useState( ""); 
const [clinic , setClinic] = useState( ""); 
const [faculty , setFaculty] = useState( "");
const [exampType , setExampType] = useState( "");
const [name , setName] = useState( "");
const [date , setDate ] = useState('') ; 

console.log(levelID)
 ;
// For Get Data of Avanced Search
const levels = useSelector(getAllLevels) ; 
const faculties = useSelector(getAllFaculties) ; 
const clinics = useSelector(getAllClinics) ;

// For Hanlde Data

// For Reset Adavanced Search
const resetHandler = (e)=>{
    e.preventDefault() ; 
    setLevel('') ;
    setClinic('') ; 
    setFaculty('') ;
    setExampType('') ;
    setName('') ;
    setDate('') 
}

// For Searhc In Advanced 
const advancedSearchHandler = (e)=>{
    e.preventDefault()
    dispatch(filterAPI({token , level_id : level.split(" ")[0] ?level.split(" ")[0] : ""   , clinic_id : clinic? clinic.split(" ")[0] : ""  , faculty_id : faculty ? faculty.split(" ") : "" , examType : exampType ?exampType :"", userName : name ? name : '' , date : date ?date:""  }))
}


return (
    <div >  

    
        {/* Modal For Transfer  */}
        <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            
            >
            <Box  sx={style}>
                <div className='k-main-over'>
                    {/*<div className='image-over'>
                    <img src='' alt='pic' loading='lazy' />
                    </div>*/
                    }
                    <h3 className='over-title'>تعديل البيانات</h3>
                    <p className='over-des'>برجاء التاكد من البيانات قبل الحفظ</p>
        
                    <form  onSubmit={(e)=>transferHandler( e)}>
        
        
                    <div className='row last-row'>
                    <label htmlFor='name'> اختيار المستشفي</label>
                    <select onChange={(e)=>setHos(e.target.value)} value={hos} style={{marginTop : "10px"}} className='over-input'>
                        <option value={0}>اختيار </option>
                        {
                            hospital.data ? hospital.data.map((item)=>{
                                return <option key={item.exHosp_id}  value={item.exHosp_id}>{item.hospName}</option>
                            }) :""
                        }
        
                    </select>
                    </div>
        
                    <div className='over-btn'>
                    <Button  type="submit" variant="contained">تحويل</Button>
                    </div>
        
        
                    </form>
        
                </div>
                </Box>
        </Modal>
        {/* Modal For Update Transfer */}
        <Modal
            keepMounted
            open={updateOpen}
            onClose={handleUpdateClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            
            >
            <Box  sx={style}>
                <div className='k-main-over'>
                    {/*<div className='image-over'>
                    <img src='' alt='pic' loading='lazy' />
                    </div>*/
                    }
                    <h3 className='over-title'>تعديل البيانات</h3>
                    <p className='over-des'>برجاء التاكد من البيانات قبل الحفظ</p>
        
                    <form  onSubmit={(e)=>updatetransferHandler( e)}>
        
        
                    <div className='row last-row'>
                    <label htmlFor='name'> اختيار المستشفي</label>
                    <select onChange={(e)=>setUpdateHos(e.target.value)} value={updateHos} style={{marginTop : "10px"}} className='over-input'>
                        <option value={0}>اختيار </option>
                        {
                            hospital.data ? hospital.data.map((item)=>{
                                return <option key={item.exHosp_id}  value={item.exHosp_id}>{item.hospName}</option>
                            }) :""
                        }
        
                    </select>
                    </div>
        
                    <div className='over-btn'>
                    <Button  type="submit" variant="contained">تعديل</Button>
                    </div>
        
        
                    </form>
        
                </div>
                </Box>
        </Modal>
        {/* Modal For Advanced Search Modal */}
        <Modal
        keepMounted
        open={advancedSearchModal}
        onClose={handleCloseAdvanced}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        
        >
        <Box  sx={AdvancedSearchStyle}>
            <div className='k-main-over'>
                {/*<div className='image-over'>
                <img src='' alt='pic' loading='lazy' />
                </div>*/
                }
                <h3 className='over-title'> بحث متقدم</h3>
    
                <form  >
                    <div className='k-input-container'>
                        <div className='collection'>
                        <input onChange={(e)=>setName(e.target.value)} value={name} className='text-input' placeholder='الاسم' />

                        <div className='avacned-input'>
                            <input value={date} onChange={(e)=>setDate(e.target.value)} type='date'  className='hidden-input' />
                            <div className='arrow-con'><i style={{margin: "10px 5px"}} className="fa-regular fa-calendar"></i></div>
                            <p className='avanced-text'> {date ? date : "تاريخ الكشف"}  </p>
                        </div>
                        </div>

                        <div className='collection'>
                            <div className='avacned-input'>
                            <select onChange={(e)=>{console.log(e.target.value) ; setLevel( e.target.value) }} className='hidden-input'>
                                {
                                    levels?  levels.map((item , idx)=>{
                                        return <option key={idx}  value={`${item.level_id} ${item.levelName}`}>{item.levelName}</option>
                                    }) : ""
                                }
                            </select>
                                <div className='arrow-con'><i className="fa-solid fa-chevron-down"></i></div>
                                <p className='avanced-text'> {level ? level.split(" ")[1] : "اختار المستوي" }</p>
                            </div>

                            <div className='avacned-input'>
                            <select onChange={(e)=>{ setFaculty( e.target.value) }} className='hidden-input'>
                                {
                                    faculties?  faculties.map((item , idx)=>{
                                        return <option key={idx}  value={`${item.faculty_id} ${item.facultyName}`}>{item.facultyName}</option>
                                    }) : ""
                                }
                            </select>
                                <div className='arrow-con'><i className="fa-solid fa-chevron-down"></i></div>
                                <p className='avanced-text' > {faculty ? faculty.split(" ")[1] : "اختار الكلية" }</p>
                            </div>
                        </div>

                        <div className='collection'>
                        <div className='avacned-input'>
                        <select onChange={(e)=>{ setClinic( e.target.value) }}  className='hidden-input'>
                        {
                            clinics?  clinics.map((item , idx)=>{
                                return <option key={idx}  value={`${item.clinic_id} ${item.clinicName}`}>{item.clinicName}</option>
                            }) : ""
                        }
                        </select>
                            <div className='arrow-con'><i className="fa-solid fa-chevron-down"></i></div>
                            <p className='avanced-text'> {clinic ? clinic.split(" ")[1] : "اختار العيادة"}</p>
                        </div>

                        <div className='avacned-input'>
                        <select onChange={(e)=>setExampType(e.target.value)}  className='hidden-input'>
                            <option>كشف جديد</option>
                            <option>متابعة</option>
                            <option>طورائ</option>
                        </select>
                            <div className='arrow-con'><i className="fa-solid fa-chevron-down"></i></div>
                            <p className='avanced-text'> {exampType ? exampType : "نوع الكشف"}  </p>
                        </div>
                        </div>

                        <div className='g-btn'>
                            <button onClick={advancedSearchHandler} type='submit' title='search' className='search-btn'>Search</button>
                            <button onClick={resetHandler} title='reset' className='rest-btn'>Reset</button>
                        </div>

                    </div>
    
                </form>
    
            </div>
            </Box>
    </Modal>


        <Box  sx={{ width: '1000px' , maxWidth : "100%" , margin : "20px auto" , borderRadius : "20px" }}>
        <div className='k-filter-table'>
            <div  onBlur={()=>setActive(false)} onFocus={()=>setActive(true)} className={`search ${active ? 'search-active' : ""}`}>

                <input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}  placeholder='ابحث...' />

                <span  onClick={searchHandler} className="material-symbols-outlined">
                search
                </span>
            </div>
            <img onClick={handleAdvancedOpen}  style={{width : "28px" , marginRight : "10px" , paddingBottom : "2px" , cursor: "pointer"}} src={advancedPic} loading='lazy' alt='advanced search' title='advanced Search'  />
            <img title='print' src={printPic} className='print-btn' alt='print' loading='lazy' onClick={()=>window.print()} />     
            <CSVLink title='excel' filename='studentInfo' className='excel-btn' data={excel}> <img src={excelPic} alt='excel' /> </CSVLink>
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
                { status === StatusCode.SUCCESS && data.length !==0 ?  data.filter((item)=>item.status === 'مقبول').map((krow, index) => {
                    const isItemSelected = isSelected(krow.medicEx_id);
                    const labelId = `enhanced-table-checkbox-${krow.medicEx_id}`;
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={krow.medicEx_id}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }}
                            
                        >
                        
                            
                                <TableCell  onClick={(event) => handleClick(event,krow.medicEx_id ,  krow )} padding="checkbox">
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
                                <Link to={`/ad/profile/${krow.student_id}`} style={{ color :"black", display : "flex" , alignItems : "center"}} >
                                <img className='imgage-table' alt='user' src={`http://localhost:7000/api/v1/uploads/${krow.student_image}`} loading='lazy' />
                                
                                <Tooltip TransitionProps={{ timeout: 200 }} title={krow.student_name} placement="top">
                                { krow.student_name > 13 ?  `${krow.student_name.slice(0 , 13)}...` : krow.student_name}
                                </Tooltip>
                                </Link>
                                </TableCell>
                            
                                

                            <TableCell  align="center">{krow.national_id}</TableCell>
                            <TableCell  align="center">{krow.clinic_name}</TableCell>
                            <TableCell  align="center">{krow.date.length === 9 ?   krow.date.slice(0 , 9) :krow.date.slice(0 , 8) }</TableCell>
                            <TableCell  align="center">{krow.examType}</TableCell>
                            <TableCell  align="center">{krow.status}</TableCell>

                            <TableCell align="center" style={ {display : "flex" , justifyContent: "center"}}>
                            <div className='k-btn-group'>
                                
                                {
                                    krow.transfered === 0 ?
                                    <Button className='transfer-btn' onClick={()=>handleOpen(krow)}> تحويل  </Button>:
                                    <Button onClick={()=>handleUpdateOpen(krow)} style={{background : "orange" , color :"white" , borderRadius:"22px"}}>تعديل </Button>

                                }
                            </div>
                            </TableCell>
                            
                        </TableRow>

                    
                    );
                }) : <TableRow  > <TableCell  colSpan={8}>  <h3 style={{width : "100%" , textAlign : "center" , fontSize :"25px"}} >  غير موجود </h3> </TableCell> </TableRow>
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