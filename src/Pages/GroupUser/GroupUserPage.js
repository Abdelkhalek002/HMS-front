import React, { useEffect } from 'react';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page'), 10) || 1;

    // For Get Total Page & Users Data
    const allUsers = useSelector(state => state.UserControlSlice.data);
    const totalPageFromSlice = useSelector(getTotalPageUser) || 0;
    const totalPage = totalPageFromSlice > 0 ? totalPageFromSlice : (allUsers && allUsers.length > 0 ? Math.ceil(allUsers.length / 8) : 0);

    // For Access Token and ID
    const { token, payLoad } = useSelector(getUserInfo) || {};

    // For Dispatch Action
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(getAllUserApi({ token, id: payLoad?.userId || payLoad?.id, page: currentPage }));
        }
    }, [token, payLoad?.userId, payLoad?.id, dispatch, currentPage]);

    const handlePageChange = (event, value) => {
        setSearchParams({ page: value });
    };

    return (
        <div className='k-group-user-page'>
            <h2 className='title'>المستخدمين</h2>
            <AllUserComponent />

            {totalPage > 1 && allUsers && allUsers.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                    <Stack spacing={2}>
                        <Pagination
                            color="primary"
                            count={totalPage}
                            page={currentPage}
                            onChange={handlePageChange}
                            renderItem={(item) => (
                                <PaginationItem
                                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                    {...item}
                                />
                            )}
                        />
                    </Stack>
                </div>
            )}
        </div>
    );
};

export default GroupUserPage;
