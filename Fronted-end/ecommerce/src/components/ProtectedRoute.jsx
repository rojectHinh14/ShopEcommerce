import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
export function ProtectedRoute({ children }) {
    const { auth } = useAuth()
    const location = useLocation()
  
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
  
    return children
  }
  
  
