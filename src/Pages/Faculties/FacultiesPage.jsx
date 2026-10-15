import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LookupPage from '../../Component/Common/LookupPage.jsx';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';
import {
  addNewFacultyAPI,
  deleteFacultyAPI,
  getAllFacultiesAPI,
  updateFacultyAPI,
} from '../../RTK/Faculty/FacultySlice.js';

export default function FacultiesPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.FacultySlice);
  const { token } = useSelector(getUserInfo);

  const fetchFaculties = useCallback(() => {
    dispatch(getAllFacultiesAPI());
  }, [dispatch]);

  const handleCreate = (facultyName) => {
    return dispatch(addNewFacultyAPI({ data: { facultyName }, token })).unwrap();
  };

  const handleUpdate = (id, facultyName) => {
    return dispatch(updateFacultyAPI({ data: { id, facultyName }, token })).unwrap();
  };

  const handleDelete = (id) => {
    return dispatch(deleteFacultyAPI({ data: id, token })).unwrap();
  };

  return (
    <LookupPage
      pageTitle="الكليات"
      entitySingular="الكلية"
      helmetTitle="Faculties"
      data={data}
      status={status}
      idKey="faculty_id"
      nameKey="facultyName"
      onFetch={fetchFaculties}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
