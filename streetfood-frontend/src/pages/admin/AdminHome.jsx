import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { PageLoader } from '../../components/UIComponents'
import {
  FaUsers, FaStore, FaClock, FaStar,
  FaShieldAlt, FaChartBar, FaTrash
} from 'react-icons/fa'
import './Admin.css'

export default function AdminHome() {
  const [stats,   setStats]   = useState(null)
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/vendors?status=PENDING')
    ]).then(([sRes, vRes]) => {
      setStats(sRes.data)
      setVendors(vRes.data.slice(0,5))
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <><Navbar /><PageLoader /></>

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-page-title">
            <h1>📊 Dashboard</h1>
            <p>Welcome back, Admin!</p>
          </div>

          {/* Stat cards */}
          <div className="admin-stats">
            {[
              { icon:'👥', label:'Total Users',       val: stats?.totalUsers    || 0, color:'#3B82F6', bg:'#EFF6FF' },
              { icon:'🏪', label:'Total Vendors',     val: stats?.totalVendors  || 0, color:'#22C55E', bg:'#F0FDF4' },
              { icon:'⏳', label:'Pending Approvals', val: stats?.pendingVendors|| 0, color:'#F59E0B', bg:'#FEF3C7' },
              { icon:'⭐', label:'Total Reviews',     val: stats?.totalReviews  || 0, color:'#EF4444', bg:'#FEE2E2' },
            ].map((s,i) => (
              <div key={i} className="admin-stat-card">
                <div className="asc-icon" style={{ background:s.bg, color:s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div className="asc-label">{s.label}</div>
                  <div className="asc-val">{s.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending vendors */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>⏳ Pending Vendor Approvals</h2>
              <Link to="/admin/vendors" className="admin-link">View All →</Link>
            </div>
            {vendors.length === 0 ? (
              <div style={{ padding:'20px 0', color:'#9CA3AF', textAlign:'center', fontWeight:600 }}>
                No pending approvals 🎉
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Shop Name</th>
                      <th>Owner</th>
                      <th>City</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map(v => (
                      <tr key={v.id}>
                        <td><strong>{v.shopName}</strong></td>
                        <td>{v.ownerName}</td>
                        <td>{v.city}</td>
                        <td>{v.category?.split(',')[0]}</td>
                        <td>
                          <div style={{ display:'flex', gap:8 }}>
                            <button className="admin-approve-btn"
                              onClick={async () => {
                                await api.put(`/api/admin/vendors/${v.id}/approve`)
                                setVendors(prev => prev.filter(x => x.id !== v.id))
                              }}>
                              ✅ Approve
                            </button>
                            <button className="admin-reject-btn"
                              onClick={async () => {
                                await api.put(`/api/admin/vendors/${v.id}/reject`)
                                setVendors(prev => prev.filter(x => x.id !== v.id))
                              }}>
                              ❌ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sidebar component (shared across admin pages)
export function AdminSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  const links = [
    { path:'/admin',          icon:'📊', label:'Dashboard'  },
    { path:'/admin/vendors',  icon:'🏪', label:'Vendors'    },
    { path:'/admin/users',    icon:'👥', label:'Users'      },
    { path:'/admin/reviews',  icon:'⭐', label:'Reviews'    },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <FaShieldAlt />
        <span>Admin Panel</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`sidebar-link ${location.pathname === l.path ? 'active' : ''}`}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={logout}>
        🚪 Logout
      </button>
    </div>
  )
}