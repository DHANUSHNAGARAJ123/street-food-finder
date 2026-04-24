import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { AdminSidebar } from './AdminHome'
import { PageLoader } from '../../components/UIComponents'
import api from '../../api/axios'
import './Admin.css'

export default function AdminVendors() {
  const [vendors,    setVendors]    = useState([])
  const [filter,     setFilter]     = useState('ALL')
  const [loading,    setLoading]    = useState(true)

  const fetchVendors = async (status) => {
    setLoading(true)
    try {
      const params = status !== 'ALL' ? { status } : {}
      const res = await api.get('/api/admin/vendors', { params })
      setVendors(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchVendors('ALL') }, [])

  const handleApprove = async (id) => {
    await api.put(`/api/admin/vendors/${id}/approve`)
    setVendors(prev => prev.map(v =>
      v.id === id ? { ...v, status:'APPROVED' } : v
    ))
  }

  const handleReject = async (id) => {
    await api.put(`/api/admin/vendors/${id}/reject`)
    setVendors(prev => prev.map(v =>
      v.id === id ? { ...v, status:'REJECTED' } : v
    ))
  }

  const statusBadge = (s) => ({
    APPROVED: <span className="badge badge-approved">Approved</span>,
    PENDING:  <span className="badge badge-pending">Pending</span>,
    REJECTED: <span className="badge badge-rejected">Rejected</span>,
  }[s] || s)

  const tabs = ['ALL','PENDING','APPROVED','REJECTED']

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-page-title">
            <h1>🏪 Vendors</h1>
            <p>Manage all vendor registrations</p>
          </div>

          {/* Filter tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {tabs.map(t => (
              <button key={t}
                className={`cat-filter-btn ${filter===t?'active':''}`}
                onClick={() => { setFilter(t); fetchVendors(t) }}
                style={{ padding:'8px 18px' }}
              >{t}</button>
            ))}
          </div>

          <div className="admin-card">
            {loading ? <PageLoader /> : vendors.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'#9CA3AF', fontWeight:600 }}>
                No vendors found
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Shop</th>
                      <th>Owner</th>
                      <th>City</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map(v => (
                      <tr key={v.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <img
                              src={v.photoUrl || 'https://via.placeholder.com/36'}
                              alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }}
                              onError={e => e.target.style.display='none'}
                            />
                            <strong>{v.shopName}</strong>
                          </div>
                        </td>
                        <td>{v.ownerName}</td>
                        <td>{v.city}</td>
                        <td style={{ maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {v.category}
                        </td>
                        <td>{v.priceRange}</td>
                        <td>{statusBadge(v.status)}</td>
                        <td>
                          {v.status === 'PENDING' && (
                            <div style={{ display:'flex', gap:6 }}>
                              <button className="admin-approve-btn"
                                onClick={() => handleApprove(v.id)}>✅</button>
                              <button className="admin-reject-btn"
                                onClick={() => handleReject(v.id)}>❌</button>
                            </div>
                          )}
                          {v.status === 'REJECTED' && (
                            <button className="admin-approve-btn"
                              onClick={() => handleApprove(v.id)}>Re-approve</button>
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