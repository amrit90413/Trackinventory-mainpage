import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../composables/instance';
import { useAuth } from '../context/auth/useAuth';
import { parseJwtPayload } from '../common/storage';

/* ─── Map API item ─── */
const mapItem = (item, index) => {
  const id   = item?.id ?? item?.mobileId ?? index + 1;
  const name = item?.name ?? item?.modelName ?? `Model ${id}`;
  const medias = Array.isArray(item?.mobileMedias) ? item.mobileMedias : [];
  const images = medias.length > 0
    ? medias.map((m) => ({ thumb: m?.thumb_100 || m?.optimized || '', full: m?.optimized || m?.original || m?.thumb_100 || '' }))
        .filter((m) => m.full || m.thumb)
    : item?.image || item?.thumbnail
      ? [{ thumb: item.thumbnail || item.image, full: item.image || item.thumbnail }]
      : [];
  return {
    id, name, images,
    color:         item?.color         ?? item?.colour ?? '',
    storage:       item?.storage       ?? item?.storageGb ?? '',
    os:            item?.os            ?? item?.operatingSystem ?? '',
    batteryHealth: item?.batteryHealth ?? '',
    condition:     item?.condition     ?? item?.Condition ?? 'old',
    warranty:      item?.productStatusLabel ?? '',
    imei:          item?.imeiNumber1   ?? item?.ImeiNumber1 ?? '',
    model:         item?.model         ?? '',
  };
};

/* ─── Condition config ─── */
const COND_MAP = {
  'Like New': { label: 'Like New', color: '#059669', bg: '#d1fae5' },
  Excellent:  { label: 'Excellent', color: '#2563eb', bg: '#dbeafe' },
  Good:       { label: 'Good',      color: '#d97706', bg: '#fef3c7' },
  Fair:       { label: 'Fair',      color: '#ea580c', bg: '#ffedd5' },
  old:        { label: 'Used',      color: '#64748b', bg: '#f1f5f9' },
};

const WA_SVG = (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.524 5.863L0 24l6.276-1.494A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.375l-.357-.213-3.722.885.916-3.618-.234-.37A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
  </svg>
);

/* ─── Skeleton card ─── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-slate-200" />
    <div className="p-2.5 space-y-2">
      <div className="h-3.5 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
      <div className="h-8 bg-slate-200 rounded-xl w-full mt-3" />
    </div>
  </div>
);

/* ─── Fullscreen lightbox ─── */
const Lightbox = ({ images, startIndex, name, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const touchX = useRef(null);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); if (e.key === 'Escape') onClose(); };
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
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touchX.current; if (d > 50) prev(); if (d < -50) next(); }}>
        <AnimatePresence mode="wait">
          <motion.img key={idx} src={images[idx]?.full || images[idx]?.thumb} alt={name}
            className="max-h-full max-w-full object-contain rounded-xl select-none"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
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
              <img src={img.thumb || img.full} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Product detail sheet ─── */
const ProductSheet = ({ phone, mobileNumber, onClose, onOpenLightbox }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const touchX = useRef(null);
  const cond   = COND_MAP[phone.condition] || COND_MAP.old;
  const waLink = `https://wa.me/${mobileNumber}?text=${encodeURIComponent(`Hi, I want the price for ${phone.name}${phone.storage ? ` (${phone.storage})` : ''}${phone.color ? ` - ${phone.color}` : ''}`)}`;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const specs = [
    phone.color         && { label: 'Colour',   value: phone.color },
    phone.storage       && { label: 'Storage',  value: phone.storage },
    phone.os            && { label: 'OS',        value: phone.os },
    phone.model         && { label: 'Model',     value: phone.model },
    phone.batteryHealth && { label: 'Battery',   value: phone.batteryHealth },
    phone.warranty      && { label: 'Warranty',  value: phone.warranty },
    phone.imei          && { label: 'IMEI',      value: phone.imei, mono: true },
  ].filter(Boolean);

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>
        <button onClick={onClose} className="hidden sm:flex absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 items-center justify-center text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Image gallery */}
          <div className="relative bg-slate-100"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const d = e.changedTouches[0].clientX - touchX.current;
              if (d > 40) setImgIdx((i) => (i - 1 + phone.images.length) % phone.images.length);
              if (d < -40) setImgIdx((i) => (i + 1) % phone.images.length);
            }}>
            {phone.images.length > 0 ? (
              <div className="relative aspect-[4/3] cursor-pointer" onClick={() => onOpenLightbox(phone.images, imgIdx, phone.name)}>
                <AnimatePresence mode="wait">
                  <motion.img key={imgIdx} src={phone.images[imgIdx]?.full || phone.images[imgIdx]?.thumb}
                    alt={phone.name} className="absolute inset-0 w-full h-full object-contain p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} />
                </AnimatePresence>
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" /></svg>
                  Tap to expand
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center"><span className="text-7xl opacity-20">📱</span></div>
            )}
            {phone.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + phone.images.length) % phone.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center text-slate-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => setImgIdx((i) => (i + 1) % phone.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center text-slate-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
          {phone.images.length > 1 && (
            <div className="flex gap-2 px-4 py-2 overflow-x-auto bg-white border-b border-slate-100">
              {phone.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-blue-500' : 'border-slate-200 opacity-60'}`}>
                  <img src={img.thumb || img.full} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900 leading-snug flex-1">{phone.name}</h2>
              <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ color: cond.color, background: cond.bg }}>{cond.label}</span>
            </div>
            {specs.length > 0 && (
              <div className="bg-slate-50 rounded-2xl overflow-hidden divide-y divide-slate-100 mb-4">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 px-4 py-2.5 min-w-0">
                    <span className="shrink-0 text-xs text-slate-500 font-medium w-20">{s.label}</span>
                    <span className={`flex-1 min-w-0 text-xs font-bold text-slate-800 text-right ${s.mono ? 'font-mono break-all' : 'truncate'}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg shadow-green-500/20"
              style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)' }}>
              {WA_SVG} Ask for Price on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Filter + Sort drawer ─── */
const FilterDrawer = ({ open, onClose, filterOptions, filters, onChange, sortBy, onSortChange, onReset }) => {
  const activeCount = [filters.condition, filters.storage, filters.color].filter(Boolean).length
    + (sortBy !== 'Newest' ? 1 : 0);

  const Chips = ({ label, field, options }) => (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onChange(field, '')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            !filters[field] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
          }`}>
          All
        </button>
        {options.map((opt) => {
          const cond = COND_MAP[opt];
          const isActive = filters[field] === opt;
          const activeStyle = isActive
            ? cond
              ? { background: cond.bg, color: cond.color, border: `1px solid ${cond.color}` }
              : {} // blue class handles it below
            : {};
          return (
            <button key={opt} onClick={() => onChange(field, isActive ? '' : opt)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                isActive
                  ? cond
                    ? 'border-transparent'
                    : 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
              style={activeStyle}>
              {cond ? cond.label : opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="absolute inset-0 bg-black/50" />
          <motion.div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}>

            <div className="flex justify-center pt-3 sm:hidden"><div className="w-10 h-1 rounded-full bg-slate-300" /></div>

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Filters & Sort</h3>
                {activeCount > 0 && <p className="text-xs text-blue-600 font-medium mt-0.5">{activeCount} active</p>}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Sort By</p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((o) => (
                    <button key={o.value} onClick={() => onSortChange(o.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        sortBy === o.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {filterOptions.conditions.length > 0 && <Chips label="Condition" field="condition" options={filterOptions.conditions} />}
              {filterOptions.storages.length > 0   && <Chips label="Storage"   field="storage"   options={filterOptions.storages} />}
              {filterOptions.colors.length > 0     && <Chips label="Colour"    field="color"     options={filterOptions.colors} />}
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-slate-100">
              <button onClick={onReset}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Reset All
              </button>
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}>
                Show Results
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── Product card ─── */
const ProductCard = ({ phone, mobileNumber, index, onSelect }) => {
  const cond  = COND_MAP[phone.condition] || COND_MAP.old;
  const thumb = phone.images[0]?.thumb || phone.images[0]?.full;
  const waLink = `https://wa.me/${mobileNumber}?text=${encodeURIComponent(`Hi, I want the price for ${phone.name}`)}`;

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.25), duration: 0.3 }}
      onClick={() => onSelect(phone)}
    >
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={phone.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-5xl opacity-25">📱</span>
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ color: cond.color, background: cond.bg }}>{cond.label}</span>
        {phone.images.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {phone.images.length}
          </span>
        )}
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <p className="text-[13px] font-semibold text-slate-900 line-clamp-2 leading-snug mb-1.5">{phone.name}</p>
        {(phone.color || phone.storage) && (
          <p className="text-[11px] text-slate-400 mb-2.5 truncate">{[phone.color, phone.storage].filter(Boolean).join(' • ')}</p>
        )}
        <div className="mt-auto">
          <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full h-8 rounded-xl text-white text-[11px] font-bold"
            style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)' }}>
            {WA_SVG}<span>Get Price</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Sort options ─── */
const SORT_OPTIONS = [
  { value: 'Newest',   label: 'Newest first' },
  { value: 'Oldest',   label: 'Oldest first' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc',label: 'Name Z–A' },
];

/* ─── Main component ─── */
export default function MobileList() {
  const { websiteName } = useParams();
  const { user, token } = useAuth();

  // Data
  const [phones, setPhones]             = useState([]);
  const [shopInfo, setShopInfo]         = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [websiteUserId, setWebsiteUserId] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [currentPage, setCurrentPage]   = useState(0);
  const [totalCount, setTotalCount]     = useState(0);
  const [filterOptions, setFilterOptions] = useState({ conditions: [], storages: [], colors: [] });

  // UI state
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [lightbox, setLightbox]           = useState(null);
  const [filterOpen, setFilterOpen]       = useState(false);

  // Filter state
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState('Newest');
  const [filters, setFilters]   = useState({ condition: '', storage: '', color: '' });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when search/filters change
  useEffect(() => { setCurrentPage(0); }, [debouncedSearch, filters, sortBy]);

  const itemsPerPage = 24;
  const pageCount    = Math.ceil(totalCount / itemsPerPage);

  // Fetch userId + shop info once
  useEffect(() => {
    if (!websiteName) return;
    let cancelled = false;
    const init = async () => {
      try {
        const clean   = websiteName.toUpperCase();
        const userRes = await api.get(`/User/GetUserId?websiteName=${encodeURIComponent(clean)}`);
        const uid     = userRes?.data?.userId ?? userRes?.data?.data?.userId;
        const phone   = userRes?.data?.mobileNumber ?? userRes?.data?.data?.mobileNumber;
        if (!cancelled) { setMobileNumber(phone || ''); setShopInfo(userRes?.data); setWebsiteUserId(uid || null); }
        if (!uid) setError('Website not found');
      } catch (err) {
        if (!cancelled) setError('Website not found');
      }
    };
    init();
    return () => { cancelled = true; };
  }, [websiteName]);

  // Fetch inventory whenever userId, page, search, filters, or sort change
  useEffect(() => {
    if (!websiteUserId) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await api.post('/Mobile/GetAllInventoryMobilesByUser', {
          skip:      currentPage * itemsPerPage,
          take:      itemsPerPage,
          dateFilter: null,
          customStartDate: new Date().toISOString(),
          customEndDate:   new Date().toISOString(),
          sortBy,
          userId:    websiteUserId,
          search:    debouncedSearch || null,
          condition: filters.condition || null,
          storage:   filters.storage  || null,
          color:     filters.color    || null,
        });

        let raw = [];
        if (Array.isArray(res?.data)) raw = res.data;
        else if (Array.isArray(res?.data?.mobiles)) raw = res.data.mobiles;
        else if (Array.isArray(res?.data?.data)) raw = res.data.data;
        else if (Array.isArray(res?.data?.data?.mobiles)) raw = res.data.data.mobiles;

        const total = res?.data?.totalCount ?? res?.data?.data?.totalCount ?? raw.length;
        const opts  = res?.data?.filterOptions ?? res?.data?.data?.filterOptions;

        if (!cancelled) {
          const newPhones = raw.map(mapItem);
          setPhones(prev => currentPage === 0 ? newPhones : [...prev, ...newPhones]);
          setTotalCount(total);
          if (opts) setFilterOptions({ conditions: opts.conditions ?? [], storages: opts.storages ?? [], colors: opts.colors ?? [] });
        }
      } catch (err) {
        if (!cancelled) { setPhones([]); setError(err?.response?.data?.message || 'Failed to load inventory.'); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [websiteUserId, currentPage, debouncedSearch, filters, sortBy]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const resetFilters = () => {
    setFilters({ condition: '', storage: '', color: '' });
    setSearch('');
    setSortBy('Newest');
    setFilterOpen(false);
  };

  const activeFilterCount = [filters.condition, filters.storage, filters.color].filter(Boolean).length;
  const shopName  = shopInfo?.businessName || shopInfo?.name || websiteName?.toUpperCase() || 'Store';
  const shopCity  = shopInfo?.city  || '';
  const shopState = shopInfo?.state || '';
  const location  = [shopCity, shopState].filter(Boolean).join(', ');
  const waAll     = mobileNumber ? `https://wa.me/${mobileNumber}?text=${encodeURIComponent("Hi, I'm interested in your mobile inventory")}` : '#';

  return (
    <div className="min-h-screen bg-[#f4f6f9]">

      {/* ── Sticky store header ── */}
      <div className="sticky top-0 z-40 shadow-md" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)' }}>
        {/* Brand row */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-white font-extrabold text-lg sm:text-2xl leading-tight truncate">{shopName}</h1>
            {location && (
              <p className="text-blue-200 text-xs flex items-center gap-1 mt-0.5">
                <span>📍</span><span className="truncate">{location}</span>
              </p>
            )}
          </div>
          {mobileNumber && (
            <a href={waAll} target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold"
              style={{ background: '#16a34a' }}>
              {WA_SVG}<span className="hidden sm:inline">Chat</span>
            </a>
          )}
        </div>

        {/* Search row — full width */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 min-w-0">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input type="text" placeholder="Search phones…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none" />
            {search && (
              <button onClick={() => setSearch('')} className="shrink-0 text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Single Filter & Sort button */}
          <button onClick={() => setFilterOpen(true)}
            className="relative shrink-0 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <span>Filter & Sort</span>
            {(activeFilterCount > 0 || sortBy !== 'Newest') && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount + (sortBy !== 'Newest' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Active chips row — only when filters are set */}
        {(activeFilterCount > 0 || sortBy !== 'Newest') && (
          <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
            {sortBy !== 'Newest' && (
              <span className="shrink-0 flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || sortBy}
                <button onClick={() => setSortBy('Newest')} className="ml-0.5 opacity-70 hover:opacity-100">✕</button>
              </span>
            )}
            {filters.condition && (
              <span className="shrink-0 flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {COND_MAP[filters.condition]?.label || filters.condition}
                <button onClick={() => handleFilterChange('condition', '')} className="ml-0.5 opacity-70 hover:opacity-100">✕</button>
              </span>
            )}
            {filters.storage && (
              <span className="shrink-0 flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {filters.storage}
                <button onClick={() => handleFilterChange('storage', '')} className="ml-0.5 opacity-70 hover:opacity-100">✕</button>
              </span>
            )}
            {filters.color && (
              <span className="shrink-0 flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {filters.color}
                <button onClick={() => handleFilterChange('color', '')} className="ml-0.5 opacity-70 hover:opacity-100">✕</button>
              </span>
            )}
            <button onClick={resetFilters} className="shrink-0 text-xs text-white/60 hover:text-white font-medium underline">
              Clear all
            </button>
          </div>
        )}
        <div className="pb-1" />
      </div>

      {/* ── Stock bar ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          {loading
            ? 'Loading...'
            : `${totalCount} phone${totalCount !== 1 ? 's' : ''} ${activeFilterCount > 0 || debouncedSearch ? 'found' : 'in stock'}`}
        </p>
        {(activeFilterCount > 0 || debouncedSearch) && !loading && (
          <button onClick={resetFilters} className="text-xs text-blue-600 font-semibold hover:underline">Clear filters</button>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="px-3 py-4 max-w-6xl mx-auto">
        {loading && currentPage === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : phones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">{error ? '📭' : '🔍'}</div>
            <h3 className="text-base font-bold text-slate-700 mb-1">{error ? 'Store not found' : 'No phones found'}</h3>
            <p className="text-slate-400 text-sm mb-4">{error || 'Try different search or filters'}</p>
            {!error && (activeFilterCount > 0 || debouncedSearch) && (
              <button onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {phones.map((phone, i) => (
                <ProductCard key={phone.id} phone={phone} mobileNumber={mobileNumber} index={i} onSelect={setSelectedPhone} />
              ))}
              {loading && currentPage > 0 && Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
            </div>

            {currentPage < pageCount - 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : null}
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Filter & Sort drawer ── */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filterOptions={filterOptions}
        filters={filters}
        onChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={(v) => { setSortBy(v); }}
        onReset={resetFilters}
      />

      {/* ── Product sheet ── */}
      <AnimatePresence>
        {selectedPhone && (
          <ProductSheet
            phone={selectedPhone}
            mobileNumber={mobileNumber}
            onClose={() => setSelectedPhone(null)}
            onOpenLightbox={(images, idx, name) => setLightbox({ images, idx, name })}
          />
        )}
      </AnimatePresence>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.idx}
            name={lightbox.name}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
