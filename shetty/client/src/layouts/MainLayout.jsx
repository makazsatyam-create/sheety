import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'
import BottomNav from '../components/navigation/BottomNav'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='h-screen icon-bg-colour flex flex-col lg:flex lg:flex-row overflow-hidden'>
      {/* Sidebar - Hidden on mobile, visible on lg+ */}
      <div className='hidden lg:flex w-[225px] h-screen bg-gray-950 border-r border-gray-800 overflow-y-auto flex-shrink-0'>
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className='fixed inset-0 bg-black/50 lg:hidden z-30'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-gray-950 border-r border-gray-800 
        transform transition-transform duration-300 z-40 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className='flex flex-col flex-1 min-w-0 h-screen overflow-hidden'>
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />

        {/* Main Content Area - min-w-0 prevents flex item from growing past viewport */}
        <main className='flex-1 min-w-0 overflow-y-auto overflow-x-hidden pb-20 lg:pb-0'>
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </div>
  )
}

export default MainLayout