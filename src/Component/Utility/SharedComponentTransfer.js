import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarTransfer from './SideBarTransfer'

const SharedComponentTransfer = () => {
    return (
        <main>
            <SideBarTransfer />
    
            <div className='all-content'>
                <Outlet />
            </div>
            
        </main>
      )
}

export default SharedComponentTransfer
