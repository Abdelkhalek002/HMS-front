import React from 'react' ;
import "./AdminPage.css";
import AllAdminComponent from '../../Component/GroupAdmin/AllAdminComponent';

const AdminPage = () => {
  return (
    <div className='k-group-user-page'>
        <h2 className='title'>المسؤلين</h2>
        <AllAdminComponent />
    </div>
  )
}

export default AdminPage ; 
