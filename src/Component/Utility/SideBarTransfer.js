import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from "./../../images/Gemini_Generated_logoggggg-removebg-preview.png";
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { isExternalHospitalAdminRole } from '../../ActorType';

const SideBarTransfer = () => {
 

    // For Change Navigation
    const navigate = useNavigate() ; 

    // For Dispatch Action
    const dispatch = useDispatch() ;
    const authData = useSelector(getUserInfo);
    const isExHospitalAdmin = isExternalHospitalAdminRole(authData?.payLoad?.role);
    
    // For Logout
    const logoutHandler = ()=>{
        dispatch(logout()) 
        navigate("/login")
    }

  

  return (
    <aside className='side-bar' style={{justifyContent : "flex-start"}}>
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
                
                <h4 className='sidebar-title hide-mobile'>{isExHospitalAdmin ? 'أدمن مستشفى خارجي' : 'المسؤل'}</h4>

                <div className='all-tabs'>
                
                <NavLink end to={`.`} className='sidebar-tabs'>
                    <span className="material-symbols-outlined">
                        {isExHospitalAdmin ? 'local_hospital' : 'move_up'}
                    </span>
                    <div className='tab-tilte hide-mobile'>{isExHospitalAdmin ? 'المستشفيات الخارجية' : 'التحويلات'}</div>
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

export default SideBarTransfer
