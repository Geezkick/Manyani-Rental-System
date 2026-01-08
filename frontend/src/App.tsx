import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import { SocketProvider } from './context/socketContext'
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
    <SocketProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
  )
}

export default App
