import React from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

const SharedComponentUser = () => {
  return (
    <main>
        <SideBar />

        <div className='all-content'>
            <Outlet />
        </div>
        
    </main>
  )
}

export default SharedComponentUser
