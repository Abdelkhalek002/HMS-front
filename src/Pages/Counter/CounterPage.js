import React, { useEffect } from 'react' ; 
import "./Counter.css" ; 
import EnhancedTable from '../../Component/Counter/CounterTable';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { getAllReservationListAPI, getReservationData } from '../../RTK/Admins/CounterSlice';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Pagination, PaginationItem, Stack } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



const CounterPage = () => {

  // For Dispatch Action
  const dispatch = useDispatch() ;

  // For Acces Param
  const {page} = useParams() ; 

  // For Change Param 
  const [searchParams , setSearchParams] = useSearchParams({page : 1}) ; 


  console.log(page ) ; 

  // For Get Token and ID
  const {token  } = useSelector(getUserInfo) ; 

  // For Get All Reservation 
  useEffect(()=>{
    dispatch(getAllReservationListAPI({token , page : searchParams.get('page') ? searchParams.get('page') : 1 , limit: 8, search : searchParams.get('search') ?searchParams.get('search') :"" })) ; 
  } , [   token  , searchParams , dispatch])



  // For Access Total Page 
  const {totalPage } = useSelector(getReservationData) ; 

  // For Handle Pagaintion
  const showResultOfPag = (npage)=>{
    // dispatch(getAllReservationListAPI({token , page :npage ? npage: 1})) ; 
    setSearchParams({page : npage , search : searchParams.get('search') ?searchParams.get('search') : "" })
  }



  return (
    <section className='k-counter-page'>
        <EnhancedTable />
        <div style={{display : "flex" , justifyContent :"center" , marginTop : "30px" }}>
          <Stack spacing={2} >
          <Pagination
            color="primary"
            count={totalPage}
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
    </section>
  )
}

export default CounterPage
