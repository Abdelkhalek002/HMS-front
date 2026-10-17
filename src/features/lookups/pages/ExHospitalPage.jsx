import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LookupPage from '../components/LookupPage.jsx';
import { getUserInfo } from '../../auth';
import {
  addNewExhospitalAPI,
  deleteExhospitalAPI,
  getAllExhospitalsAPI,
  updateExhospitalAPI,
} from '../ExHospitalSlice';

export default function ExHospitalPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.ExHospitalSlice);
  const { token } = useSelector(getUserInfo);

  const fetchHospitals = useCallback(() => {
    dispatch(getAllExhospitalsAPI({ token }));
  }, [dispatch, token]);

  const handleCreate = (hospName) => {
    return dispatch(addNewExhospitalAPI({ data: { hospName }, token })).unwrap();
  };

  const handleUpdate = (id, hospName) => {
    return dispatch(updateExhospitalAPI({ data: { id, hospName }, token })).unwrap();
  };

  const handleDelete = (id) => {
    return dispatch(deleteExhospitalAPI({ data: id, token })).unwrap();
  };

  return (
    <LookupPage
      pageTitle="المستشفيات"
      entitySingular="المستشفى"
      helmetTitle="External Hospitals"
      data={data}
      status={status}
      idKey="exHosp_id"
      nameKey="hospName"
      onFetch={fetchHospitals}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
