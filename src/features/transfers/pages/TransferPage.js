import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EnhancedTable from '../components/TransferTable';
import { getAllExhospitalsAPI } from '../../lookups';

const TransferPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllExhospitalsAPI());
  }, [dispatch]);

  return (
    <section className="k-counter-page" style={{ padding: '24px' }}>
      <EnhancedTable />
    </section>
  );
};

export default TransferPage;
