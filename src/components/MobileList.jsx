import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import api from '../composables/instance'
import { useAuth } from '../context/auth/useAuth'
import { parseJwtPayload } from '../common/storage'
import ReactPaginate from 'react-paginate'
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
  const batteryHealth = item?.batteryHealth

  const storage = item?.storage ?? item?.storageGb ?? `${64 + (index % 3) * 64}GB`
  const os = item?.os ?? item?.operatingSystem ?? 'Android'
  const other = `${storage} storage • ${os}`

  const price = item?.price != null
    ? (typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : String(item.price))
    : `$${(150 + index * 25).toFixed(2)}`

  const condition = item?.condition ?? ['Like New', 'Excellent', 'Good', 'Fair'][index % 4]
  const warranty = item?.productStatusLabel
  const seller = item?.seller ?? item?.sellerName ?? item?.vendor ?? `Seller ${(index % 8) + 1}`
  const color = item?.color ?? item?.colour ?? ['Midnight', 'Coral', 'Ocean', 'Pearl'][index % 4]

  return { id, name, image, imageThumb, batteryHealth, imageFull, other, price, condition, warranty, seller, color }
}

export default function MobileList() {
  const { websiteName } = useParams();
  const { user, token } = useAuth()

  const [phones, setPhones] = useState([])
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 12

  const pageCount = Math.ceil(totalCount / itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  useEffect(() => {
    if (!websiteName) return;

    let cancelled = false;

    const fetchMobiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const cleanWebsite = websiteName.toUpperCase();

        // ✅ Get userId + mobile number
        const userRes = await api.get(
          `/User/GetUserId?websiteName=${encodeURIComponent(cleanWebsite)}`
        );

        const websiteUserId =
          userRes?.data?.userId ??
          userRes?.data?.data?.userId;

        const phoneNumber =
          userRes?.data?.mobileNumber ??
          userRes?.data?.data?.mobileNumber;

        setMobileNumber(phoneNumber || '');

        if (!websiteUserId) {
          throw new Error("Website not found");
        }

        // ✅ API pagination
        const payload = {
          skip: currentPage * itemsPerPage,
          take: itemsPerPage,
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

        let raw = [];

        if (Array.isArray(res?.data)) {
          raw = res.data;
        } else if (Array.isArray(res?.data?.mobiles)) {
          raw = res.data.mobiles;
        } else if (Array.isArray(res?.data?.data)) {
          raw = res.data.data;
        } else if (Array.isArray(res?.data?.data?.mobiles)) {
          raw = res.data.data.mobiles;
        }

        // ✅ Total count (IMPORTANT)
        const total =
          res?.data?.totalCount ??
          res?.data?.data?.totalCount ??
          raw.length;

        if (!cancelled) {
          setPhones(raw.map((item, i) => mapApiItemToPhone(item, i)));
          setTotalCount(total);
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
  }, [websiteName, currentPage]) // ✅ important

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id))

  if (loading) {
    return (
      <div className="mobile-list-wrapper">
        <div className="mobile-list-header">
          <h2 className="mobile-title">Available Mobiles</h2>
          <p className="mobile-sub">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mobile-list-wrapper">
        <div className="mobile-list-header">
          <h2 className="mobile-title">Available Mobiles</h2>
          <p className="mobile-sub" style={{ color: '#c00' }}>{error}</p>
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
          <p>No mobiles found.</p>
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
                  <span className="badge">{phone.condition}</span>
                </div>

                <div className="info-actions">
                  <a
                    className="view-price-btn"
                    href={`https://wa.me/${mobileNumber}?text=${encodeURIComponent(
                      `Hi, I want the price for ${phone.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View price
                  </a>

                  <button onClick={() => toggle(phone.id)}>
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="mobile-card-details">
              <div><strong>Warranty:</strong> {phone.warranty}</div>
              <div><strong>Battery Health:</strong> {phone.batteryHealth}</div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' , flexDirection: 'row'}}>
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            pageClassName={"page-item"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            breakClassName={"page-item"}
          />
        </div>
      )}
    </div>
  )
}