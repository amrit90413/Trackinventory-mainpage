import React, { useState, useEffect } from 'react'
import api from '../composables/instance'
import { useAuth } from '../context/auth/useAuth'
import { parseJwtPayload } from '../common/storage'
import './MobileList.css'

const mapApiItemToPhone = (item, index) => {
  const id = item?.id ?? item?.mobileId ?? index + 1
  const name = item?.name ?? item?.modelName ?? item?.title ?? `Phone Model ${id}`
  const image = item?.image ?? item?.imageUrl ?? item?.thumbnail ?? `https://via.placeholder.com/300x420?text=Phone+${id}`
  const batteryHealth = item?.batteryHealth ?? item?.health ?? item?.batteryHealthPercent
  const health = batteryHealth != null ? `${batteryHealth}% battery health` : `${80 + (index % 20)}% battery health`
  const ram = item?.ram ?? `${4 + (index % 4) * 2}GB`
  const storage = item?.storage ?? item?.storageGb ?? `${64 + (index % 3) * 64}GB`
  const os = item?.os ?? item?.operatingSystem ?? 'Android'
  const other = `${ram} RAM • ${storage} storage • ${os}`
  const price = item?.price != null ? (typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : String(item.price)) : `$${(150 + index * 25).toFixed(2)}`
  const condition = item?.condition ?? ['Like New', 'Excellent', 'Good', 'Fair'][index % 4]
  const warranty = item?.warranty ?? (index % 3 === 0 ? '6 months' : 'No warranty')
  const seller = item?.seller ?? item?.sellerName ?? item?.vendor ?? `Seller ${(index % 8) + 1}`
  const color = item?.color ?? item?.colour ?? ['Midnight', 'Coral', 'Ocean', 'Pearl'][index % 4]
  return { id, name, image, health, other, price, condition, warranty, seller, color }
}

export default function MobileList() {
  const { user, token } = useAuth()
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)

  // Get userId from GetUserDetails (field: userId) or JWT payload (sub/userId)
  const u = Array.isArray(user) ? user[0] : user
  const fromUser = u?.userId ?? u?.UserId ?? u?.id ?? u?.Id ?? ''
  const jwt = parseJwtPayload(token)
  const fromJwt = jwt?.sub ?? jwt?.userId ?? jwt?.UserId ?? jwt?.nameid ?? ''
  const userId = fromUser || fromJwt

  useEffect(() => {
    // Require auth token; without it we can't call the mobiles API
    if (!token) {
      setLoading(false)
      setError('Please sign in to view mobiles.')
      setPhones([])
      return
    }

    // Wait until user details have been fetched by AuthContext
    if (token && !user) {
      return
    }

    if (!userId) {
      setLoading(false)
      setError('Unable to load user. Please sign in again.')
      setPhones([])
      return
    }

    let cancelled = false

    const fetchMobiles = async () => {
      setLoading(true)
      setError(null)
      try {
        const payload = {
          skip: 0,
          take: 100,
          dateFilter: 0,
          customStartDate: new Date().toISOString(),
          customEndDate: new Date().toISOString(),
          sortBy: '',
          UserId: userId,
        }
        const { data } = await api.post('/Mobile/GetAllInventoryMobilesByUser', payload)
        const raw = data?.data ?? data?.items ?? data?.result ?? data
        const list = Array.isArray(raw) ? raw : []
        if (!cancelled) {
          setPhones(list.map((item, i) => mapApiItemToPhone(item, i)))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load mobiles')
          setPhones([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMobiles()
    return () => { cancelled = true }
  }, [token, user, userId])

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id))

  if (loading) {
    return (
      <div className="mobile-list-wrapper">
        <div className="mobile-list-header">
          <h2 className="mobile-title">Available Mobiles</h2>
          <p className="mobile-sub">Loading...</p>
        </div>
        <div className="mobile-cards" style={{ textAlign: 'center', padding: '2rem' }}>Loading mobiles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mobile-list-wrapper">
        <div className="mobile-list-header">
          <h2 className="mobile-title">Available Mobiles</h2>
          <p className="mobile-sub" style={{ color: 'var(--error, #c00)' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-list-wrapper">
      <div className="mobile-list-header">
        <h2 className="mobile-title">Available Mobiles</h2>
      </div>

      <div className="mobile-cards">
        {phones.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>No mobiles found.</p>
        ) : phones.map((phone) => (
          <article key={phone.id} className={`mobile-card ${expanded === phone.id ? 'expanded' : ''}`}> 
            <div className="mobile-card-main">
              <div className="mobile-image">
                <img src={phone.image} alt={phone.name} />
              </div>
              <div className="mobile-info">
                <div className="info-top">
                  <div>
                    <div className="phone-name">{phone.name}</div>
                    <div className="phone-health">{phone.color}</div>
                    <div className="phone-other">{phone.other}</div>
                  </div>
                  <div className="badges">
                    <span className="badge">{phone.condition}</span>
                    <span className="badge muted">{phone.health}</span>
                  </div>
                </div>
                <div className="info-actions">
                  <div className="price-block">
                    <span className="blurred-price">{phone.price}</span>
                    <a
                      className="view-price-btn"
                      href={`https://wa.me/1234567890?text=${encodeURIComponent(
                        `Hi, I want the price for ${phone.name}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open WhatsApp to see price for ${phone.name}`}
                    >
                      View price
                    </a>
                  </div>

                  <button
                    className={`expand-btn ${expanded === phone.id ? 'open' : ''}`}
                    onClick={() => toggle(phone.id)}
                    aria-expanded={expanded === phone.id}
                    aria-controls={`mobile-details-${phone.id}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div id={`mobile-details-${phone.id}`} className="mobile-card-details" role="region" aria-hidden={expanded !== phone.id}>
              <div className="details-grid">
                <div><strong>Seller:</strong> {phone.seller}</div>
                <div><strong>Warranty:</strong> {phone.warranty}</div>
                <div><strong>Battery Health:</strong> {phone.health}</div>
                <div><strong>Extra Notes:</strong> Minor surface marks.</div>
              </div>
              <div className="details-actions">
                <a className="contact-btn" href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hi, I'm interested in ${phone.name} (ID ${phone.id})`)}`} target="_blank" rel="noopener noreferrer">Contact Seller</a>
                <button className="close-details" onClick={() => setExpanded(null)}>Close</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
