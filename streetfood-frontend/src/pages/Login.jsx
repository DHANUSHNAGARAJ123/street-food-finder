import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaEye, FaEyeSlash, FaUtensils, FaStore,
  FaMapMarkerAlt, FaCheckCircle
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './AuthPages.css'

export default function Login() {
  const [tab,      setTab]      = useState('customer')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res  = await api.post('/api/auth/login', { email, password })
      const data = res.data
      login(data)
      if (data.role === 'ADMIN')  navigate('/admin')
      else if (data.role === 'VENDOR') navigate('/vendor/dashboard')
      else navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Live vendor tracking on interactive map',
    'Filter by cuisine, distance & budget',
    'Read genuine reviews from food lovers',
    'Save your favourite stalls'
  ]

  return (
    <div className="auth-page">

      {/* ── LEFT ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon"><FaMapMarkerAlt /></div>
            <span>Street Food Finder</span>
          </div>
          <h1 className="auth-tagline">
            Discover the Best<br />Street Food Near You
          </h1>
          <p className="auth-sub">
            Find authentic local flavours, track your favourites,
            and explore street food culture around you.
          </p>
          <div className="auth-features">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <FaCheckCircle className="feature-check" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          {/* Floating emojis */}
          <div className="auth-decor">
            {['🍜','🌮','🍛','🧆','🥙','🍢'].map((em, i) => (
              <div key={i} className="decor-emoji"
                style={{ animationDelay: `${i * 0.4}s` }}>
                {em}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="auth-right">
        <div className="auth-form-container animate-fadeIn">
          <h2 className="form-title">Welcome Back! 👋</h2>
          <p className="form-sub">Sign in to continue your food journey</p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'customer' ? 'active' : ''}`}
              onClick={() => setTab('customer')}
            >
              <FaUtensils /> Customer
            </button>
            <button
              className={`auth-tab ${tab === 'vendor' ? 'active' : ''}`}
              onClick={() => setTab('vendor')}
            >
              <FaStore /> Vendor / Admin
            </button>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="pass-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
            >
              {loading && <span className="btn-spinner" />}
              {loading ? 'Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>New here?</span></div>

          <div className="auth-register-links">
            <Link to="/register/customer" className="reg-link">
              <FaUtensils /> Register as Customer
            </Link>
            <Link to="/register/vendor" className="reg-link reg-link-outline">
              <FaStore /> Register as Vendor
            </Link>
          </div>

          {/* Demo accounts */}
          <div className="demo-accounts">
            <p className="demo-title">🎯 Demo Accounts (password = "password"):</p>
            <div className="demo-grid">
              <button className="demo-btn"
                onClick={() => { setEmail('customer@test.com'); setPassword('password') }}>
                👤 Customer
              </button>
              <button className="demo-btn"
                onClick={() => { setEmail('murugan@vendor.com'); setPassword('password') }}>
                🏪 Vendor
              </button>
              <button className="demo-btn"
                onClick={() => { setEmail('admin@streetfood.com'); setPassword('password') }}>
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}