import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

// ===== LIVE BADGE =====
export function LiveBadge({ isLive }) {
  return (
    <span className={`badge ${isLive ? 'badge-live' : 'badge-closed'}`}>
      <span style={{
        width: 7, height: 7,
        borderRadius: '50%',
        background: isLive ? '#22C55E' : '#9CA3AF',
        display: 'inline-block',
        animation: isLive ? 'pulse 1.5s infinite' : 'none'
      }} />
      {isLive ? 'LIVE' : 'CLOSED'}
    </span>
  )
}

// ===== RATING STARS (Display only) =====
export function RatingStars({ rating = 0, size = 14 }) {
  const stars = []
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  for (let i = 0; i < full; i++)
    stars.push(<FaStar key={`f${i}`} style={{ fontSize: size, color: '#F59E0B' }} />)
  if (half)
    stars.push(<FaStarHalfAlt key="h" style={{ fontSize: size, color: '#F59E0B' }} />)
  for (let i = 0; i < empty; i++)
    stars.push(<FaRegStar key={`e${i}`} style={{ fontSize: size, color: '#D1D5DB' }} />)

  return <div style={{ display: 'flex', gap: 2 }}>{stars}</div>
}

// ===== INTERACTIVE STAR RATING =====
export function StarRating({ value = 0, onChange, size = 30 }) {
  const [hovered, setHovered] = React.useState(0)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          style={{
            fontSize: size,
            color: star <= (hovered || value) ? '#F59E0B' : '#D1D5DB',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            transform: star <= (hovered || value) ? 'scale(1.2)' : 'scale(1)'
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange && onChange(star)}
        />
      ))}
    </div>
  )
}

// ===== LOADING SPINNER =====
export function LoadingSpinner({ size = 40, color = '#FF6B35' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid ${color}22`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  )
}

// ===== PAGE LOADER =====
export function PageLoader() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '60vh', gap: 16
    }}>
      <LoadingSpinner size={50} />
      <p style={{ color: '#6B7280', fontWeight: 600 }}>Loading...</p>
    </div>
  )
}

// ===== STAT CARD =====
export function StatCard({ icon, label, value, color = '#FF6B35', bg = '#FFF0EB' }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: 16,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E' }}>{value}</div>
      </div>
    </div>
  )
}