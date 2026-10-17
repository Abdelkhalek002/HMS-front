import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Logo from '../../images/Gemini_Generated_logoggggg-removebg-preview.png';
import { logout } from '../../RTK/Auth/AuthSlice';
import { useSidebar } from './SidebarContext';

export default function BaseSidebar({ title, children, footer, className = '', style }) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className={`side-bar ${isCollapsed ? 'collapsed' : ''} ${className}`} style={style}>
      <div className={footer ? 'top' : undefined}>
        <div className='sidebar-header'>
          <div className='logo logo-img hide-mobile'>
            <img src={Logo} alt='logo' loading='lazy' className='logo-img' style={{ marginRight: '30px' }} />
          </div>

          <div
            className='menu'
            onClick={toggleSidebar}
            role='button'
            tabIndex={0}
            title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleSidebar();
            }}
          >
            <span className="material-symbols-outlined">menu</span>
          </div>
        </div>

        <div className='sidebar-content'>
          {title && <h4 className='sidebar-title hide-mobile'>{title}</h4>}
          <div className='all-tabs'>
            {children}
            <p onClick={logoutHandler} className='sidebar-tabs' title='تسجيل الخروج'>
              <span className="material-symbols-outlined">logout</span>
              <div className='tab-tilte hide-mobile'>تسجيل الخروج</div>
            </p>
          </div>
        </div>
      </div>

      {footer}
    </aside>
  );
}
