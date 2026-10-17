import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
import { ADMIN_NAV_ITEMS } from '../../config/navigationConfig';
import BaseSidebar from './BaseSidebar.jsx';

const SideBarAdmin = () => {
    const { can } = usePermission();
    const visibleTabs = ADMIN_NAV_ITEMS.filter((item) => can(item.permission));

    return (
        <BaseSidebar title="المسؤول">
            {visibleTabs.map((item) => (
                <NavLink
                    key={item.path}
                    end={item.exact}
                    to={item.path}
                    className='sidebar-tabs'
                    title={item.title}
                >
                    <span className="material-symbols-outlined">
                        {item.icon}
                    </span>
                    <div className='tab-tilte hide-mobile'>{item.title}</div>
                </NavLink>
            ))}
        </BaseSidebar>
    );
};

export default SideBarAdmin;
