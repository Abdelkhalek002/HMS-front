import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LookupPage from '../../Component/Common/LookupPage.jsx';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';
import {
  addNewGovernorateAPI,
  deleteGovernorateAPI,
  getAllGovsAPI,
  updateGovernorateAPI,
} from '../../RTK/Governorate/GovernorateSlice.js';

export default function GovernoratesPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.GovernorateSlice);
  const { token } = useSelector(getUserInfo);

  const fetchGovs = useCallback(() => {
    dispatch(getAllGovsAPI());
  }, [dispatch]);

  const handleCreate = (govName) => {
    return dispatch(addNewGovernorateAPI({ data: { govName }, token })).unwrap();
  };

  const handleUpdate = (id, govName) => {
    return dispatch(updateGovernorateAPI({ data: { id, govName }, token })).unwrap();
  };

  const handleDelete = (id) => {
    return dispatch(deleteGovernorateAPI({ data: id, token })).unwrap();
  };

  return (
    <LookupPage
      pageTitle="المحافظات"
      entitySingular="المحافظة"
      helmetTitle="Governorates"
      data={data}
      status={status}
      idKey="gov_id"
      nameKey="govName"
      onFetch={fetchGovs}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
