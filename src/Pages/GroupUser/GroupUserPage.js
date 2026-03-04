import React, { useEffect } from 'react' ;
import "./groupuser.css";
import AllUserComponent from '../../Component/GroupUser/AllUserComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserApi, getTotalPageUser } from '../../RTK/UserControl/UserControlSlice';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';


const GroupUserPage = () => {

    // For Change Param 
    const [searchParams , setSearchParams] = useSearchParams({page : 1}) ; 

    // For Get Totla Page 
    const totalPage = useSelector(getTotalPageUser) ;
    console.log(`the Total Total ${totalPage}`) 

    // For Access Token and ID
    const { token, payLoad } = useSelector(getUserInfo);

    // For Dispatch Action
    const dispatch = useDispatch();


    useEffect(() => {
      if (token && payLoad.userId) {
        dispatch(getAllUserApi({ token, id: payLoad.userId , page: searchParams.get('page') ? searchParams.get('page') : 1 }));
      }
    }, [token, payLoad.userId, dispatch , searchParams]);

    // For Handle Pagination
    const showResultOfPag = (npage)=>{
      setSearchParams({page : npage})
    }

  return (
    <div className='k-group-user-page'>
        <h2 className='title'>المستخدمين</h2>
        <AllUserComponent />
        <div style={{display : "flex" , justifyContent : "center" , alignItems : "center" , marginTop : "20px"}}>
            <Stack spacing={2} >
            <Pagination
              color="primary"
              count={totalPage}
              onClick={(e)=> showResultOfPag(e.target.innerText)}
              renderItem={(item) =>{ console.log(item)
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
  )
}

export default GroupUserPage
