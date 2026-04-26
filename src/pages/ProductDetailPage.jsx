import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../composables/instance';

/* ─── helpers ─── */
const COND_MAP = {
  'Like New': { label: 'Like New', color: '#059669', bg: '#d1fae5' },
  Excellent:  { label: 'Excellent', color: '#2563eb', bg: '#dbeafe' },
  Good:       { label: 'Good',      color: '#d97706', bg: '#fef3c7' },
  Fair:       { label: 'Fair',      color: '#ea580c', bg: '#ffedd5' },
  old:        { label: 'Used',      color: '#64748b', bg: '#f1f5f9' },
};

const CAT_ICON = { Mobile:'📱', Vehicle:'🚗', Electronics:'💻', Watch:'⌚', Gold:'🪙' };

const WA_SVG = (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.524 5.863L0 24l6.276-1.494A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.375l-.357-.213-3.722.885.916-3.618-.234-.37A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
  </svg>
);

/* ─── Lightbox ─── */
const Lightbox = ({ images, startIndex, name, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const touchX = useRef(null);
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [prev, next, onClose]);

  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col bg-black"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div>
          <p className="text-white text-sm font-semibold truncate max-w-[260px]">{name}</p>
          <p className="text-slate-400 text-xs">{idx + 1} / {images.length}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-10"
        onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const d = e.changedTouches[0].clientX - touchX.current; if (d > 50) prev(); if (d < -50) next(); }}>
        <AnimatePresence mode="wait">
          <motion.img key={idx} src={images[idx]?.full || images[idx]?.thumb || images[idx]}
            alt={name} className="max-h-full max-w-full object-contain rounded-xl select-none"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} draggable={false} />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="shrink-0 flex gap-2 px-4 py-3 overflow-x-auto">
          {images.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === idx ? 'border-blue-400' : 'border-transparent opacity-50'}`}>
              <img src={img.thumb || img.full || img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Skeleton ─── */
const Skeleton = () => (
  <div className="min-h-screen bg-[#f4f6f9]">
    <div className="h-14 bg-white shadow-sm animate-pulse" />
    <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
      <div className="aspect-square rounded-3xl bg-slate-200 animate-pulse" />
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
        <div className="h-10 bg-slate-200 rounded-2xl w-1/3 animate-pulse" />
        <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-14 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  </div>
);

/* ─── Main Page ─── */
export default function ProductDetailPage() {
  const { websiteName, productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Basic info from search (always available immediately)
  const searchItem = location.state?.product || null;

  const [mobileNumber, setMobileNumber] = useState('');
  const [shopInfo, setShopInfo] = useState(null);
  const [fullProduct, setFullProduct] = useState(null); // rich data from inventory API
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const touchX = useRef(null);

  // Determine what to display — fallback to search item while loading full data
  const name      = fullProduct?.name      || searchItem?.name      || 'Product';
  const category  = fullProduct?.category  || searchItem?.category  || 'Mobile';
  const shopName  = shopInfo?.businessName || shopInfo?.name        || searchItem?.shopName || websiteName?.toUpperCase();
  const city      = shopInfo?.city         || searchItem?.city      || '';
  const state     = shopInfo?.state        || searchItem?.state     || '';
  const price     = searchItem?.price      || 0;
  const condition = fullProduct?.condition || 'old';
  const cond      = COND_MAP[condition]    || COND_MAP.old;

  const images = fullProduct?.images || [];

  const specs = [
    fullProduct?.color         && { label: 'Colour',   value: fullProduct.color },
    fullProduct?.storage       && { label: 'Storage',  value: fullProduct.storage },
    fullProduct?.os            && { label: 'OS',        value: fullProduct.os },
    fullProduct?.model         && { label: 'Model',     value: fullProduct.model },
    fullProduct?.batteryHealth && { label: 'Battery',   value: fullProduct.batteryHealth },
    fullProduct?.warranty      && { label: 'Warranty',  value: fullProduct.warranty },
    fullProduct?.imei          && { label: 'IMEI',      value: fullProduct.imei, mono: true },
  ].filter(Boolean);

  const waText = `Hi, I'm interested in ${name}${fullProduct?.storage ? ` (${fullProduct.storage})` : ''}${fullProduct?.color ? ` - ${fullProduct.color}` : ''}. Is it available?`;
  const waLink = mobileNumber ? `https://wa.me/${mobileNumber}?text=${encodeURIComponent(waText)}` : '#';

  // Fetch shop userId + contact, then fetch full product
  useEffect(() => {
    if (!websiteName) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        // Step 1: get userId + mobileNumber
        const clean = websiteName.toUpperCase();
        const userRes = await api.get(`/User/GetUserId?websiteName=${encodeURIComponent(clean)}`);
        const uid     = userRes?.data?.userId ?? userRes?.data?.data?.userId;
        const phone   = userRes?.data?.mobileNumber ?? userRes?.data?.data?.mobileNumber;
        if (cancelled) return;
        setShopInfo(userRes?.data);
        setMobileNumber(phone || '');

        if (!uid) { setLoading(false); return; }

        // Step 2: fetch inventory searching by name to find the specific product
        const searchName = searchItem?.name || '';
        const invRes = await api.post('/Mobile/GetAllInventoryMobilesByUser', {
          skip: 0, take: 100,
          dateFilter: null,
          customStartDate: new Date().toISOString(),
          customEndDate:   new Date().toISOString(),
          sortBy: 'Newest',
          userId: uid,
          search: searchName || null,
          condition: null, storage: null, color: null,
        });

        if (cancelled) return;

        let raw = [];
        if (Array.isArray(invRes?.data)) raw = invRes.data;
        else if (Array.isArray(invRes?.data?.mobiles)) raw = invRes.data.mobiles;
        else if (Array.isArray(invRes?.data?.data)) raw = invRes.data.data;
        else if (Array.isArray(invRes?.data?.data?.mobiles)) raw = invRes.data.data.mobiles;

        // Find matching product by productId
        const match = raw.find(
          r => String(r?.id) === String(productId) ||
               String(r?.mobileId) === String(productId)
        ) || raw[0]; // fallback to first if not found

        if (match && !cancelled) {
          const medias = Array.isArray(match?.mobileMedias) ? match.mobileMedias : [];
          const imgs = medias.length > 0
            ? medias.map(m => ({ thumb: m?.thumb_100 || m?.optimized || '', full: m?.optimized || m?.original || m?.thumb_100 || '' })).filter(m => m.full || m.thumb)
            : match?.image ? [{ thumb: match.thumbnail || match.image, full: match.image }] : [];

          setFullProduct({
            id:            match?.id ?? match?.mobileId,
            name:          match?.name ?? match?.modelName ?? name,
            images:        imgs,
            color:         match?.color         ?? match?.colour ?? '',
            storage:       match?.storage       ?? match?.storageGb ?? '',
            os:            match?.os            ?? match?.operatingSystem ?? '',
            batteryHealth: match?.batteryHealth ?? '',
            condition:     match?.condition     ?? match?.Condition ?? 'old',
            warranty:      match?.productStatusLabel ?? '',
            imei:          match?.imeiNumber1   ?? match?.ImeiNumber1 ?? '',
            model:         match?.model         ?? '',
            category,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [websiteName, productId]);

  if (loading && !searchItem) return <Skeleton />;

  const displayImages = images.length > 0 ? images : [];

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0 overflow-hidden">
            <Link to="/" className="hover:text-blue-600 shrink-0 transition-colors">Home</Link>
            <span className="shrink-0">›</span>
            <Link to={`/${websiteName}`} className="hover:text-blue-600 truncate transition-colors">{shopName}</Link>
            <span className="shrink-0">›</span>
            <span className="text-slate-800 font-medium truncate">{name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

          {/* Left — Image gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <motion.div
              className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const d = e.changedTouches[0].clientX - touchX.current;
                if (displayImages.length > 1) {
                  if (d > 40) setImgIdx(i => (i - 1 + displayImages.length) % displayImages.length);
                  if (d < -40) setImgIdx(i => (i + 1) % displayImages.length);
                }
              }}
              onClick={() => displayImages.length > 0 && setLightbox({ images: displayImages, idx: imgIdx })}
            >
              {displayImages.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img key={imgIdx}
                    src={displayImages[imgIdx]?.full || displayImages[imgIdx]?.thumb}
                    alt={name}
                    className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }} />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <span className="text-8xl">{CAT_ICON[category] || '📦'}</span>
                  <p className="text-sm mt-3 font-medium">No image available</p>
                </div>
              )}

              {/* Loading shimmer overlay */}
              {loading && (
                <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-3xl" />
              )}

              {/* Expand hint */}
              {displayImages.length > 0 && (
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" /></svg>
                  Expand
                </div>
              )}

              {/* Nav arrows for multiple images */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + displayImages.length) % displayImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % displayImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {displayImages.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-sm ${i === imgIdx ? 'border-blue-500 scale-105' : 'border-slate-200 opacity-60 hover:opacity-90'}`}>
                    <img src={img.thumb || img.full} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Image count badge */}
            {displayImages.length > 1 && (
              <p className="text-center text-xs text-slate-400 font-medium">
                {imgIdx + 1} / {displayImages.length} photos
              </p>
            )}
          </div>

          {/* Right — Product info */}
          <motion.div className="space-y-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>

            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{CAT_ICON[category] || '📦'}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{category}</span>
            </div>

            {/* Name + condition */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">{name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ color: cond.color, background: cond.bg }}>
                  {cond.label}
                </span>
                {loading && <span className="text-xs text-slate-400 animate-pulse">Loading details…</span>}
              </div>
            </div>

            {/* Price */}
            {price > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-500 font-medium">Approx. price</span>
              </div>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                <p className="px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">Specifications</p>
                {specs.map(s => (
                  <div key={s.label} className="flex items-center gap-3 px-4 py-3">
                    <span className="shrink-0 text-xs text-slate-500 font-medium w-20">{s.label}</span>
                    <span className={`flex-1 text-xs font-bold text-slate-800 text-right ${s.mono ? 'font-mono break-all' : 'truncate'}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Shop card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                🏪
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{shopName}</p>
                {(city || state) && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    📍 {[city, state].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <Link to={`/${websiteName}`}
                className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap">
                View Shop →
              </Link>
            </div>

            {/* WhatsApp CTA */}
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white text-base font-bold shadow-lg shadow-green-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98] ${!mobileNumber ? 'opacity-60 pointer-events-none' : ''}`}
              style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)' }}>
              {WA_SVG}
              Ask for Price on WhatsApp
            </a>

            {/* View all in shop */}
            <Link to={`/${websiteName}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 text-sm font-bold hover:border-blue-300 hover:text-blue-700 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
              </svg>
              View All Products in {shopName}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.idx}
            name={name}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
