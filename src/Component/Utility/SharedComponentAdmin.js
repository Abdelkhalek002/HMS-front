import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarAdmin from './SideBarAdmin'

const SharedComponentAdmin = () => {
  return (
    <main>
        <SideBarAdmin />

        <div className='all-content'>
            <Outlet />
        </div>
        
    </main>
  )
}

export default SharedComponentAdmin
