import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { RatingStars, LiveBadge, PageLoader } from '../../components/UIComponents'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import {
  FaPlus, FaEdit, FaTrash, FaStar, FaList,
  FaStore, FaSave, FaTimes
} from 'react-icons/fa'
import './VendorDashboard.css'

export default function VendorDashboard() {
  const { user } = useAuth()
  const [shop,     setShop]     = useState(null)
  const [menu,     setMenu]     = useState([])
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [activeTab,setActiveTab]= useState('menu')
  const [menuCat,  setMenuCat]  = useState('All')
  const [liveLoading, setLiveLoading] = useState(false)

  // Modal state
  const [showModal,  setShowModal]  = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [itemForm,   setItemForm]   = useState({
    name:'', price:'', description:'', category:'', isAvailable: true
  })
  const [formErr, setFormErr] = useState('')
  const [saving,  setSaving]  = useState(false)

  // Shop form
  const [shopForm,    setShopForm]    = useState({})
  const [shopSaving,  setShopSaving]  = useState(false)
  const [shopMsg,     setShopMsg]     = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, mRes, rRes] = await Promise.all([
          api.get('/api/vendor/my-shop'),
          api.get('/api/vendor/menu'),
          api.get('/api/vendor/reviews')
        ])
        setShop(sRes.data)
        setShopForm(sRes.data)
        setMenu(mRes.data)
        setReviews(rRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleLive = async () => {
    setLiveLoading(true)
    try {
      const res = await api.put('/api/vendor/toggle-live')
      setShop(prev => ({ ...prev, isLive: res.data.isLive }))
    } catch (err) { console.error(err) }
    finally { setLiveLoading(false) }
  }

  const openAdd = () => {
    setEditItem(null)
    setItemForm({ name:'', price:'', description:'', category:'', isAvailable:true })
    setFormErr('')
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setItemForm({
      name: item.name, price: item.price,
      description: item.description || '',
      category: item.category || '',
      isAvailable: item.isAvailable
    })
    setFormErr('')
    setShowModal(true)
  }

  const handleSaveItem = async (e) => {
    e.preventDefault()
    if (!itemForm.name || !itemForm.price) {
      setFormErr('Name and price are required')
      return
    }
    setSaving(true)
    try {
      if (editItem) {
        const res = await api.put(`/api/vendor/menu/${editItem.id}`, itemForm)
        setMenu(prev => prev.map(i => i.id === editItem.id ? res.data : i))
      } else {
        const res = await api.post('/api/vendor/menu', itemForm)
        setMenu(prev => [...prev, res.data])
      }
      setShowModal(false)
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await api.delete(`/api/vendor/menu/${id}`)
      setMenu(prev => prev.filter(i => i.id !== id))
    } catch (err) { console.error(err) }
  }

  const handleShopSave = async (e) => {
    e.preventDefault()
    setShopSaving(true)
    try {
      const res = await api.put('/api/vendor/shop', shopForm)
      setShop(res.data)
      setShopMsg('✅ Shop updated!')
    } catch (err) {
      setShopMsg('❌ Update failed')
    } finally {
      setShopSaving(false)
      setTimeout(() => setShopMsg(''), 3000)
    }
  }

  const cats = ['All', ...new Set(menu.map(i => i.category).filter(Boolean))]
  const filteredMenu = menuCat === 'All' ? menu : menu.filter(i => i.category === menuCat)

  if (loading) return <><Navbar /><PageLoader /></>

  if (!shop) return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ maxWidth:500, margin:'60px auto', padding:'0 24px', textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🏪</div>
        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>No Shop Yet!</h2>
        <p style={{ color:'#6B7280', marginBottom:24 }}>
          Create your shop profile to get started.
        </p>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="vd-dashboard">

        {/* ── HEADER ── */}
        <div className="dash-header">
          <div className="dash-shop-info">
            <div className="dash-shop-icon">🏪</div>
            <div>
              <h1 className="dash-shop-name">{shop.shopName}</h1>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                <LiveBadge isLive={shop.isLive} />
                <span style={{ color:'#9CA3AF', fontSize:14, fontWeight:600 }}>
                  📍 {shop.city}
                </span>
              </div>
            </div>
          </div>
          <div className="dash-header-actions">
            <span style={{ fontSize:14, fontWeight:700, color:'#6B7280' }}>
              {shop.isLive ? '🟢 You are Live' : '⚫ Offline'}
            </span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={shop.isLive}
                onChange={toggleLive}
                disabled={liveLoading}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="dash-stats">
          {[
            { icon:'⭐', label:'Rating',     val: parseFloat(shop.avgRating||0).toFixed(1), bg:'#EFF6FF', ic:'#3B82F6' },
            { icon:'💬', label:'Reviews',    val: shop.totalReviews,  bg:'#F0FDF4', ic:'#22C55E' },
            { icon:'🍽️', label:'Menu Items', val: menu.length,        bg:'#FAF5FF', ic:'#A855F7' },
            { icon:'🕐', label:'Hours',      val: `${shop.openingTime||'--'} – ${shop.closingTime||'--'}`,
              bg:'#FFF7ED', ic:'#F97316' },
          ].map((s,i) => (
            <div key={i} className="stat-card" style={{ '--stat-bg': s.bg, '--stat-ic': s.ic }}>
              <div className="stat-icon">{s.icon}</div>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="tabs">
          <button className={`tab-btn ${activeTab==='menu'?'active':''}`}
            onClick={() => setActiveTab('menu')}>🍽️ Menu</button>
          <button className={`tab-btn ${activeTab==='profile'?'active':''}`}
            onClick={() => setActiveTab('profile')}>🏪 Shop Profile</button>
          <button className={`tab-btn ${activeTab==='reviews'?'active':''}`}
            onClick={() => setActiveTab('reviews')}>⭐ Reviews</button>
        </div>

        {/* ── MENU TAB ── */}
        {activeTab === 'menu' && (
          <div className="dash-section animate-fadeIn">
            <div className="dash-section-header">
              <h2>Menu Items</h2>
              <button className="btn-add-item" onClick={openAdd}>
                <FaPlus /> Add Item
              </button>
            </div>

            {cats.length > 1 && (
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                {cats.map(c => (
                  <button key={c}
                    className={`cat-filter-btn ${menuCat===c?'active':''}`}
                    onClick={() => setMenuCat(c)}
                    style={{ padding:'6px 14px', fontSize:13 }}
                  >{c}</button>
                ))}
              </div>
            )}

            {filteredMenu.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No items yet</h3>
                <p>Add your first menu item!</p>
              </div>
            ) : (
              <div className="menu-items-list">
                {filteredMenu.map(item => (
                  <div key={item.id} className="dash-menu-item">
                    <div className="dmi-left">
                      <div className="dmi-avail-dot"
                        style={{ background: item.isAvailable ? '#22C55E' : '#9CA3AF' }}
                      />
                      <div>
                        <div className="dmi-name">{item.name}</div>
                        {item.description && (
                          <div className="dmi-desc">{item.description}</div>
                        )}
                        {item.category && (
                          <span className="dmi-cat">{item.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="dmi-right">
                      <div className="dmi-price">₹{item.price}</div>
                      <div className="dmi-actions">
                        <button className="dmi-btn edit" onClick={() => openEdit(item)}>
                          <FaEdit />
                        </button>
                        <button className="dmi-btn del" onClick={() => handleDelete(item.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="dash-section animate-fadeIn">
            <h2 style={{ fontWeight:800, marginBottom:20 }}>Edit Shop Profile</h2>
            {shopMsg && (
              <div className={`alert ${shopMsg.startsWith('✅')?'alert-success':'alert-error'}`}
                style={{ marginBottom:16 }}>
                {shopMsg}
              </div>
            )}
            <form onSubmit={handleShopSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { label:'Shop Name',   key:'shopName',   type:'text',   ph:'Murugan Idli Shop'    },
                { label:'City',        key:'city',        type:'text',   ph:'Erode'                },
                { label:'Address',     key:'address',     type:'text',   ph:'Bus Stand Road, Erode'},
                { label:'Category',    key:'category',    type:'text',   ph:'Idli,Dosa,Vada'       },
                { label:'Photo URL',   key:'photoUrl',    type:'url',    ph:'https://...'           },
                { label:'Opening Time',key:'openingTime', type:'time',   ph:''                     },
                { label:'Closing Time',key:'closingTime', type:'time',   ph:''                     },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    className="form-control"
                    placeholder={f.ph}
                    value={shopForm[f.key] || ''}
                    onChange={e => setShopForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={shopForm.description || ''}
                  onChange={e => setShopForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell customers about your shop..."
                />
              </div>
              <div className="form-group">
                <label>Price Range</label>
                <select
                  className="form-control"
                  value={shopForm.priceRange || 'BUDGET'}
                  onChange={e => setShopForm(prev => ({ ...prev, priceRange: e.target.value }))}
                >
                  <option value="BUDGET">₹ Budget</option>
                  <option value="MEDIUM">₹₹ Medium</option>
                  <option value="PREMIUM">₹₹₹ Premium</option>
                </select>
              </div>
              <button type="submit" disabled={shopSaving} style={{
                padding:14, background:'#FF6B35', color:'white',
                border:'none', borderRadius:10, fontSize:15,
                fontWeight:800, cursor:'pointer', fontFamily:'inherit',
                boxShadow:'0 6px 20px rgba(255,107,53,0.3)',
                transition:'all 0.3s'
              }}>
                {shopSaving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === 'reviews' && (
          <div className="dash-section animate-fadeIn">
            <h2 style={{ fontWeight:800, marginBottom:20 }}>
              Customer Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>No reviews yet</h3>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {reviews.map(r => (
                  <div key={r.id} style={{
                    background:'white', borderRadius:12, padding:18,
                    boxShadow:'0 2px 10px rgba(0,0,0,0.06)',
                    display:'flex', gap:14
                  }}>
                    <div style={{
                      width:40, height:40, borderRadius:10,
                      background:'linear-gradient(135deg,#FF6B35,#e85a26)',
                      color:'white', display:'flex', alignItems:'center',
                      justifyContent:'center', fontWeight:800, fontSize:16,
                      flexShrink:0
                    }}>
                      {r.customerName?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontWeight:700 }}>{r.customerName}</span>
                        <RatingStars rating={r.rating} size={13} />
                      </div>
                      {r.comment && (
                        <p style={{ color:'#6B7280', fontSize:14, fontWeight:500 }}>
                          {r.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MENU ITEM MODAL ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h2>{editItem ? 'Edit Item' : 'Add Menu Item'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            {formErr && (
              <div className="alert alert-error" style={{ marginBottom:16 }}>{formErr}</div>
            )}
            <form onSubmit={handleSaveItem} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group">
                <label>Item Name *</label>
                <input className="form-control" placeholder="Masala Dosa"
                  value={itemForm.name}
                  onChange={e => setItemForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input className="form-control" type="number" placeholder="45"
                  value={itemForm.price}
                  onChange={e => setItemForm(p => ({...p, price: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input className="form-control" placeholder="Brief description..."
                  value={itemForm.description}
                  onChange={e => setItemForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input className="form-control" placeholder="Breakfast"
                  value={itemForm.category}
                  onChange={e => setItemForm(p => ({...p, category: e.target.value}))} />
              </div>
              <label style={{
                display:'flex', alignItems:'center', gap:10,
                cursor:'pointer', fontSize:14, fontWeight:700
              }}>
                <label className="toggle-switch" style={{ flexShrink:0 }}>
                  <input type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={e => setItemForm(p => ({...p, isAvailable: e.target.checked}))} />
                  <span className="toggle-slider" />
                </label>
                Available now
              </label>
              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button type="submit" disabled={saving} style={{
                  flex:1, padding:13, background:'#FF6B35', color:'white',
                  border:'none', borderRadius:10, fontWeight:800,
                  fontSize:15, cursor:'pointer', fontFamily:'inherit'
                }}>
                  {saving ? 'Saving...' : '💾 Save Item'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding:'13px 20px', background:'#F3F4F6', color:'#6B7280',
                  border:'none', borderRadius:10, fontWeight:700,
                  cursor:'pointer', fontFamily:'inherit'
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}