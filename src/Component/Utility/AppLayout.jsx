import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSidebar } from './SidebarContext';

export default function AppLayout({ sidebar: SidebarComponent }) {
  const { isCollapsed } = useSidebar();
  return (
    <main className={isCollapsed ? 'sidebar-collapsed' : ''}>
      {SidebarComponent && <SidebarComponent />}
      <div className='all-content'>
        <Outlet />
      </div>
    </main>
  );
}
