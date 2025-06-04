import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
    const { auth } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
      if (!auth.isAuthenticated) {
        navigate("/login", { state: { from: location }, replace: true })
      }
    }, [auth.isAuthenticated, navigate, location])

    if (!auth.isAuthenticated) {
      return null
    }
  
    return children
  }
  
  
