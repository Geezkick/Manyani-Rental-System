import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import {
  Home,
  Building2,
  Calendar,
  CreditCard,
  Bell,
  MessageSquare,
  Wrench,
  User,
  Settings,
  Shield,
  LogOut,
  X,
  Globe,
  Sparkles
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, setLanguage } = useAuthStore()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Features', href: '/features', icon: Sparkles },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Communications', href: '/communications', icon: MessageSquare },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const getNavItems = () => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      return [...navigation, ...adminNavigation]
    }
    return navigation
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-manyani-brown rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Manyani
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {getNavItems().map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-manyani-brown text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Language selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  user?.language === 'en'
                    ? 'bg-manyani-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('sw')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  user?.language === 'sw'
                    ? 'bg-manyani-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Kiswahili
              </button>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex-shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.firstName}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-manyani-brown flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-manyani-maroon hover:bg-manyani-maroon/90 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-10 h-10 bg-manyani-brown rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Manyani
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Premium Rentals
              </p>
            </div>
          </div>

          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {getNavItems().map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-manyani-brown text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
              {/* Language selector */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Language
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                      user?.language === 'en'
                        ? 'bg-manyani-green text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('sw')}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                      user?.language === 'sw'
                        ? 'bg-manyani-green text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    SW
                  </button>
                </div>
              </div>

              {/* User profile */}
              <div className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex-shrink-0">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.firstName}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-manyani-brown flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
