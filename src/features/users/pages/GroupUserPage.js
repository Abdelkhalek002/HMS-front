import React, { useEffect } from 'react';
import './groupuser.css';
import UserTable from '../components/UserTable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserApi, getTotalPageUser } from '../UserControlSlice';
import { getAllFacultiesAPI, getAllLevelsAPI } from '../../lookups';
import { getUserInfo } from '../../auth';

const GroupUserPage = () => {
  // For Change Param 
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;
  const currentSearch = searchParams.get('search') || '';
  const currentDocStatus = searchParams.get('document_status') || '';
  const currentDate = searchParams.get('date') || '';
  const currentFacultyId = searchParams.get('faculty_id') || '';
  const currentLevelId = searchParams.get('level_id') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentNationalityId = searchParams.get('nationality_id') || '';

  // For Get Total Page & Users Data
  const allUsers = useSelector((state) => state.UserControlSlice.data);
  const totalPageFromSlice = useSelector(getTotalPageUser) || 0;
  const totalPage =
    totalPageFromSlice > 0
      ? totalPageFromSlice
      : allUsers && allUsers.length > 0
      ? Math.ceil(allUsers.length / 8)
      : 1;

  // For Access Token and ID
  const { token, payLoad } = useSelector(getUserInfo) || {};

  // For Dispatch Action
  const dispatch = useDispatch();

  // Fetch Lookups on Mount
  useEffect(() => {
    dispatch(getAllFacultiesAPI());
    dispatch(getAllLevelsAPI());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(
        getAllUserApi({
          token,
          id: payLoad?.userId || payLoad?.id,
          page: currentPage,
          limit: 8,
          search: currentSearch,
          document_status: currentDocStatus !== 'all' ? currentDocStatus : '',
          date: currentDate,
          faculty_id: currentFacultyId,
          level_id: currentLevelId,
          gender: currentGender,
          nationality_id: currentNationalityId,
        })
      );
    }
  }, [
    token,
    payLoad?.userId,
    payLoad?.id,
    dispatch,
    currentPage,
    currentSearch,
    currentDocStatus,
    currentDate,
    currentFacultyId,
    currentLevelId,
    currentGender,
    currentNationalityId,
  ]);

  const handlePageChange = (event, value) => {
    if (!value) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', value);
    setSearchParams(newParams);
  };

  return (
    <section className="k-group-user-page">
      <UserTable />

      {totalPage > 1 && allUsers && allUsers.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            marginBottom: '40px',
          }}
        >
          <Stack spacing={2}>
            <Pagination
              color="primary"
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  color="primary"
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

export default GroupUserPage;
