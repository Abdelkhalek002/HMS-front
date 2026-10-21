import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import { STAFF_NAV_ITEMS } from '../config/navigationConfig';
import BaseSidebar from './BaseSidebar.jsx';

const StaffSidebar = () => {
    const { can, isSuperAdmin, isObserver } = usePermission();
    const visibleTabs = STAFF_NAV_ITEMS.filter((item) => isSuperAdmin || can(item.permission));

    const sidebarTitle = isObserver ? 'الملاحظة والتدقيق' : 'لوحة التحكم';

    return (
        <BaseSidebar title={sidebarTitle}>
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

export default StaffSidebar;
