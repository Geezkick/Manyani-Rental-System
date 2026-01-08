import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useAuthStore } from '../../context/authStore'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Welcome banner */}
            <div className="mb-8 manyani-gradient-bg rounded-2xl p-6 text-white shadow-manyani-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName}!
                  </h1>
                  <p className="text-white/90">
                    Manage your rentals, payments, and community interactions in one place.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">System Status: Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page content */}
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-manyani-brown rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Manyani
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Premium Rental Management System
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Manyani Rentals. All rights reserved.</p>
                <p className="mt-1">
                  Theme: <span className="font-medium">Brown • Green • White • Maroon</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout
