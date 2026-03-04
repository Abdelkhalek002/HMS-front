import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarCounter from './SideBarCounter'

const SharedComponentCounter = () => {
    return (
        <main>
            <SideBarCounter />
    
            <div className='all-content'>
                <Outlet />
            </div>
            
        </main>
      )
}

export default SharedComponentCounter
