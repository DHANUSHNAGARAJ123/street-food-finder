import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa'

export default function Profile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name,    setName]    = useState(user?.name || '')
  const [phone,   setPhone]   = useState('')
  const [success, setSuccess] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setSuccess('Profile updated! (Connect to API to save)')
    setEditing(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ maxWidth:640, margin:'0 auto', padding:'32px 24px' }}>
        <h1 style={{ fontSize:28, fontWeight:900, marginBottom:24 }}>
          👤 My Profile
        </h1>

        {success && (
          <div className="alert alert-success" style={{ marginBottom:20 }}>
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div style={{
          background:'white', borderRadius:16,
          padding:32, boxShadow:'0 4px 20px rgba(0,0,0,0.08)',
          marginBottom:20
        }}>
          {/* Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28 }}>
            <div style={{
              width:72, height:72, borderRadius:16,
              background:'linear-gradient(135deg,#FF6B35,#e85a26)',
              color:'white', display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:32, fontWeight:900
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800 }}>{user?.name}</div>
              <div style={{ color:'#9CA3AF', fontWeight:600 }}>{user?.email}</div>
              <span style={{
                display:'inline-block', marginTop:6,
                padding:'3px 12px', borderRadius:999,
                background: user?.role==='ADMIN' ? '#1A1A2E'
                  : user?.role==='VENDOR' ? '#FFF0EB' : '#DCFCE7',
                color: user?.role==='ADMIN' ? 'white'
                  : user?.role==='VENDOR' ? '#FF6B35' : '#22C55E',
                fontSize:12, fontWeight:800
              }}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Edit Form */}
          {editing ? (
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" value={name}
                  onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="9876543210" />
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" style={{
                  flex:1, padding:12, background:'#FF6B35',
                  color:'white', border:'none', borderRadius:10,
                  fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                  fontSize:15
                }}>
                  <FaSave /> Save Changes
                </button>
                <button type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    padding:'12px 20px', background:'#F3F4F6',
                    color:'#6B7280', border:'none', borderRadius:10,
                    fontWeight:700, cursor:'pointer', fontFamily:'inherit'
                  }}>
                  <FaTimes />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'12px 24px', background:'#FFF0EB',
                color:'#FF6B35', border:'2px solid #FF6B35',
                borderRadius:10, fontWeight:700, cursor:'pointer',
                fontFamily:'inherit', fontSize:14
              }}
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {/* Account Info */}
        <div style={{
          background:'white', borderRadius:16,
          padding:24, boxShadow:'0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontWeight:800, marginBottom:16 }}>Account Info</h3>
          {[
            { label:'Email',  val: user?.email },
            { label:'Role',   val: user?.role  },
            { label:'User ID',val: `#${user?.id}`},
          ].map(item => (
            <div key={item.label} style={{
              display:'flex', justifyContent:'space-between',
              padding:'12px 0',
              borderBottom:'1px solid #F3F4F6'
            }}>
              <span style={{ color:'#9CA3AF', fontWeight:600 }}>{item.label}</span>
              <span style={{ fontWeight:700 }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}