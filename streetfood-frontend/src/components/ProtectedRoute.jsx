import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 50, height: 50,
          border: '3px solid #FFF0EB',
          borderTop: '3px solid #FF6B35',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#6B7280', fontWeight: 600 }}>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        minHeight: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🚫</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Access Denied
        </h2>
        <p style={{ color: '#6B7280', marginBottom: 24, fontSize: 16 }}>
          You don't have permission to view this page.
        </p>
        <a href="/" style={{
          padding: '12px 28px', background: '#FF6B35',
          color: 'white', borderRadius: 10, fontWeight: 700,
          textDecoration: 'none', fontSize: 15
        }}>
          Go Home
        </a>
      </div>
    )
  }

  return children
}