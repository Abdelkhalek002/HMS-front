import React from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'
import { useSidebar } from './SidebarContext'

const SharedComponentUser = () => {
  const { isCollapsed } = useSidebar();
  return (
    <main className={isCollapsed ? 'sidebar-collapsed' : ''}>
        <SideBar />

        <div className='all-content'>
            <Outlet />
        </div>
        
    </main>
  )
}

export default SharedComponentUser
