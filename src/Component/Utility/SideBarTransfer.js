import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { isExternalHospitalAdminRole } from '../../ActorType';
import BaseSidebar from './BaseSidebar.jsx';

const SideBarTransfer = () => {
    const authData = useSelector(getUserInfo);
    const isExHospitalAdmin = isExternalHospitalAdminRole(authData?.payLoad?.role);
    const title = isExHospitalAdmin ? 'أدمن مستشفى خارجي' : 'المسؤول';
    const tabTitle = isExHospitalAdmin ? 'المستشفيات الخارجية' : 'التحويلات';
    const icon = isExHospitalAdmin ? 'local_hospital' : 'move_up';

    return (
        <BaseSidebar title={title} style={{ justifyContent: 'flex-start' }}>
            <NavLink end to='.' className='sidebar-tabs' title={tabTitle}>
                <span className="material-symbols-outlined">{icon}</span>
                <div className='tab-tilte hide-mobile'>{tabTitle}</div>
            </NavLink>
        </BaseSidebar>
    );
};

export default SideBarTransfer;
