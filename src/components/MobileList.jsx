import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import api from '../composables/instance'
import { useAuth } from '../context/auth/useAuth'
import { parseJwtPayload } from '../common/storage'
import './MobileList.css'

function ProgressiveImage({ thumbSrc, fullSrc, alt }) {
  const [src, setSrc] = useState(thumbSrc || fullSrc || '')

  useEffect(() => {
    setSrc(thumbSrc || fullSrc || '')
  }, [thumbSrc, fullSrc])

  useEffect(() => {
    if (!fullSrc || fullSrc === src) return

    let cancelled = false
    const img = new Image()
    img.src = fullSrc
    img.onload = () => {
      if (!cancelled) setSrc(fullSrc)
    }
    return () => {
      cancelled = true
    }
  }, [fullSrc, src])

  if (!src) return null
  return <img src={src} alt={alt} loading="lazy" />
}

const mapApiItemToPhone = (item, index) => {
  const id = item?.id ?? item?.mobileId ?? index + 1
  const name = item?.name ?? item?.modelName ?? item?.title ?? `Phone Model ${id}`
  const media0 = Array.isArray(item?.mobileMedias) ? item.mobileMedias[0] : null
  const imageThumb = media0?.thumb_100 || item?.thumbnail || item?.thumb_100
  const imageFull = media0?.optimized || item?.image || item?.imageUrl || media0?.original
  const image = imageThumb || imageFull || `https://via.placeholder.com/300x420?text=Phone+${id}`
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
  return { id, name, image, imageThumb, imageFull, health, other, price, condition, warranty, seller, color }
}

export default function MobileList() {
  const { websiteName } = useParams();
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
    if (!websiteName) return;
  
    let cancelled = false;
  
    const fetchMobiles = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const cleanWebsite = websiteName.toUpperCase();
  
        // ✅ STEP 1: Get userId
        const userRes = await api.get(
          `/User/GetUserId?websiteName=${encodeURIComponent(cleanWebsite)}`
        );
  
        const websiteUserId =
          userRes?.data?.userId ??
          userRes?.data?.data?.userId;
  
        if (!websiteUserId) {
          throw new Error("Website not found");
        }
  
        // ✅ STEP 2: Fetch mobiles
        const payload = {
          skip: 0,
          take: 100,
          dateFilter: null,
          customStartDate: new Date().toISOString(),
          customEndDate: new Date().toISOString(),
          sortBy: "",
          userId: websiteUserId,
        };
  
        const res = await api.post(
          "/Mobile/GetAllInventoryMobilesByUser",
          payload
        );
  
        console.log("FULL RESPONSE:", res.data);
  
        // ✅ SAFE extraction (handles all cases)
        let raw = [];
  
        if (Array.isArray(res?.data)) {
          raw = res.data;
        } else if (Array.isArray(res?.data?.mobiles)) {
          raw = res.data.mobiles;
        } else if (Array.isArray(res?.data?.data)) {
          raw = res.data.data;
        } else if (Array.isArray(res?.data?.data?.mobiles)) {
          raw = res.data.data.mobiles;
        } else {
          raw = [];
        }
  
        console.log("EXTRACTED:", raw);
  
        if (!cancelled) {
          setPhones(raw.map((item, i) => mapApiItemToPhone(item, i)));
        }
      } catch (err) {
        console.error(err);
  
        if (!cancelled) {
          setPhones([]);
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "No mobiles found for this website."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
  
    fetchMobiles();
  
    return () => {
      cancelled = true;
    };
  }, [websiteName]);

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
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', padding: '2rem' }}>
            <p style={{ margin: 0, color: '#6b7280' }}>No mobiles found.</p>
          </div>
        ) : phones.map((phone) => (
          <article key={phone.id} className={`mobile-card ${expanded === phone.id ? 'expanded' : ''}`}> 
            <div className="mobile-card-main">
              <div className="mobile-image">
                <ProgressiveImage
                  thumbSrc={phone.imageThumb || phone.image}
                  fullSrc={phone.imageFull || phone.image}
                  alt={phone.name}
                />
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
