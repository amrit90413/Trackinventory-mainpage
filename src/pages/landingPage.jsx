import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../composables/instance";

/* ───────────────────── static data ───────────────────── */
const SCREENSHOTS = [
    { src: "/screenshots/dashboard.jpg", label: "Dashboard Overview", desc: "Real-time business insights at a glance" },
    { src: "/screenshots/inventory.jpg", label: "Purchase Management", desc: "Track every product with IMEI & details" },
    { src: "/screenshots/ledger.jpg", label: "Ledger Book", desc: "Complete KhataBook for your business" },
    { src: "/screenshots/qrcode.jpg", label: "QR Code Sharing", desc: "Share your store inventory instantly" },
    { src: "/screenshots/signin.jpg", label: "Secure Sign In", desc: "Enterprise-grade authentication" },
];

const CATEGORIES = [
    {
        name: "Mobile",
        icon: "📱",
        desc: "Track mobile phones with IMEI, color, storage & warranty status",
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        name: "Vehicle",
        icon: "🚗",
        desc: "Manage vehicle inventory with registration, model & pricing details",
        gradient: "from-emerald-500 to-teal-400",
    },
    {
        name: "Electronics",
        icon: "💻",
        desc: "Track electronics with serial numbers, specifications & stock levels",
        gradient: "from-violet-500 to-purple-400",
    },
    {
        name: "Watch",
        icon: "⌚",
        desc: "Manage luxury watches with brand, model & authentication tracking",
        gradient: "from-amber-500 to-orange-400",
    },
    {
        name: "Gold",
        icon: "🪙",
        desc: "Track gold inventory with weight, purity, live rates & karats",
        gradient: "from-yellow-500 to-amber-400",
    },
];

const FEATURES = [
    { icon: "📊", title: "Real-Time Dashboard", desc: "Live overview of purchases, sales, stock value & leads — all in one glance." },
    { icon: "🛒", title: "Sales & Purchases", desc: "Record buy/sell transactions with full product details, profit tracking & history." },
    { icon: "📒", title: "Ledger / KhataBook", desc: "Maintain credit & debit records for every customer. Track who owes what." },
    { icon: "📷", title: "IMEI & Barcode Scanner", desc: "Scan barcodes or enter IMEI numbers to instantly find or add products." },
    { icon: "🔗", title: "QR Code Sharing", desc: "Generate a unique QR code for your store. Customers scan to view your inventory." },
    { icon: "🏪", title: "Multi-Business Support", desc: "Manage multiple business categories — Mobile, Vehicle, Electronics, Gold & Watch." },
    { icon: "📲", title: "WhatsApp Notifications", desc: "Get daily business summaries & pending balance reminders via WhatsApp." },
    { icon: "👥", title: "Lead Management", desc: "Track customer enquiries and leads. Never miss a potential sale." },
];

const HOW_IT_WORKS = [
    { title: "Create Account", desc: "Sign up in seconds with your email. It's free to start.", icon: "✨" },
    { title: "Set Up Your Business", desc: "Enter business details — name, type, location — and you are ready.", icon: "🏪" },
    { title: "Start Tracking", desc: "Add products, record sales & purchases, scan barcodes. Manage everything.", icon: "📦" },
    { title: "Grow Your Business", desc: "Use analytics, generate QR, share inventory & manage leads.", icon: "🚀" },
];

const FAQS = [
    { q: "What is Track Inventory?", a: "Track Inventory is a smart inventory management solution that helps you easily record, monitor, and control sales and stock of both new and used products across multiple business categories." },
    { q: "Who can use Track Inventory?", a: "Shopkeepers, warehouse managers, and retailers across Mobile, Vehicle, Electronics, Watch, and Gold businesses can use Track Inventory to efficiently manage their stock." },
    { q: "Does it cost anything to use?", a: "Track Inventory offers a free trial to get started. After the trial, affordable yearly subscription plans are available to suit different business needs." },
    { q: "Can I track both new and used products?", a: "Yes! Track Inventory is built to manage both new and second-hand products seamlessly, with full details like IMEI, serial numbers, and condition tracking." },
    { q: "Is my data safe?", a: "Absolutely. Your data is stored with enterprise-grade encryption and security. We perform regular backups to ensure your business information is always protected." },
    { q: "Can I access it on mobile?", a: "Yes. Track Inventory has a full-featured mobile app available on both iOS and Android. Manage your stock anytime, anywhere." },
    { q: "What categories does it support?", a: "Currently we support Mobile Phones, Vehicles, Electronics, Watches, and Gold — each with category-specific fields and tracking features." },
    { q: "How does the QR code feature work?", a: "You get a unique QR code for your store. When customers scan it, they can browse your available inventory directly — great for walk-in customers and sharing." },
];

const PRICING_PLANS = [
    {
        name: "Free Trial",
        price: "₹0",
        period: "7 days",
        desc: "Try all features risk-free",
        features: ["All categories", "Unlimited products", "Dashboard analytics", "QR code sharing", "WhatsApp alerts"],
        cta: "Start Free Trial",
        featured: false,
    },
    {
        name: "Pro — 1 Year",
        price: "₹999",
        period: "per year",
        desc: "Best for growing businesses",
        features: ["Everything in Free Trial", "Unlimited sales & purchases", "Ledger / KhataBook", "Lead Management", "Priority support", "Daily WhatsApp reports"],
        cta: "Subscribe Now",
        featured: true,
    },
    {
        name: "Pro — 2 Years",
        price: "₹1,499",
        period: "for 2 years",
        desc: "Maximum savings, long-term value",
        features: ["Everything in 1-Year Plan", "25% savings vs yearly", "Extended support", "Early access to new features"],
        cta: "Subscribe Now",
        featured: false,
    },
];

const CATEGORY_ICON_MAP = {
    "Mobile": "📱",
    "Vehicle": "🚗",
    "Electronics": "💻",
    "Watch": "⌚",
    "Gold": "🪙",
};

const INDIA_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

/* ───────────────────── animation variants ───────────────────── */
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    }),
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

/* ───────────────────── sub-components ───────────────────── */

/* --- Floating Phone Mockup --- */
const PhoneMockup = ({ src, label, index, total }) => {
    const angle = (index / total) * 360;
    const offsetX = Math.sin((angle * Math.PI) / 180) * 60;
    const offsetY = Math.cos((angle * Math.PI) / 180) * 20;
    return (
        <motion.div
            className="absolute"
            style={{
                left: `${50 + offsetX * 0.6}%`,
                top: `${50 + offsetY}%`,
                transform: "translate(-50%, -50%)",
                zIndex: total - index,
            }}
            initial={{ opacity: 0, scale: 0.7, y: 80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 + index * 0.15, ease: "easeOut" }}
        >
            <motion.div
                animate={{ y: [0, -12, 0], rotateY: [-2, 2, -2] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ perspective: "1000px" }}
            >
                <div
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/10"
                    style={{
                        width: "160px",
                        height: "320px",
                        transform: `rotateY(${-5 + index * 3}deg) rotateX(5deg)`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(83,109,254,0.15)",
                    }}
                >
                    <img src={src} alt={label} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
            </motion.div>
        </motion.div>
    );
};

/* --- Section wrapper --- */
const Section = ({ children, className = "", id, dark = false }) => (
    <section
        id={id}
        className={`relative py-10 sm:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24 ${dark ? "bg-[#0d1117]" : "bg-white"} ${className}`}
    >
        <div className="max-w-7xl mx-auto relative z-10">{children}</div>
    </section>
);

/* --- Section heading --- */
const SectionHeading = ({ eyebrow, title, subtitle, dark = false }) => (
    <motion.div
        className="text-center mb-8 sm:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
    >
        {eyebrow && (
            <span className={`inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? "text-blue-400" : "text-indigo-600"}`}>
                {eyebrow}
            </span>
        )}
        <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight font-['Space_Grotesk'] ${dark ? "text-white" : "text-gray-900"}`}>
            {title}
        </h2>
        {subtitle && (
            <p className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {subtitle}
            </p>
        )}
    </motion.div>
);

/* ───────────────────── Business Directory Section ───────────────────── */
const BusinessDirectory = () => {
    const navigate = useNavigate();

    // Shop directory state
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [activeStatesFromApi, setActiveStatesFromApi] = useState([]);
    const [cities, setCities] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeState, setActiveState] = useState("");
    const [activeCity, setActiveCity] = useState("");
    const [skip, setSkip] = useState(0);
    const take = 12;

    // Product search state
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [productResults, setProductResults] = useState(null); // null = not in search mode
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // When search is cleared, go back to directory mode
    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setProductResults(null);
            return;
        }
        const doSearch = async () => {
            try {
                setSearchLoading(true);
                const params = new URLSearchParams({ search: debouncedSearch.trim(), take: 20 });
                if (activeCategory && activeCategory !== "All") params.set("category", activeCategory);
                if (activeState) params.set("state", activeState);
                if (activeCity) params.set("city", activeCity);
                const res = await api.get(`/User/SearchProducts?${params.toString()}`);
                setProductResults(res?.data || null);
            } catch (err) {
                console.error("Product search error:", err);
                setProductResults({ results: {}, totalResults: 0 });
            } finally {
                setSearchLoading(false);
            }
        };
        doSearch();
    }, [debouncedSearch, activeCategory, activeState, activeCity]);

    const fetchDirectory = async (categoryFilter, stateFilter, cityFilter, skipVal) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set("skip", skipVal);
            params.set("take", take);
            if (categoryFilter && categoryFilter !== "All") params.set("category", categoryFilter);
            if (stateFilter) params.set("state", stateFilter);
            if (cityFilter) params.set("city", cityFilter);

            const res = await api.get(`/User/GetAllBusinessDirectory?${params.toString()}`);
            const data = res?.data;

            if (skipVal === 0) {
                setBusinesses(data?.businesses || []);
            } else {
                setBusinesses(prev => [...prev, ...(data?.businesses || [])]);
            }
            setTotalCount(data?.totalCount || 0);
            if (data?.states?.length > 0) {
                setActiveStatesFromApi(data.states);
            }
            if (data?.cities !== undefined) {
                setCities(data.cities);
            }
        } catch (err) {
            console.error("Directory fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSkip(0);
        fetchDirectory(activeCategory, activeState, activeCity, 0);
    }, [activeCategory, activeState, activeCity]);

    const handleLoadMore = () => {
        const newSkip = skip + take;
        setSkip(newSkip);
        fetchDirectory(activeCategory, activeState, activeCity, newSkip);
    };

    const categoryFilters = ["All", "Mobile", "Vehicle", "Electronics", "Watch"];
    const isSearchMode = !!debouncedSearch.trim();

    return (
        <Section id="business-directory" className="bg-gray-50">
            <SectionHeading
                eyebrow="Business Directory"
                title="Explore Shops Using TrackInventory"
                subtitle="Discover trusted shopkeepers managing their inventory with our platform. Click to view their products."
            />

            {/* Search Bar */}
            <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by shop name, owner, city, category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Filter Bar */}
            <motion.div
                className="flex flex-col gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {/* Category pills */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {categoryFilters.map((cat) => (
                        <motion.button
                            key={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeCategory === cat
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                            }`}
                            onClick={() => setActiveCategory(cat)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {cat !== "All" && <span className="mr-1">{CATEGORY_ICON_MAP[cat]}</span>}
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* State and City dropdowns */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <select
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                        value={activeState}
                        onChange={(e) => {
                            setActiveState(e.target.value);
                            setActiveCity("");
                        }}
                    >
                        <option value="">All States</option>
                        {INDIA_STATES.map((s) => (
                            <option key={s} value={s}>
                                {activeStatesFromApi.includes(s) ? `● ${s}` : s}
                            </option>
                        ))}
                    </select>

                    {(cities.length > 0 || activeState) && (
                        <select
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                            value={activeCity}
                            onChange={(e) => setActiveCity(e.target.value)}
                        >
                            <option value="">All Cities</option>
                            {cities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    )}
                </div>
            </motion.div>

            {/* ── PRODUCT SEARCH RESULTS ── */}
            {isSearchMode ? (
                <>
                    {searchLoading ? (
                        <div className="text-center py-16">
                            <motion.div
                                className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="mt-4 text-gray-500">Searching products...</p>
                        </div>
                    ) : productResults?.totalResults === 0 ? (
                        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-gray-500 text-lg">No products found for &ldquo;{debouncedSearch}&rdquo;</p>
                            <p className="text-gray-400 text-sm mt-2">Try different keywords or change the filters.</p>
                        </motion.div>
                    ) : productResults ? (
                        <>
                            <p className="text-sm text-gray-500 mb-6 text-center">
                                {productResults.totalResults} product{productResults.totalResults !== 1 ? "s" : ""} found for &ldquo;{debouncedSearch}&rdquo;
                            </p>
                            {Object.entries(productResults.results || {}).map(([cat, catData]) =>
                                catData.items?.length > 0 ? (
                                    <div key={cat} className="mb-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xl">{CATEGORY_ICON_MAP[cat] || "📦"}</span>
                                            <h3 className="text-base font-bold text-gray-800">{cat}</h3>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{catData.total} found</span>
                                        </div>
                                        <motion.div
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                            variants={staggerContainer}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {catData.items.map((product, i) => (
                                                <motion.div
                                                    key={product.productId || i}
                                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                                                    variants={fadeInUp}
                                                    custom={i % 4}
                                                    whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(26,35,126,0.10)" }}
                                                    onClick={() => product.websiteName && navigate(`/${product.websiteName}`)}
                                                >
                                                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
                                                    <div className="p-4">
                                                        <div className="flex items-start gap-3 mb-2">
                                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-lg shrink-0">
                                                                {CATEGORY_ICON_MAP[cat] || "📦"}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
                                                                    {product.name || "Product"}
                                                                </p>
                                                                {product.price > 0 && (
                                                                    <p className="text-xs font-semibold text-green-600">
                                                                        ₹{product.price.toLocaleString("en-IN")}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mb-3">
                                                            {product.color && (
                                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">{product.color}</span>
                                                            )}
                                                            {product.identifier && (
                                                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono">{product.identifier}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-semibold text-gray-700 truncate">{product.shopName}</p>
                                                                <p className="text-[10px] text-gray-400 truncate">📍 {[product.city, product.state].filter(Boolean).join(", ")}</p>
                                                            </div>
                                                            <span className="text-indigo-600 text-xs font-semibold shrink-0 ml-2 group-hover:underline">View Shop →</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                ) : null
                            )}
                        </>
                    ) : null}
                </>
            ) : (
                /* ── SHOP DIRECTORY ── */
                <>
                    {loading && businesses.length === 0 ? (
                        <div className="text-center py-16">
                            <motion.div
                                className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="mt-4 text-gray-500">Loading businesses...</p>
                        </div>
                    ) : businesses.length === 0 ? (
                        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="text-5xl mb-4">🏪</div>
                            <p className="text-gray-500 text-lg">No businesses found for the selected filters.</p>
                            <p className="text-gray-400 text-sm mt-2">Try changing the category or state filter.</p>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                key={`grid-${businesses.length}`}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                            >
                                {businesses.map((biz, i) => (
                                    <motion.div
                                        key={`${biz.websiteName}-${i}`}
                                        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                                        variants={fadeInUp}
                                        custom={i % 4}
                                        whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(26, 35, 126, 0.10)" }}
                                        onClick={() => { if (biz.websiteName) navigate(`/${biz.websiteName}`); }}
                                    >
                                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />
                                        <div className="p-4 sm:p-5">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                        {CATEGORY_ICON_MAP[biz.categoryName] || "🏪"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                                                            {biz.businessName || "Unnamed Shop"}
                                                        </h3>
                                                        <p className="text-xs text-gray-400 truncate">by {biz.ownerName || "Shop Owner"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                                    {CATEGORY_ICON_MAP[biz.categoryName] || "📦"} {biz.categoryName || "General"}
                                                </span>
                                                {biz.city && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                        📍 {biz.city}
                                                    </span>
                                                )}
                                                {biz.state && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                        {biz.state}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {biz.createdOn ? new Date(biz.createdOn).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
                                                </span>
                                                <motion.span className="inline-flex items-center gap-1 text-blue-600 text-xs sm:text-sm font-semibold group-hover:gap-2 transition-all" whileHover={{ x: 2 }}>
                                                    View Inventory
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </motion.span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {businesses.length < totalCount && (
                                <div className="text-center mt-8">
                                    <motion.button
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl text-sm disabled:opacity-50"
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : `Load More (${businesses.length} of ${totalCount})`}
                                    </motion.button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </Section>
    );
};

/* ───────────────────── main component ───────────────────── */
const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeScreenshot, setActiveScreenshot] = useState(0);
    const { scrollY } = useScroll();
    const heroParallax = useTransform(scrollY, [0, 600], [0, -150]);
    const navigate = useNavigate();

    const refServices = useRef(null);
    const refDomains = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTo = params.get("scroll");
        if (scrollTo === "services") {
            refServices.current?.scrollIntoView({ behavior: "smooth" });
        } else if (scrollTo === "domains") {
            refDomains.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.search]);

    const handleClick = (type) => {
        if (type === "services") {
            refServices.current?.scrollIntoView({ behavior: "smooth" });
        } else if (type === "domains") {
            refDomains.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const scrollToId = location.state?.scrollToId;
        if (scrollToId) {
            const el = document.getElementById(scrollToId);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }, [location.state]);

    /* Auto-rotate screenshots */
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveScreenshot(prev => (prev + 1) % SCREENSHOTS.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] overflow-x-hidden">
            <Header handleClick={handleClick} />

            {/* ══════════════════  HERO  ══════════════════ */}
            <section className="relative min-h-[90vh] sm:min-h-[100vh] flex items-center overflow-hidden bg-[#0d1117]">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(0,123,255,0.25) 0%, transparent 70%)" }}
                        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(0,210,255,0.15) 0%, transparent 70%)" }}
                        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(0,123,255,0.12) 0%, transparent 70%)" }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10 sm:pb-12">
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-[60vh] sm:min-h-[70vh]">
                        {/* Left: Copy */}
                        <motion.div
                            style={{ y: heroParallax }}
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Available on iOS & Android
                            </motion.div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight font-['Space_Grotesk']">
                                Smart Inventory{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
                                    for Every
                                </span>
                                <br />
                                Business
                            </h1>

                            <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg">
                                Track sales, purchases, stock & leads across <strong className="text-gray-300">Mobile, Vehicle, Electronics, Watch & Gold</strong> — all from one powerful app.
                            </p>

                            {/* CTA buttons */}
                            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {/* Apple App Store */}
                                <motion.a
                                    href="https://apps.apple.com/app/id6761967123"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512" className="w-6 h-6">
                                        <path d="M318.7 268.7c-.2-36.7 16.3-64.4 50-84.8-18.7-26.7-46.7-41.3-85.3-44-35.9-2.5-75.5 21.3-89.1 21.3-14.1 0-47.8-20.4-74.2-19.9-38.2.6-70.6 22.1-89.4 56.2-38.3 66.6-9.8 164.9 27.5 218.8 18.2 26.6 39.8 56.3 68.2 55.1 27.5-1.1 38.1-17.7 71.5-17.7 33.1 0 42.8 17.7 71.9 17.2 29.8-.5 48.6-27.1 66.7-53.8 11.6-17.1 16.4-26 25.7-45.7-67.6-25.7-63.5-101.3-63.5-102.5zM252.5 80.3c26.7-32.4 24.3-61.7 23.6-72.3-23 1.3-49.5 15.4-64.9 33.7-16.8 19.9-28.2 47.7-24.9 75.6 26.3 2 52.7-13.3 66.2-37z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] opacity-60 leading-none">Download on the</div>
                                        <div className="text-sm font-bold leading-tight">App Store</div>
                                    </div>
                                </motion.a>

                                {/* Google Play Store */}
                                <motion.a
                                    href="https://play.google.com/store/apps/details?id=com.sahil90413.trackinventory&hl=es_419"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7">
                                        <path fill="#FFD400" d="M325.3 234.3l-192-192L426.7 256z" />
                                        <path fill="#FF3333" d="M132.7 42.3l144 144L132.7 330.3z" />
                                        <path fill="#48FF48" d="M276.7 186.3l144 144-288 165.4z" />
                                        <path fill="#00C3FF" d="M132.7 330.3v139.4l144-144z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] opacity-60 leading-none">GET IT ON</div>
                                        <div className="text-sm font-bold leading-tight">Google Play</div>
                                    </div>
                                </motion.a>
                            </div>

                            {/* Stats row */}
                            <div className="mt-6 sm:mt-10 flex gap-6 sm:gap-8 flex-wrap">
                                {[
                                    { val: "5+", label: "Business Categories" },
                                    { val: "24/7", label: "Real-Time Tracking" },
                                    { val: "Free", label: "Trial Available" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                    >
                                        <div className="text-2xl font-bold text-white">{stat.val}</div>
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: 3D floating phones */}
                        <motion.div
                            className="relative h-[420px] sm:h-[520px] hidden lg:block"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            {/* Central glow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-indigo-600/20 to-blue-600/20 blur-3xl" />
                            </div>
                            {SCREENSHOTS.map((ss, i) => (
                                <PhoneMockup key={i} src={ss.src} label={ss.label} index={i} total={SCREENSHOTS.length} />
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-20" />
            </section>

            {/* ══════════════════  BUSINESS DIRECTORY  ══════════════════ */}
            <BusinessDirectory />

            {/* ══════════════════  INTRODUCTION  ══════════════════ */}
            <Section id="introduction">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-3">
                            About Us
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight font-['Space_Grotesk'] leading-tight">
                            Every Moment{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                                Earns You More.
                            </span>
                        </h2>
                        <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed">
                            We built Track Inventory to solve the everyday challenges shopkeepers face in managing their business.
                            It provides the simplest way to record and monitor sales and purchases of both new and used products.
                        </p>
                        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                            Whether you manage a small shop, a warehouse, or multi-location retail — gain complete control over your stock with smart analytics and real-time tracking.
                        </p>
                        <motion.button
                            className="mt-8 group bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(26, 35, 126, 0.3)" }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/sign-up')}
                        >
                            <span className="flex items-center gap-2">
                                Get Started Free
                                <motion.svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Right side — feature list cards */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-indigo-500/80 to-blue-600/80 rounded-3xl p-1 shadow-2xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="bg-white rounded-[1.35rem] p-6 sm:p-8">
                                <div className="space-y-4">
                                    {[
                                        { icon: "📊", title: "Real-Time Inventory Tracking", desc: "Live dashboard with stock counts & values" },
                                        { icon: "🛒", title: "Sales & Purchase Management", desc: "Full buy/sell workflow with profit tracking" },
                                        { icon: "📒", title: "KhataBook / Ledger", desc: "Credit & debit management for every customer" },
                                        { icon: "📷", title: "Barcode & IMEI Scanner", desc: "Instant product lookup with camera" },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-4 group hover:bg-indigo-50 p-3 rounded-xl transition-colors duration-300"
                                            whileHover={{ x: 8 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <motion.div
                                                className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center shrink-0"
                                                whileHover={{ scale: 1.1, rotate: 8 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="text-2xl">{item.icon}</span>
                                            </motion.div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* ══════════════════  BUSINESS CATEGORIES  ══════════════════ */}
            <Section id="categories" className="bg-gray-50">
                <SectionHeading
                    eyebrow="Business Categories"
                    title="Built for Your Industry"
                    subtitle="Specialized inventory tracking tailored to your specific business domain"
                />

                {/* Mobile: horizontal scroll row */}
                <div className="sm:hidden overflow-x-auto pb-2 -mx-4 px-4">
                    <motion.div
                        className="flex gap-3 w-max"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col items-center gap-2 shrink-0 w-[100px]"
                                variants={fadeInUp}
                                custom={i}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl shadow-md`}>
                                    {cat.icon}
                                </div>
                                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
                                <p className="text-[10px] text-gray-400 text-center leading-snug line-clamp-2">{cat.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Tablet / Desktop: grid */}
                <motion.div
                    className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={i}
                            className="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 transition-all duration-300 cursor-default"
                            variants={fadeInUp}
                            custom={i}
                            whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {cat.icon}
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1.5">{cat.name}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>



            {/* ══════════════════  APP SCREENSHOTS SHOWCASE  ══════════════════ */}
            <section id="app-showcase" className="relative py-16 sm:py-24 overflow-hidden bg-[#0d1117] scroll-mt-24">
                {/* Ambient backgrounds */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        eyebrow="App Preview"
                        title="See It In Action"
                        subtitle="A powerful, beautiful app built to manage your complete business operations"
                        dark
                    />

                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Main phone display */}
                        <div className="relative flex-1 flex items-center justify-center" style={{ perspective: "1200px" }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeScreenshot}
                                    className="relative"
                                    initial={{ opacity: 0, rotateY: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotateY: -30, scale: 0.9 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    {/* Phone frame */}
                                    <div className="relative mx-auto" style={{ width: "280px" }}>
                                        <div className="rounded-[2.5rem] overflow-hidden border-[3px] border-white/10 shadow-2xl bg-black"
                                            style={{ boxShadow: "0 30px 80px rgba(26,35,126,0.3), 0 0 0 1px rgba(255,255,255,0.05)" }}
                                        >
                                            {/* Notch */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
                                            <img
                                                src={SCREENSHOTS[activeScreenshot].src}
                                                alt={SCREENSHOTS[activeScreenshot].label}
                                                className="w-full aspect-[9/19.5] object-cover"
                                            />
                                        </div>
                                        {/* Reflection glow */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-16 bg-indigo-500/20 blur-2xl rounded-full" />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Screenshot selector */}
                        <div className="flex-1 max-w-md">
                            <div className="space-y-3">
                                {SCREENSHOTS.map((ss, i) => (
                                    <motion.button
                                        key={i}
                                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 ${
                                            activeScreenshot === i
                                                ? "bg-white/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                                : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                                        }`}
                                        onClick={() => setActiveScreenshot(i)}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                                                activeScreenshot === i
                                                    ? "bg-gradient-to-br from-indigo-500 to-blue-500"
                                                    : "bg-white/10"
                                            }`}>
                                                {["📊", "🛒", "📒", "🔗", "🔐"][i]}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold text-sm ${activeScreenshot === i ? "text-white" : "text-gray-300"}`}>
                                                    {ss.label}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{ss.desc}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════  FEATURES  ══════════════════ */}
            <Section id="features" ref={refServices}>
                <SectionHeading
                    eyebrow="Features"
                    title="Everything You Need"
                    subtitle="Powerful tools built to simplify inventory management for every type of business"
                />
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            className="group relative bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300"
                            variants={fadeInUp}
                            custom={i}
                            whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                {f.icon}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">{f.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>

            {/* ══════════════════  HOW IT WORKS  ══════════════════ */}
            <Section id="how-it-works" className="bg-gray-50">
                <SectionHeading
                    eyebrow="Getting Started"
                    title="How It Works"
                    subtitle="Four simple steps to transform your inventory management"
                />
                <div className="max-w-3xl mx-auto relative">
                    {/* Connector line */}
                    <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-indigo-500 hidden sm:block" />

                    <div className="space-y-8">
                        {HOW_IT_WORKS.map((step, i) => (
                            <motion.div
                                key={i}
                                className="relative flex gap-6 sm:gap-8"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                            >
                                {/* Step number */}
                                <div className="shrink-0 relative z-10">
                                    <motion.div
                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {step.icon}
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                            Step {i + 1}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════════════  PRICING  ══════════════════ */}
            <Section id="pricing" className="bg-[#0d1117]" dark>
                <SectionHeading
                    eyebrow="Pricing"
                    title="Simple, Transparent Plans"
                    subtitle="Start free, upgrade when you're ready. No hidden fees."
                    dark
                />
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {PRICING_PLANS.map((plan, i) => (
                        <motion.div
                            key={i}
                            className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                                plan.featured
                                    ? "bg-gradient-to-b from-indigo-900/40 to-blue-900/20 border-indigo-500/40 shadow-2xl shadow-indigo-500/10 scale-[1.03]"
                                    : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"
                            }`}
                            variants={fadeInUp}
                            custom={i}
                            whileHover={{ y: -8 }}
                        >
                            {plan.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                            <p className="text-sm text-gray-400 mb-5">{plan.desc}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-extrabold text-white font-['Space_Grotesk']">{plan.price}</span>
                                <span className="text-gray-400 text-sm ml-2">/ {plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                                        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                    plan.featured
                                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:shadow-xl"
                                        : "bg-white/10 text-white border border-white/10 hover:bg-white/15"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/subscribe')}
                            >
                                {plan.cta}
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    Prices may vary by category. Payments processed securely via Razorpay.
                </p>
            </Section>

            {/* ══════════════════  FAQ  ══════════════════ */}
            <Section id="faqs">
                <SectionHeading
                    eyebrow="Support"
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know about Track Inventory"
                />
                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQS.map((faq, i) => (
                        <motion.div
                            key={i}
                            className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center group hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                            >
                                <span className="font-semibold text-gray-900 pr-4 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">
                                    {faq.q}
                                </span>
                                <motion.span
                                    className="text-xl text-gray-400 group-hover:text-indigo-500 shrink-0 inline-block"
                                    animate={{ rotate: activeFaq === i ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    +
                                </motion.span>
                            </button>
                            <AnimatePresence>
                                {activeFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 pt-0">
                                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ══════════════════  FINAL CTA  ══════════════════ */}
            <section className="relative py-20 sm:py-28 overflow-hidden bg-[#0d1117]">
                {/* Ambient */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-['Space_Grotesk'] mb-5">
                            Ready to{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Transform
                            </span>{" "}
                            Your Business?
                        </h2>
                        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                            Join thousands of shopkeepers using Track Inventory to streamline their operations and grow their business.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl text-base"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/sign-up')}
                            >
                                🚀 Start Free Trial
                            </motion.button>
                            <motion.button
                                className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold border border-white/10 hover:bg-white/15 text-base"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/contact-us')}
                            >
                                📞 Contact Us
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;