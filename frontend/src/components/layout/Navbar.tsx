import React, { useState } from 'react'
import { Bell, Menu, Search, Moon, Sun, Plus, Zap } from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface NavbarProps {
  onMenuClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      toast.success(`Searching for: ${searchQuery}`)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleQuickPay = () => {
    // Navigate to features page with quick pay tab
    navigate('/features')
    toast.success('Opening Quick Pay')
  }

  const handleNewBooking = () => {
    // Navigate to features page with new booking tab
    navigate('/features')
    toast.success('Opening New Booking')
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="ml-4 hidden md:block">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 pr-4 py-2 w-64 lg:w-80"
                  placeholder="Search properties, payments, alerts..."
                />
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => toast('Notifications feature coming soon!')}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Quick actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={handleQuickPay}
                className="btn-outline text-sm px-4 py-2 flex items-center"
              >
                <Zap className="h-4 w-4 mr-1" />
                Quick Pay
              </button>
              <button 
                onClick={handleNewBooking}
                className="btn-primary text-sm px-4 py-2 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Booking
              </button>
            </div>

            {/* User avatar (mobile) */}
            <div className="md:hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-manyani-brown flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.firstName?.[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="py-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 pr-4 py-2 w-full"
                placeholder="Search..."
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
