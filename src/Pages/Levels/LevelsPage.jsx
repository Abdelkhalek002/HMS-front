import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LookupPage from '../../Component/Common/LookupPage.jsx';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';
import {
  addNewLevelsAPI,
  deleteLevelsAPI,
  getAllLevelsAPI,
  updateLevelsAPI,
} from '../../RTK/Level/LevelSlice.js';

export default function LevelsPage() {
  const dispatch = useDispatch();
  const { data: level, status } = useSelector((state) => state.LevelSlice);
  const { token } = useSelector(getUserInfo);

  const fetchLevels = useCallback(() => {
    dispatch(getAllLevelsAPI());
  }, [dispatch]);

  const handleCreate = (levelName) => {
    return dispatch(addNewLevelsAPI({ data: { levelName }, token })).unwrap();
  };

  const handleUpdate = (id, levelName) => {
    return dispatch(updateLevelsAPI({ data: { id, levelName }, token })).unwrap();
  };

  const handleDelete = (id) => {
    return dispatch(deleteLevelsAPI({ data: id, token })).unwrap();
  };

  return (
    <LookupPage
      pageTitle="المراحل"
      entitySingular="المرحلة"
      helmetTitle="Levels"
      data={level}
      status={status}
      idKey="level_id"
      nameKey="levelName"
      onFetch={fetchLevels}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
