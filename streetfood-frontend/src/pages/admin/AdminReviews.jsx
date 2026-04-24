import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { AdminSidebar } from './AdminHome'
import { PageLoader, RatingStars } from '../../components/UIComponents'
import api from '../../api/axios'
import { FaTrash } from 'react-icons/fa'
import './Admin.css'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/reviews')
      .then(res => setReviews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    await api.delete(`/api/admin/reviews/${id}`)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-page-title">
            <h1>⭐ Reviews</h1>
            <p>Manage all customer reviews — delete suspicious ones</p>
          </div>

          <div className="admin-card">
            {loading ? <PageLoader /> : reviews.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'#9CA3AF', fontWeight:600 }}>
                No reviews found
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Reviewer</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.vendorName}</strong></td>
                        <td>{r.customerName}</td>
                        <td><RatingStars rating={r.rating} size={12} /></td>
                        <td style={{
                          maxWidth:180, overflow:'hidden',
                          textOverflow:'ellipsis', whiteSpace:'nowrap',
                          color:'#6B7280', fontSize:13
                        }}>
                          {r.comment || '—'}
                        </td>
                        <td style={{ color:'#9CA3AF', fontSize:13 }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{
                              width:34, height:34, borderRadius:8,
                              background:'#FEE2E2', color:'#EF4444',
                              border:'none', cursor:'pointer',
                              display:'flex', alignItems:'center',
                              justifyContent:'center', fontSize:13,
                              transition:'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background='#EF4444'; e.currentTarget.style.color='white' }}
                            onMouseLeave={e => { e.currentTarget.style.background='#FEE2E2'; e.currentTarget.style.color='#EF4444' }}
                          >
                            <FaTrash />
                          </button>
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