import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home            from './pages/Home'
import Login           from './pages/Login'
import RegisterCustomer from './pages/RegisterCustomer'
import RegisterVendor  from './pages/RegisterVendor'
import VendorDetail    from './pages/VendorDetail'
import Favorites       from './pages/Favorites'
import Profile         from './pages/Profile'
import VendorDashboard from './pages/vendor/VendorDashboard'
import AdminHome       from './pages/admin/AdminHome'
import AdminVendors    from './pages/admin/AdminVendors'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminReviews    from './pages/admin/AdminReviews'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/"                    element={<Home />} />
          <Route path="/vendor/:id"          element={<VendorDetail />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/register/customer"   element={<RegisterCustomer />} />
          <Route path="/register/vendor"     element={<RegisterVendor />} />

          {/* Customer Protected */}
          <Route path="/favorites" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Vendor Protected */}
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Protected */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="/admin/vendors" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminVendors />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminReviews />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}