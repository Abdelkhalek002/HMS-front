import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from "./../../images/Gemini_Generated_logoggggg-removebg-preview.png";
import { useDispatch } from 'react-redux';
import { logout } from '../../RTK/Auth/AuthSlice';
import { useSidebar } from './SidebarContext';
import { usePermission } from '../../hooks/usePermission';
import { ADMIN_NAV_ITEMS } from '../../config/navigationConfig';

const SideBarAdmin = () => {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { can } = usePermission();

    // Filter tabs dynamically based on user capabilities
    const visibleTabs = ADMIN_NAV_ITEMS.filter((item) => can(item.permission));

    // For Logout
    const logoutHandler = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <aside className={`side-bar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='sidebar-header'>
                <div className='logo logo-img hide-mobile'>
                    <img src={Logo} alt='logo' loading='lazy' className='logo-img' style={{ marginRight: "30px" }} />
                </div>

                <div 
                    className='menu' 
                    onClick={toggleSidebar} 
                    role='button' 
                    tabIndex={0} 
                    title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSidebar(); }}
                >
                    <span className="material-symbols-outlined">
                        menu
                    </span>
                </div>
            </div>

            <div className='sidebar-content'>
                <h4 className='sidebar-title hide-mobile'>المسؤول</h4>

                <div className='all-tabs'>
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

                    <p onClick={logoutHandler} className='sidebar-tabs' title='تسجيل الخروج'>
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <div className='tab-tilte hide-mobile'>تسجيل الخروج</div>
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default SideBarAdmin
