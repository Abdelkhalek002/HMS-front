import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from "./../../images/Gemini_Generated_logoggggg-removebg-preview.png";
import { useDispatch } from 'react-redux';
import { logout } from '../../RTK/Auth/AuthSlice';

const SideBarAdmin = () => {


    // For Change Navigation
    const navigate = useNavigate() ; 

    // For Dispatch Action
    const dispatch = useDispatch() ;
    
    // For Logout
    const logoutHandler = ()=>{
        dispatch(logout()) 
        navigate("/login")
    }

  return (
    <aside className='side-bar'>
            <div className='sidebar-header hide-mobile'>
                <div className='logo logo-img'>
                    <img src={Logo} alt='logo' loading='lazy' className='logo-img' style={{ marginRight: "30px" }} />
                </div>

                <div className='menu'>
                    <span className="material-symbols-outlined">
                        menu
                    </span>
                </div>
            </div>

            <div className='sidebar-content'>
                
                <h4 className='sidebar-title hide-mobile'>المسؤل</h4>

                <div className='all-tabs'>
                
                    <NavLink end to={`.`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            desktop_windows
                        </span>
                        <div className='tab-tilte hide-mobile'>الكاونتر</div>
                    </NavLink>

                    <NavLink end to={`transfer`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                        move_up
                        </span>
                        <div className='tab-tilte hide-mobile'>تحويلات</div>
                    </NavLink>

                    <NavLink to={`admins`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        <div className='tab-tilte hide-mobile'>الادمن</div>
                    </NavLink>
                    <NavLink to={`allusers`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        <div className='tab-tilte hide-mobile'>المستخدمين</div>
                    </NavLink>
                    <NavLink to={`history`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            history
                        </span>
                        <div className='tab-tilte hide-mobile'>السجل</div>
                    </NavLink>
                    <NavLink to={`levels`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            school
                        </span>
                        <div className='tab-tilte hide-mobile'>المراحل التعليمية</div>
                    </NavLink>


                    <NavLink to={`clinics`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            monitor_heart
                        </span>
                        <div className='tab-tilte hide-mobile'>العيادات</div>
                    </NavLink>

                    <NavLink to={`faculties`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            school
                        </span>
                        <div className='tab-tilte hide-mobile'>الكليات</div>
                    </NavLink>

                    <NavLink to={`exhospital`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            local_hospital
                        </span>
                        <div className='tab-tilte hide-mobile'>المستشفيات الخارجية</div>
                    </NavLink>

                    <NavLink to={`governorates`} className='sidebar-tabs'>
                        <span className="material-symbols-outlined">
                            location_city
                        </span>
                        <div className='tab-tilte hide-mobile'>المحافظات</div>
                    </NavLink>

                    <p onClick={logoutHandler} className='sidebar-tabs'>
                        <span class="material-symbols-outlined">
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
