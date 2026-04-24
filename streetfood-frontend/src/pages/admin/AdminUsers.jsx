import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { AdminSidebar } from './AdminHome'
import { PageLoader } from '../../components/UIComponents'
import api from '../../api/axios'
import { FaTrash, FaSearch } from 'react-icons/fa'
import './Admin.css'

export default function AdminUsers() {
  const [users,   setUsers]   = useState([])
  const [search,  setSearch]  = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    await api.delete(`/api/admin/users/${id}`)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const roleBadge = (r) => ({
    ADMIN:    <span className="badge" style={{ background:'#1A1A2E', color:'white' }}>ADMIN</span>,
    VENDOR:   <span className="badge badge-pending">VENDOR</span>,
    CUSTOMER: <span className="badge badge-approved">CUSTOMER</span>,
  }[r] || r)

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-page-title">
            <h1>👥 Users</h1>
            <p>Manage all registered users</p>
          </div>

          {/* Search + Filter */}
          <div style={{ display:'flex', gap:12, marginBottom:20 }}>
            <div style={{
              flex:1, display:'flex', alignItems:'center', gap:10,
              background:'white', border:'2px solid #E5E7EB',
              borderRadius:10, padding:'0 14px',
              boxShadow:'0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <FaSearch style={{ color:'#9CA3AF' }} />
              <input
                style={{ flex:1, border:'none', outline:'none', padding:'12px 0', fontFamily:'inherit', fontSize:14, fontWeight:600 }}
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{
                padding:'12px 16px', border:'2px solid #E5E7EB',
                borderRadius:10, fontFamily:'inherit', fontSize:14,
                fontWeight:700, background:'white', cursor:'pointer'
              }}
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="VENDOR">Vendor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="admin-card">
            {loading ? <PageLoader /> : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{
                              width:32, height:32, borderRadius:8,
                              background:'linear-gradient(135deg,#FF6B35,#e85a26)',
                              color:'white', display:'flex', alignItems:'center',
                              justifyContent:'center', fontWeight:800, fontSize:13
                            }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <strong>{u.name}</strong>
                          </div>
                        </td>
                        <td style={{ color:'#6B7280' }}>{u.email}</td>
                        <td>{roleBadge(u.role)}</td>
                        <td style={{ color:'#6B7280' }}>{u.phone || '—'}</td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              style={{
                                width:34, height:34, borderRadius:8,
                                background:'#FEE2E2', color:'#EF4444',
                                border:'none', cursor:'pointer',
                                display:'flex', alignItems:'center',
                                justifyContent:'center', fontSize:13,
                                transition:'all 0.2s'
                              }}
                              onMouseEnter={e => e.target.style.background='#EF4444'}
                              onMouseLeave={e => e.target.style.background='#FEE2E2'}
                            >
                              <FaTrash />
                            </button>
                          )}
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