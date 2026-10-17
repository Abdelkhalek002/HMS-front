import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LookupPage from '../components/LookupPage.jsx';
import { getUserInfo } from '../../../RTK/Auth/AuthSlice.js';
import {
  addNewClinicsAPI,
  deleteClinicsAPI,
  getAllClinicsAPI,
  updateClinicsAPI,
} from '../../../RTK/Clinic/ClinicSlice';

export default function ClinicsPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.ClinicSlice);
  const { token } = useSelector(getUserInfo);

  const fetchClinics = useCallback(() => {
    dispatch(getAllClinicsAPI({ token }));
  }, [dispatch, token]);

  const handleCreate = (clinicName) => {
    return dispatch(addNewClinicsAPI({ data: { clinicName }, token })).unwrap();
  };

  const handleUpdate = (id, clinicName) => {
    return dispatch(updateClinicsAPI({ data: { id, clinicName }, token })).unwrap();
  };

  const handleDelete = (id) => {
    return dispatch(deleteClinicsAPI({ data: id, token })).unwrap();
  };

  return (
    <LookupPage
      pageTitle="العيادات"
      entitySingular="العيادة"
      helmetTitle="Clinics"
      data={data}
      status={status}
      idKey="clinic_id"
      nameKey="clinicName"
      onFetch={fetchClinics}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
