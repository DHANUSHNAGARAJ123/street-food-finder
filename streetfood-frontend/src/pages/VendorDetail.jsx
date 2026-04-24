import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt, FaClock, FaStar, FaHeart, FaRegHeart,
  FaPhone, FaArrowLeft, FaUtensils
} from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { LiveBadge, RatingStars, StarRating, PageLoader } from '../components/UIComponents'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './VendorDetail.css'

export default function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, role, user } = useAuth()

  const [vendor,   setVendor]   = useState(null)
  const [menu,     setMenu]     = useState([])
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [fav,      setFav]      = useState(false)
  const [activeTab,setActiveTab]= useState('menu')
  const [menuTab,  setMenuTab]  = useState('All')

  // Review form
  const [myRating,  setMyRating]  = useState(0)
  const [myComment, setMyComment] = useState('')
  const [reviewed,  setReviewed]  = useState(false)
  const [submitting,setSubmitting]= useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, mRes, rRes] = await Promise.all([
          api.get(`/api/vendors/${id}`),
          api.get(`/api/vendors/${id}/menu`),
          api.get(`/api/vendors/${id}/reviews`)
        ])
        setVendor(vRes.data)
        setMenu(mRes.data)
        setReviews(rRes.data)
        if (isAuthenticated && role === 'CUSTOMER') {
          const checked = await api.get(`/api/favorites/check/${id}`)
          setFav(checked.data.favorited)
          setReviewed(rRes.data.some(r => r.customerId === user?.id))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isAuthenticated, role, user])

  const toggleFav = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      if (fav) { await api.delete(`/api/favorites/${id}`); setFav(false) }
      else      { await api.post(`/api/favorites/${id}`);  setFav(true)  }
    } catch (err) { console.error(err) }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!myRating) { setReviewMsg('Please select a rating'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/api/reviews', {
        vendorId: parseInt(id), rating: myRating, comment: myComment
      })
      setReviews(prev => [res.data, ...prev])
      setReviewed(true)
      setReviewMsg('✅ Review submitted!')
      setVendor(prev => ({
        ...prev,
        avgRating: res.data.avgRating || prev.avgRating,
        totalReviews: prev.totalReviews + 1
      }))
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (t) => {
    if (!t) return '—'
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const menuCategories = ['All', ...new Set(menu.map(i => i.category).filter(Boolean))]
  const filteredMenu = menuTab === 'All' ? menu : menu.filter(i => i.category === menuTab)

  // Rating breakdown
  const ratingBreakdown = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length
      ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100)
      : 0
  }))

  if (loading) return <><Navbar /><PageLoader /></>
  if (!vendor) return <><Navbar /><div style={{padding:40,textAlign:'center'}}>Vendor not found</div></>

  return (
    <div className="vd-page">
      <Navbar />

      {/* ── HERO ── */}
      <div className="vd-hero">
        <img
          src={vendor.photoUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
          alt={vendor.shopName}
          onError={e => e.target.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
        />
        <div className="vd-hero-overlay">
          <button className="vd-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <div className="vd-hero-info">
            <LiveBadge isLive={vendor.isLive || vendor.live} />
            <h1 className="vd-shop-name">{vendor.shopName}</h1>
          </div>
        </div>
      </div>

      <div className="vd-content">

        {/* ── INFO SECTION ── */}
        <div className="vd-info-card">
          <div className="vd-info-left">
            <div className="vd-rating-row">
              <RatingStars rating={parseFloat(vendor.avgRating)||0} size={18} />
              <span className="vd-rating-num">
                {parseFloat(vendor.avgRating||0).toFixed(1)}
              </span>
              <span className="vd-review-count">
                ({vendor.totalReviews} reviews)
              </span>
            </div>
            <div className="vd-details">
              <div className="vd-detail-item">
                <FaMapMarkerAlt className="vd-detail-icon" />
                <span>{vendor.address || vendor.city}</span>
              </div>
              <div className="vd-detail-item">
                <FaClock className="vd-detail-icon" />
                <span>
                  {formatTime(vendor.openingTime)} – {formatTime(vendor.closingTime)}
                </span>
              </div>
              {vendor.ownerPhone && (
                <div className="vd-detail-item">
                  <FaPhone className="vd-detail-icon" />
                  <span>{vendor.ownerPhone}</span>
                </div>
              )}
            </div>
            <div className="vd-tags">
              {vendor.category?.split(',').map(c => (
                <span key={c} className="vd-tag">{c.trim()}</span>
              ))}
              <span className="vd-price-tag">
                {vendor.priceRange === 'BUDGET' ? '₹'
                  : vendor.priceRange === 'MEDIUM' ? '₹₹' : '₹₹₹'}
              </span>
            </div>
          </div>
          <div className="vd-info-actions">
            <button className="vd-action-btn" onClick={toggleFav}>
              {fav ? <FaHeart style={{color:'#EF4444'}}/> : <FaRegHeart />}
              {fav ? 'Saved' : 'Save'}
            </button>
            
              href={`https://maps.google.com/?q=${vendor.lat},${vendor.lng}`}
              target="_blank"
              rel="noreferrer"
              className="vd-action-btn primary"
            >
              🗺️ Directions
            </a>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="tabs" style={{marginBottom:0}}>
          <button
            className={`tab-btn ${activeTab==='menu'?'active':''}`}
            onClick={() => setActiveTab('menu')}
          >🍽️ Menu</button>
          <button
            className={`tab-btn ${activeTab==='reviews'?'active':''}`}
            onClick={() => setActiveTab('reviews')}
          >⭐ Reviews ({reviews.length})</button>
          <button
            className={`tab-btn ${activeTab==='about'?'active':''}`}
            onClick={() => setActiveTab('about')}
          >ℹ️ About</button>
        </div>

        {/* ── MENU TAB ── */}
        {activeTab === 'menu' && (
          <div className="vd-section animate-fadeIn">
            {/* Category sub-tabs */}
            {menuCategories.length > 1 && (
              <div className="menu-cat-tabs">
                {menuCategories.map(c => (
                  <button
                    key={c}
                    className={`menu-cat-btn ${menuTab===c?'active':''}`}
                    onClick={() => setMenuTab(c)}
                  >{c}</button>
                ))}
              </div>
            )}

            {filteredMenu.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No menu items yet</h3>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredMenu.map(item => (
                  <div
                    key={item.id}
                    className={`menu-item-card ${!item.isAvailable ? 'unavailable' : ''}`}
                  >
                    <div className="menu-item-info">
                      <div className="menu-item-name">{item.name}</div>
                      {item.description && (
                        <div className="menu-item-desc">{item.description}</div>
                      )}
                      {item.category && (
                        <span className="menu-item-cat">{item.category}</span>
                      )}
                    </div>
                    <div className="menu-item-right">
                      <div className="menu-item-price">₹{item.price}</div>
                      {!item.isAvailable && (
                        <span className="unavail-tag">Unavailable</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === 'reviews' && (
          <div className="vd-section animate-fadeIn">
            {/* Rating summary */}
            <div className="review-summary">
              <div className="review-big-rating">
                <div className="big-rating-num">
                  {parseFloat(vendor.avgRating||0).toFixed(1)}
                </div>
                <RatingStars rating={parseFloat(vendor.avgRating)||0} size={20} />
                <div style={{color:'#9CA3AF',fontSize:14,fontWeight:600}}>
                  {vendor.totalReviews} reviews
                </div>
              </div>
              <div className="rating-breakdown">
                {ratingBreakdown.map(r => (
                  <div key={r.star} className="breakdown-row">
                    <span className="breakdown-star">{r.star}★</span>
                    <div className="breakdown-bar-bg">
                      <div
                        className="breakdown-bar-fill"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="breakdown-count">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review */}
            {isAuthenticated && role === 'CUSTOMER' && !reviewed && (
              <div className="write-review-card">
                <h3>Write a Review</h3>
                <form onSubmit={submitReview}>
                  <div style={{marginBottom:16}}>
                    <label style={{
                      display:'block',fontWeight:700,
                      marginBottom:10,fontSize:14
                    }}>
                      Your Rating
                    </label>
                    <StarRating value={myRating} onChange={setMyRating} />
                  </div>
                  <div className="form-group">
                    <label>Your Comment</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Share your experience..."
                      value={myComment}
                      onChange={e => setMyComment(e.target.value)}
                    />
                  </div>
                  {reviewMsg && (
                    <div className={`alert ${reviewMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}
                      style={{marginBottom:12}}>
                      {reviewMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn-submit-review"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : '⭐ Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Review list */}
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>No reviews yet</h3>
                <p>Be the first to review!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map(r => (
                  <div key={r.id} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">
                        {r.customerName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="review-meta">
                        <div className="review-name">{r.customerName}</div>
                        <div className="review-date">
                          {new Date(r.createdAt).toLocaleDateString('en-IN',{
                            year:'numeric', month:'short', day:'numeric'
                          })}
                        </div>
                      </div>
                      <RatingStars rating={r.rating} size={13} />
                    </div>
                    {r.comment && (
                      <p className="review-comment">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {activeTab === 'about' && (
          <div className="vd-section animate-fadeIn">
            <div className="about-card">
              <h3>About {vendor.shopName}</h3>
              <p>{vendor.description || 'No description provided.'}</p>
              <div className="about-grid">
                <div className="about-item">
                  <div className="about-label">Owner</div>
                  <div className="about-value">{vendor.ownerName}</div>
                </div>
                <div className="about-item">
                  <div className="about-label">City</div>
                  <div className="about-value">{vendor.city}</div>
                </div>
                <div className="about-item">
                  <div className="about-label">Opens</div>
                  <div className="about-value">{formatTime(vendor.openingTime)}</div>
                </div>
                <div className="about-item">
                  <div className="about-label">Closes</div>
                  <div className="about-value">{formatTime(vendor.closingTime)}</div>
                </div>
                <div className="about-item">
                  <div className="about-label">Price Range</div>
                  <div className="about-value">
                    {vendor.priceRange==='BUDGET'?'₹ Budget'
                      :vendor.priceRange==='MEDIUM'?'₹₹ Medium':'₹₹₹ Premium'}
                  </div>
                </div>
                <div className="about-item">
                  <div className="about-label">Status</div>
                  <div className="about-value">
                    <LiveBadge isLive={vendor.isLive || vendor.live} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}