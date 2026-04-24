import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FaMapMarkerAlt, FaSearch, FaHeart, FaSignOutAlt,
  FaStore, FaShieldAlt, FaBars, FaTimes, FaChevronDown,
  FaLocationArrow, FaUtensils, FaUser
} from 'react-icons/fa'
import './Navbar.css'

export default function Navbar({ onSearch, onLocation }) {
  const { isAuthenticated, user, role, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen,         setMenuOpen]         = useState(false)
  const [userDropdown,     setUserDropdown]     = useState(false)
  const [registerDropdown, setRegisterDropdown] = useState(false)
  const [searchVal,        setSearchVal]        = useState('')
  const [scrolled,         setScrolled]         = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOut = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setUserDropdown(false)
        setRegisterDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOut)
    return () => document.removeEventListener('mousedown', onClickOut)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(searchVal)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isHome = location.pathname === '/'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* ── Logo ── */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"><FaMapMarkerAlt /></div>
          <div className="logo-text">
            <span className="logo-name">Street Food</span>
            <span className="logo-sub">Finder</span>
          </div>
        </Link>

        {/* ── Search (Home page only) ── */}
        {isHome && (
          <form className="navbar-search" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search city or food..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="location-btn"
              onClick={onLocation}
              title="Use My Location"
            >
              <FaLocationArrow />
            </button>
          </form>
        )}

        {/* ── Desktop Nav ── */}
        <div className="navbar-actions" ref={dropRef}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>

              {/* Register Dropdown */}
              <div className="dropdown-wrap">
                <button
                  className="btn-nav-primary"
                  onClick={() => setRegisterDropdown(!registerDropdown)}
                >
                  Register <FaChevronDown style={{ fontSize: 11 }} />
                </button>
                {registerDropdown && (
                  <div className="dropdown-menu animate-scaleIn">
                    <Link
                      to="/register/customer"
                      className="dropdown-item"
                      onClick={() => setRegisterDropdown(false)}
                    >
                      <div className="drop-icon-wrap"><FaUtensils /></div>
                      <div>
                        <div className="drop-title">As Customer</div>
                        <div className="drop-sub">Discover street food</div>
                      </div>
                    </Link>
                    <Link
                      to="/register/vendor"
                      className="dropdown-item"
                      onClick={() => setRegisterDropdown(false)}
                    >
                      <div className="drop-icon-wrap"><FaStore /></div>
                      <div>
                        <div className="drop-title">As Vendor</div>
                        <div className="drop-sub">List your food stall</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {role === 'CUSTOMER' && (
                <Link to="/favorites" className="nav-icon-btn" title="Favorites">
                  <FaHeart />
                </Link>
              )}
              {role === 'VENDOR' && (
                <Link to="/vendor/dashboard" className="nav-link">
                  <FaStore /> My Shop
                </Link>
              )}
              {role === 'ADMIN' && (
                <Link to="/admin" className="nav-link">
                  <FaShieldAlt /> Admin
                </Link>
              )}

              {/* User Dropdown */}
              <div className="dropdown-wrap">
                <button
                  className="user-btn"
                  onClick={() => setUserDropdown(!userDropdown)}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-nav">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <FaChevronDown style={{ fontSize: 10 }} />
                </button>

                {userDropdown && (
                  <div className="dropdown-menu dropdown-right animate-scaleIn">
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          {user?.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <hr style={{ border:'none', borderTop:'1px solid #F3F4F6', margin:'8px 0' }} />
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <div className="drop-icon-wrap"><FaUser /></div>
                      <div className="drop-title">My Profile</div>
                    </Link>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <div className="drop-icon-wrap"><FaSignOutAlt /></div>
                      <div className="drop-title">Logout</div>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Hamburger ── */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="mobile-menu animate-fadeIn">
          {isHome && (
            <form className="mobile-search" onSubmit={handleSearch}>
              <FaSearch style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search city or food..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
            </form>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login"             className="mobile-link" onClick={() => setMenuOpen(false)}>🔑 Login</Link>
              <Link to="/register/customer" className="mobile-link" onClick={() => setMenuOpen(false)}>🍜 Register as Customer</Link>
              <Link to="/register/vendor"   className="mobile-link" onClick={() => setMenuOpen(false)}>🏪 Register as Vendor</Link>
            </>
          ) : (
            <>
              {role === 'CUSTOMER' && <Link to="/favorites"        className="mobile-link" onClick={() => setMenuOpen(false)}>❤️ Favorites</Link>}
              {role === 'VENDOR'   && <Link to="/vendor/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>🏪 My Shop</Link>}
              {role === 'ADMIN'    && <Link to="/admin"            className="mobile-link" onClick={() => setMenuOpen(false)}>🛡️ Admin Panel</Link>}
              <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <button className="mobile-link logout-mobile" onClick={handleLogout}>🚪 Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}