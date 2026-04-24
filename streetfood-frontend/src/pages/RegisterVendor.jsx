import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaMapMarkerAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './AuthPages.css'

const getStrength = p => !p.length ? 0 : p.length < 6 ? 1 : p.length < 10 ? 2 : 3
const strengthLabel = ['','Weak','Medium','Strong']
const strengthClass = ['','weak','medium','strong']
const strengthColor = ['','#EF4444','#F59E0B','#22C55E']

export default function RegisterVendor() {
  const [form, setForm] = useState({
    name:'', email:'', phone:'', password:'', confirm:''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [agreed,   setAgreed]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()
  const strength  = getStrength(form.password)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (!agreed) { setError('Please agree to the terms'); return }
    setLoading(true); setError('')
    try {
      const res = await api.post('/api/auth/register-vendor', {
        name: form.name, email: form.email,
        phone: form.phone, password: form.password
      })
      login(res.data)
      navigate('/vendor/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data || 'Registration failed'
      )
    } finally { setLoading(false) }
  }

  const benefits = [
    { icon:'📍', title:'Get Discovered',  desc:'Customers find you on the map'       },
    { icon:'🟢', title:'Go Live Anytime', desc:'Toggle live status instantly'         },
    { icon:'📋', title:'Manage Menu',     desc:'Add, edit, remove items easily'       },
    { icon:'⭐', title:'Build Reputation',desc:'Collect reviews and grow your business'},
  ]

  return (
    <div className="auth-page">
      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon"><FaMapMarkerAlt /></div>
            <span>Street Food Finder</span>
          </div>
          <h1 className="auth-tagline">List Your<br />Food Stall 🏪</h1>
          <p className="auth-sub">
            Reach hundreds of hungry customers near you.
            Register your stall and start selling today.
          </p>
          <div className="register-benefits">
            {benefits.map((b,i) => (
              <div key={i} className="benefit-item">
                <div className="benefit-icon-wrap">{b.icon}</div>
                <div className="benefit-text">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="auth-decor">
            {['🏪','🍜','🌮','🍛','🧆','🥙'].map((em,i) => (
              <div key={i} className="decor-emoji"
                style={{ animationDelay:`${i*0.4}s` }}>{em}</div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-form-container animate-fadeIn">
          <h2 className="form-title">Register Your Stall 🚀</h2>
          <p className="form-sub">Start reaching hungry customers today</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom:16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" type="text" className="form-control"
                placeholder="Murugan Selvan" value={form.name}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" className="form-control"
                placeholder="murugan@example.com" value={form.email}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" type="tel" className="form-control"
                placeholder="9876543210" value={form.phone}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="pass-wrap">
                <input name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange} required />
                <button type="button" className="pass-toggle"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="strength-bar">
                    {[1,2,3].map(i => (
                      <div key={i}
                        className={`strength-segment ${i <= strength ? strengthClass[strength] : ''}`}
                      />
                    ))}
                  </div>
                  <div className="strength-label"
                    style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </div>
                </>
              )}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirm" type="password" className="form-control"
                placeholder="Re-enter password" value={form.confirm}
                onChange={handleChange} required />
            </div>

            <label style={{
              display:'flex', alignItems:'center', gap:10,
              cursor:'pointer', fontSize:14, fontWeight:600, color:'#1A1A2E'
            }}>
              <input type="checkbox" checked={agreed}
                onChange={e => setAgreed(e.target.checked)} />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading && <span className="btn-spinner" />}
              {loading ? 'Registering...' : '🏪 Register Stall'}
            </button>
          </form>

          <div className="back-to-login">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}