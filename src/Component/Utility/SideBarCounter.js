import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice';
import { isMedicalCheckManagerRole } from '../../ActorType';
import BaseSidebar from './BaseSidebar.jsx';

const SideBarCounter = () => {
    const authData = useSelector(getUserInfo);
    const isMedical = isMedicalCheckManagerRole(authData?.payLoad?.role);
    const title = isMedical ? 'مسؤول الكشف الطبي' : 'المسؤول';
    const tabTitle = isMedical ? 'الكشف الطبي' : 'الكاونتر';
    const icon = isMedical ? 'medical_services' : 'desktop_windows';

    return (
        <BaseSidebar title={title} style={{ justifyContent: 'flex-start' }}>
            <NavLink end to='.' className='sidebar-tabs' title={tabTitle}>
                <span className="material-symbols-outlined">{icon}</span>
                <div className='tab-tilte hide-mobile'>{tabTitle}</div>
            </NavLink>
        </BaseSidebar>
    );
};

export default SideBarCounter;
