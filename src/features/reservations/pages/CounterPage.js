import React, { useEffect } from 'react';
import "./Counter.css";
import EnhancedTable from '../components/CounterTable';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../auth';
import { getAllReservationListAPI, getReservationData } from '../../admins/CounterSlice';
import { getAllClinicsAPI, getAllFacultiesAPI, getAllLevelsAPI } from '../../lookups';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationItem, Stack } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CounterPage = () => {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams({ page: 1, status: 'pending' });

  const { token } = useSelector(getUserInfo);

  const activeStatus = searchParams.get('status') === 'finished' ? 'finished' : 'pending';
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const currentSearch = searchParams.get('search') ? searchParams.get('search') : "";
  const clinicId = searchParams.get('clinic_id') || "";
  const dateFilter = searchParams.get('date') || "";
  const facultyId = searchParams.get('faculty_id') || "";
  const levelId = searchParams.get('level_id') || "";
  const genderFilter = searchParams.get('gender') || "";
  const nationalityId = searchParams.get('nationality_id') || "";

  // Fetch Lookups on Mount
  useEffect(() => {
    dispatch(getAllClinicsAPI());
    dispatch(getAllFacultiesAPI());
    dispatch(getAllLevelsAPI());
  }, [dispatch]);

  // For Get All Reservations filtered by active status, search, and all filters
  useEffect(() => {
    dispatch(
      getAllReservationListAPI({
        token,
        page: currentPage,
        limit: 8,
        search: currentSearch,
        status: activeStatus,
        clinic_id: clinicId,
        date: dateFilter,
        faculty_id: facultyId,
        level_id: levelId,
        gender: genderFilter,
        nationality_id: nationalityId,
      })
    );
  }, [
    token,
    currentPage,
    currentSearch,
    activeStatus,
    clinicId,
    dateFilter,
    facultyId,
    levelId,
    genderFilter,
    nationalityId,
    dispatch,
  ]);

  const { totalPage } = useSelector(getReservationData);

  const showResultOfPag = (event, npage) => {
    if (!npage) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', npage);
    setSearchParams(newParams);
  };

  return (
    <section className='k-counter-page'>
      <EnhancedTable />
      {totalPage > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", marginBottom: "30px" }}>
          <Stack spacing={2}>
            <Pagination
              color="primary"
              count={totalPage}
              page={currentPage}
              onChange={showResultOfPag}
              renderItem={(item) => (
                <PaginationItem
                  color='primary'
                  selected={currentPage === item.page}
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
      )}
    </section>
  );
};

export default CounterPage;
