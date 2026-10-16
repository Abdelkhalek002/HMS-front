import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarAdmin from './SideBarAdmin'
import { useSidebar } from './SidebarContext'

const SharedComponentAdmin = () => {
  const { isCollapsed } = useSidebar();
  return (
    <main className={isCollapsed ? 'sidebar-collapsed' : ''}>
        <SideBarAdmin />

        <div className='all-content'>
            <Outlet />
        </div>
        
    </main>
  )
}

export default SharedComponentAdmin
