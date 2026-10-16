import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarTransfer from './SideBarTransfer'
import { useSidebar } from './SidebarContext'

const SharedComponentTransfer = () => {
    const { isCollapsed } = useSidebar();
    return (
        <main className={isCollapsed ? 'sidebar-collapsed' : ''}>
            <SideBarTransfer />
    
            <div className='all-content'>
                <Outlet />
            </div>
            
        </main>
      )
}

export default SharedComponentTransfer
