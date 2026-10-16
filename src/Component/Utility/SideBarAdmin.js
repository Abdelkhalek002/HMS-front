import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from "./../../images/Gemini_Generated_logoggggg-removebg-preview.png";
import { useDispatch } from 'react-redux';
import { logout } from '../../RTK/Auth/AuthSlice';
import { useSidebar } from './SidebarContext';

const SideBarAdmin = () => {

    const { isCollapsed, toggleSidebar } = useSidebar();

    // For Change Navigation
    const navigate = useNavigate();

    // For Dispatch Action
    const dispatch = useDispatch();

    // For Logout
    const logoutHandler = () => {
        dispatch(logout())
        navigate("/login")
    }

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

                    <NavLink end to={`.`} className='sidebar-tabs' title='الكاونتر'>
                        <span className="material-symbols-outlined">
                            desktop_windows
                        </span>
                        <div className='tab-tilte hide-mobile'>الكاونتر</div>
                    </NavLink>

                    <NavLink end to={`transfer`} className='sidebar-tabs' title='تحويلات'>
                        <span className="material-symbols-outlined">
                            move_up
                        </span>
                        <div className='tab-tilte hide-mobile'>تحويلات</div>
                    </NavLink>

                    <NavLink to={`admins`} className='sidebar-tabs' title='المسؤولين'>
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        <div className='tab-tilte hide-mobile'>المسؤولين</div>
                    </NavLink>
                    <NavLink to={`allusers`} className='sidebar-tabs' title='المستخدمين'>
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        <div className='tab-tilte hide-mobile'>المستخدمين</div>
                    </NavLink>
                    <NavLink to={`history`} className='sidebar-tabs' title='السجل'>
                        <span className="material-symbols-outlined">
                            history
                        </span>
                        <div className='tab-tilte hide-mobile'>السجل</div>
                    </NavLink>
                    <NavLink to={`levels`} className='sidebar-tabs' title='المراحل التعليمية'>
                        <span className="material-symbols-outlined">
                            school
                        </span>
                        <div className='tab-tilte hide-mobile'>المراحل التعليمية</div>
                    </NavLink>


                    <NavLink to={`clinics`} className='sidebar-tabs' title='العيادات'>
                        <span className="material-symbols-outlined">
                            monitor_heart
                        </span>
                        <div className='tab-tilte hide-mobile'>العيادات</div>
                    </NavLink>

                    <NavLink to={`faculties`} className='sidebar-tabs' title='الكليات'>
                        <span className="material-symbols-outlined">
                            school
                        </span>
                        <div className='tab-tilte hide-mobile'>الكليات</div>
                    </NavLink>

                    <NavLink to={`exhospital`} className='sidebar-tabs' title='المستشفيات الخارجية'>
                        <span className="material-symbols-outlined">
                            local_hospital
                        </span>
                        <div className='tab-tilte hide-mobile'>المستشفيات الخارجية</div>
                    </NavLink>

                    <NavLink to={`governorates`} className='sidebar-tabs' title='المحافظات'>
                        <span className="material-symbols-outlined">
                            location_city
                        </span>
                        <div className='tab-tilte hide-mobile'>المحافظات</div>
                    </NavLink>

                    <p onClick={logoutHandler} className='sidebar-tabs' title='تسجيل الخروج'>
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <div className='tab-tilte hide-mobile'>  تسجيل الخروج</div>
                    </p>

                </div>


            </div>

        </aside>
    )
}

export default SideBarAdmin
