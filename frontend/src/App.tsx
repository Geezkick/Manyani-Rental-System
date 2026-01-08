import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import { SocketProvider } from './context/socketContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Properties from './pages/properties/Properties'
import PropertyDetails from './pages/properties/PropertyDetails'
import Bookings from './pages/bookings/Bookings'
import Payments from './pages/payments/Payments'
import Alerts from './pages/alerts/Alerts'
import Communications from './pages/communications/Communications'
import Profile from './pages/profile/Profile'
import Maintenance from './pages/maintenance/Maintenance'
import AdminDashboard from './pages/admin/AdminDashboard'
import Features from './pages/Features'
import './styles/globals.css'

function App() {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-manyani-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-manyani-brown border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-manyani-brown font-medium">Loading Manyani...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.846-.833-2.616 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Application Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    }>
      <SocketProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </SocketProvider>
    </ErrorBoundary>
  )
}

export default App
