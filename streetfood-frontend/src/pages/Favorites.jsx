import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import VendorCard from '../components/VendorCard'
import { PageLoader } from '../components/UIComponents'
import api from '../api/axios'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    api.get('/api/favorites')
      .then(res => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = (vendorId) => {
    setFavorites(prev => prev.filter(v => v.id !== vendorId))
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:28, fontWeight:900, color:'#1A1A2E' }}>
            ❤️ My Favourites
          </h1>
          <p style={{ color:'#6B7280', marginTop:6, fontWeight:500 }}>
            Your saved street food vendors
          </p>
        </div>

        {loading ? (
          <PageLoader />
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <h3>No favourites yet</h3>
            <p>Start saving vendors you love!</p>
            <a href="/" style={{
              display:'inline-block', marginTop:20,
              padding:'12px 28px', background:'#FF6B35',
              color:'white', borderRadius:10, fontWeight:700
            }}>
              Explore Vendors
            </a>
          </div>
        ) : (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))',
            gap:20
          }}>
            {favorites.map(v => (
              <VendorCard
                key={v.id}
                vendor={v}
                isFavorited={true}
                onFavoriteToggle={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}