import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa'
import { LiveBadge, RatingStars } from './UIComponents'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './VendorCard.css'

export default function VendorCard({ vendor, isFavorited = false, onFavoriteToggle }) {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()
  const [fav, setFav]           = useState(isFavorited)
  const [favLoading, setFavLoading] = useState(false)

  const handleFavorite = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated || role !== 'CUSTOMER') {
      navigate('/login')
      return
    }
    setFavLoading(true)
    try {
      if (fav) {
        await api.delete(`/api/favorites/${vendor.id}`)
        setFav(false)
      } else {
        await api.post(`/api/favorites/${vendor.id}`)
        setFav(true)
      }
      if (onFavoriteToggle) onFavoriteToggle(vendor.id, !fav)
    } catch (err) {
      console.error(err)
    } finally {
      setFavLoading(false)
    }
  }

  const categories = vendor.category
    ? vendor.category.split(',').slice(0, 3)
    : []

  const priceSymbol = { BUDGET: '₹', MEDIUM: '₹₹', PREMIUM: '₹₹₹' }
  const price = priceSymbol[vendor.priceRange] || '₹'

  const formatTime = (time) => {
    if (!time) return '—'
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const h12  = hour % 12 || 12
    return `${h12}:${m} ${ampm}`
  }

  return (
    <div className="vendor-card" onClick={() => navigate(`/vendor/${vendor.id}`)}>

      {/* Image */}
      <div className="vendor-card-img">
        <img
          src={vendor.photoUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'}
          alt={vendor.shopName}
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'}
        />
        <div className="card-top-badges">
          <LiveBadge isLive={vendor.isLive || vendor.live} />
          {vendor.distance != null && (
            <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 11 }}>
              📍 {vendor.distance} km
            </span>
          )}
        </div>
        <button
          className={`fav-btn ${fav ? 'fav-active' : ''}`}
          onClick={handleFavorite}
          disabled={favLoading}
        >
          {fav ? <FaHeart /> : <FaRegHeart />}
        </button>
        <div className="price-tag">{price}</div>
      </div>

      {/* Body */}
      <div className="vendor-card-body">
        <div className="cat-pills">
          {categories.map(c => (
            <span key={c} className="cat-pill">{c.trim()}</span>
          ))}
        </div>

        <h3 className="vendor-card-name">{vendor.shopName}</h3>

        <div className="vendor-card-rating">
          <RatingStars rating={parseFloat(vendor.avgRating) || 0} />
          <span className="rating-num">
            {parseFloat(vendor.avgRating || 0).toFixed(1)}
          </span>
          <span className="review-count">({vendor.totalReviews})</span>
        </div>

        <div className="vendor-card-info">
          <div className="info-row">
            <FaMapMarkerAlt className="info-icon" />
            <span>{vendor.address || vendor.city || 'Erode'}</span>
          </div>
          <div className="info-row">
            <FaClock className="info-icon" />
            <span>{formatTime(vendor.openingTime)} – {formatTime(vendor.closingTime)}</span>
          </div>
        </div>

        <div className="vendor-card-actions">
          <button
            className="btn-view"
            onClick={e => { e.stopPropagation(); navigate(`/vendor/${vendor.id}`) }}
          >
            View Details
          </button>
          {vendor.ownerPhone && (
            
              href={`tel:${vendor.ownerPhone}`}
              className="btn-call"
              onClick={e => e.stopPropagation()}
            >
              <FaPhone />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}