import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-manyani-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-manyani-brown border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-manyani-brown font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
