import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import VendorCard from '../components/VendorCard'
import { LiveBadge, PageLoader } from '../components/UIComponents'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import {
  FaSearch, FaFilter, FaTimes, FaSlidersH,
  FaLocationArrow, FaThLarge, FaList
} from 'react-icons/fa'
import './Home.css'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Orange custom marker
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
  popupAnchor: [1, -34], shadowSize: [41, 41]
})

// Fly to location helper
function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.5 })
  }, [center, map])
  return null
}

const CATEGORIES = ['All','Idli/Dosa','Biryani','Parota','Juice','Snacks','Bajji']

export default function Home() {
  const navigate = useNavigate()
  const [vendors,    setVendors]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [category,   setCategory]   = useState('All')
  const [sort,       setSort]       = useState('nearest')
  const [liveOnly,   setLiveOnly]   = useState(false)
  const [priceRange, setPriceRange] = useState('')
  const [mapCenter,  setMapCenter]  = useState([11.341, 77.727])
  const [userPos,    setUserPos]    = useState(null)
  const [viewMode,   setViewMode]   = useState('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page,       setPage]       = useState(1)
  const PER_PAGE = 6

  const fetchVendors = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const res = await api.get('/api/vendors', { params })
      setVendors(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchVendors({ city: 'Erode' }) }, [fetchVendors])

  const handleSearch = (val) => {
    const city = val || searchCity
    setSearchCity(city)
    setPage(1)
    fetchVendors({
      city,
      category: category !== 'All' ? category : undefined,
      live: liveOnly || undefined,
      priceRange: priceRange || undefined,
      sort
    })
  }

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      setUserPos([lat, lng])
      setMapCenter([lat, lng])
      setPage(1)
      fetchVendors({ lat, lng, radius: 5, sort })
    }, () => alert('Location access denied'))
  }

  const handleApplyFilter = () => {
    setFilterOpen(false)
    setPage(1)
    fetchVendors({
      city: searchCity || 'Erode',
      category: category !== 'All' ? category : undefined,
      live: liveOnly || undefined,
      priceRange: priceRange || undefined,
      sort
    })
  }

  const handleClearFilter = () => {
    setLiveOnly(false); setPriceRange(''); setCategory('All'); setSort('nearest')
    setPage(1)
    fetchVendors({ city: 'Erode' })
  }

  // Pagination
  const filteredVendors = vendors
  const totalPages = Math.ceil(filteredVendors.length / PER_PAGE)
  const pagedVendors = filteredVendors.slice((page-1)*PER_PAGE, page*PER_PAGE)

  return (
    <div className="home-page">
      <Navbar onSearch={handleSearch} onLocation={handleLocation} />

      <div className="home-layout">
        {/* ── LEFT: Vendor List ── */}
        <div className="vendors-panel">

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="cat-scroll">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`cat-filter-btn ${category === c ? 'active' : ''}`}
                  onClick={() => { setCategory(c); setPage(1) }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="filter-controls">
              <select
                className="sort-select"
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}
              >
                <option value="nearest">📍 Nearest</option>
                <option value="rating">⭐ Top Rated</option>
                <option value="reviews">💬 Most Reviewed</option>
                <option value="newest">🆕 Newest</option>
              </select>
              <button
                className={`filter-btn ${filterOpen ? 'active' : ''}`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FaSlidersH /> Filters
              </button>
              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                ><FaThLarge /></button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                ><FaList /></button>
              </div>
            </div>
          </div>

          {/* Active filters tags */}
          {(liveOnly || priceRange || category !== 'All') && (
            <div className="active-filters">
              {liveOnly && (
                <span className="filter-tag">
                  🟢 Live Only
                  <FaTimes onClick={() => setLiveOnly(false)} />
                </span>
              )}
              {priceRange && (
                <span className="filter-tag">
                  💰 {priceRange}
                  <FaTimes onClick={() => setPriceRange('')} />
                </span>
              )}
              {category !== 'All' && (
                <span className="filter-tag">
                  🍽️ {category}
                  <FaTimes onClick={() => setCategory('All')} />
                </span>
              )}
              <button className="clear-filters" onClick={handleClearFilter}>
                Clear All
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="vendors-heading">
            <h2>
              Street Food Vendors
              <span className="vendor-count"> ({vendors.length})</span>
            </h2>
          </div>

          {/* Vendor Grid/List */}
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton" style={{ height:185 }} />
                  <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
                    <div className="skeleton" style={{ height:16, width:'60%' }} />
                    <div className="skeleton" style={{ height:12, width:'80%' }} />
                    <div className="skeleton" style={{ height:12, width:'50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : pagedVendors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍜</div>
              <h3>No vendors found</h3>
              <p>Try searching a different city or clearing filters</p>
            </div>
          ) : (
            <div className={`vendors-grid ${viewMode === 'list' ? 'list-mode' : ''}`}>
              {pagedVendors.map(v => (
                <VendorCard key={v.id} vendor={v} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >‹</button>
              {[...Array(totalPages)].map((_,i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i+1 ? 'active' : ''}`}
                  onClick={() => setPage(i+1)}
                >{i+1}</button>
              ))}
              <button
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >›</button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Map ── */}
        <div className="map-panel">
          <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo center={mapCenter} />

            {vendors.map(v => v.lat && v.lng && (
              <Marker
                key={v.id}
                position={[parseFloat(v.lat), parseFloat(v.lng)]}
                icon={orangeIcon}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>{v.shopName}</strong>
                    <LiveBadge isLive={v.isLive || v.live} />
                    <div style={{ fontSize:13, color:'#6B7280', margin:'4px 0' }}>
                      ⭐ {parseFloat(v.avgRating||0).toFixed(1)}
                      ({v.totalReviews} reviews)
                    </div>
                    <button
                      className="popup-btn"
                      onClick={() => navigate(`/vendor/${v.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {userPos && (
              <Marker position={userPos}>
                <Popup>📍 You are here</Popup>
              </Marker>
            )}
          </MapContainer>

          <button className="map-location-btn" onClick={handleLocation}>
            <FaLocationArrow /> My Location
          </button>
        </div>
      </div>

      {/* ── Filter Drawer ── */}
      {filterOpen && (
        <div className="filter-overlay" onClick={() => setFilterOpen(false)}>
          <div className="filter-drawer animate-fadeInRight"
            onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>🔍 Filters</h3>
              <button className="close-btn" onClick={() => setFilterOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Live toggle */}
            <div className="filter-section">
              <div className="filter-label">Status</div>
              <label className="filter-toggle-row">
                <span>Live Vendors Only</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={liveOnly}
                    onChange={e => setLiveOnly(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <div className="filter-label">Budget</div>
              {[
                { val:'BUDGET',  label:'₹ Budget (Under ₹50)' },
                { val:'MEDIUM',  label:'₹₹ Medium (₹50–₹150)' },
                { val:'PREMIUM', label:'₹₹₹ Premium (₹150+)'  },
              ].map(p => (
                <label key={p.val} className="filter-radio-row">
                  <input
                    type="radio"
                    name="price"
                    value={p.val}
                    checked={priceRange === p.val}
                    onChange={e => setPriceRange(e.target.value)}
                  />
                  {p.label}
                </label>
              ))}
            </div>

            {/* Sort */}
            <div className="filter-section">
              <div className="filter-label">Sort By</div>
              {[
                { val:'nearest', label:'📍 Nearest First' },
                { val:'rating',  label:'⭐ Top Rated'     },
                { val:'reviews', label:'💬 Most Reviewed' },
                { val:'newest',  label:'🆕 Newest First'  },
              ].map(s => (
                <label key={s.val} className="filter-radio-row">
                  <input
                    type="radio"
                    name="sort"
                    value={s.val}
                    checked={sort === s.val}
                    onChange={e => setSort(e.target.value)}
                  />
                  {s.label}
                </label>
              ))}
            </div>

            <button className="btn-apply-filter" onClick={handleApplyFilter}>
              Apply Filters
            </button>
            <button className="btn-clear-filter" onClick={handleClearFilter}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}