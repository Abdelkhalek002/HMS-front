import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarCounter from './SideBarCounter'
import { useSidebar } from './SidebarContext'

const SharedComponentCounter = () => {
    const { isCollapsed } = useSidebar();
    return (
        <main className={isCollapsed ? 'sidebar-collapsed' : ''}>
            <SideBarCounter />
    
            <div className='all-content'>
                <Outlet />
            </div>
            
        </main>
      )
}

export default SharedComponentCounter
