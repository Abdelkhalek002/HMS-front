import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllReservationListAPI, getReservationData } from '../../admins/CounterSlice';
import { getUserInfo } from '../../auth';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EnhancedTable from '../components/TransferTable';
import {
  getAllExhospitalsAPI,
  getAllClinicsAPI,
  getAllLevelsAPI,
  getAllFacultiesAPI,
} from '../../lookups';

const TransferPage = () => {
  // For Dispatch Action
  const dispatch = useDispatch();

  // For Change Param 
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });

  // For Get Token and ID
  const { token } = useSelector(getUserInfo);

  // For Get All Reservation 
  useEffect(() => {
    dispatch(getAllReservationListAPI({ token, page: searchParams.get('page') ? searchParams.get('page') : 1, search: searchParams.get('search') ? searchParams.get('search') : "" }));
    dispatch(getAllExhospitalsAPI());
    dispatch(getAllClinicsAPI({ token }));
    dispatch(getAllLevelsAPI({ token }));
    dispatch(getAllFacultiesAPI({ token }));
  }, [token, searchParams, dispatch])



  // For Access Total Page 
  const { totalPage } = useSelector(getReservationData);

  // For Handle Pagaintion
  // For Handle Pagaintion
  const showResultOfPag = (npage) => {
    // dispatch(getAllReservationListAPI({token , page :npage ? npage: 1})) ; 
    setSearchParams({ page: npage, search: searchParams.get('search') ? searchParams.get('search') : "" })
  }




  return (
    <section className='k-counter-page'>
      <EnhancedTable />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <Stack spacing={2} >
          <Pagination
            color="primary"
            count={totalPage}
            onClick={(e) => showResultOfPag(e.target.innerText)}
            renderItem={(item) => {
              console.log(item)
              if (item.page == searchParams.get('page') && item.type !== 'next')
                item.selected = true
              else
                item.selected = false
              return (
                <PaginationItem
                  color='primary'
                  selected={searchParams.get('page') == item.page ? true : false}
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}


                  {...item}

                />
              )
            }
            }
          />
        </Stack>
      </div>
    </section>
  )
}

export default TransferPage
