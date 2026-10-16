import React from 'react'
import "./Utility.css"
import Logo from "./../../images/Gemini_Generated_logoggggg-removebg-preview.png";
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import userPic from "./../../images/userProfile.jpg";
import { getUserProfile, getUserProfileAPi } from '../../RTK/User/UserSlice';
import { BASE_URL } from '../../API_Route/GlobalRoute';
import { useSidebar } from './SidebarContext';


const SideBar = () => {

    // For Sidebar collapse toggle
    const { isCollapsed, toggleSidebar } = useSidebar();

    // For Dispatch Action
    const dispatch = useDispatch();

    // For Change Route 
    const navigate = useNavigate();

    // For Logout
    const logoutHandler = () => {
        dispatch(logout())
        navigate("/login")
    }

    // For Access ID
    const data = useSelector(getUserInfo);


    // For Get Profile Pic 
    const userData = useSelector(getUserProfile);

    console.log(userData);


    console.log(data);


    return (
        <aside className={`side-bar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='top'>
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
                    <h4 className='sidebar-title hide-mobile'>المستخدم</h4>

                    <div className='all-tabs'>

                        <NavLink to={`.`} className='sidebar-tabs' title='حجز الكشف'>
                            <span className="material-symbols-outlined">
                                handshake
                            </span>
                            <div className='tab-tilte hide-mobile'>حجز الكشف</div>
                        </NavLink>

                        <NavLink to={`profile/${data.payLoad.userId}`} className='sidebar-tabs' title='الملف الشخصي'>
                            <span className="material-symbols-outlined">
                                account_circle
                            </span>
                            <div className='tab-tilte hide-mobile'> الملف الشخصي</div>
                        </NavLink>

                        <NavLink to={`changepassword`} className='sidebar-tabs' title='تغير كلمة المرور'>
                            <span className="material-symbols-outlined">
                                key
                            </span>
                            <div className='tab-tilte hide-mobile'>تغير كلمة المرور </div>
                        </NavLink>

                        <p onClick={logoutHandler} className='sidebar-tabs' title='تسجيل الخروج'>
                            <span className="material-symbols-outlined">
                                logout
                            </span>
                            <div className='tab-tilte hide-mobile'>  تسجيل الخروج</div>
                        </p>

                    </div>



                </div>
            </div>

            <Link to={`/profile/${data.payLoad.userId}`} className='bottom'>
                <div className='image'>
                    <div className='active-icon'></div>
                    <img
                        src={
                            (() => {
                                const photo = userData?.profile_photo_url;
                                return photo
                                    ? (photo.startsWith('http')
                                        ? photo
                                        : `${BASE_URL}/uploads/${photo.replace(/^\/+/, '')}`)
                                    : userPic;
                            })()
                        }
                        alt='profile'
                        loading='lazy'
                        onError={(e) => { e.target.src = userPic; }}
                    />
                </div>
                <div className='text'>
                    <h3>{userData.userName ? userData.userName.split(" ").slice(0, 3).join(" ") : ""}</h3>
                    <p>طالب</p>
                </div>
            </Link>

        </aside>
    )
}

export default SideBar
