import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom";

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, -100]);

    const refServices = useRef < HTMLElement | null > (null);
    const refDomains = useRef < HTMLElement | null > (null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTo = params.get("scroll");

        if (scrollTo === "services") {
            refServices.current?.scrollIntoView({ behavior: "smooth" });
        } else if (scrollTo === "domains") {
            refDomains.current?.scrollIntoView({ behavior: "smooth" });
        }
        else return
    }, [location.search]);

    const handleClick = () => {
        if (type === "services") {
            refServices.current?.scrollIntoView({ behavior: "smooth" });
        } else if (type === "domains") {
            refDomains.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    useEffect(() => {
        const scrollToId = location.state?.scrollToId;
        if (scrollToId) {
            const el = document.getElementById(scrollToId);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location.state]);

    const faqs = [
        {
            question: "What is Track Inventory?",
            answer: "Track Inventory is a smart inventory management solution that helps you to easily record, monitor, and control the sales and stock of both new and used products."
        },
        {
            question: "Who can use Track Inventory?",
            answer: "Track Inventory can be used by shopkeepers, warehouse managers, and retailers to efficiently manage and control their stock."
        },
        {
            question: "How is content moderated?",
            answer: "Content is moderated through automated checks and manual reviews to ensure it is safe, accurate, and free from harmful or inappropriate material."
        },
        {
            question: "Does it cost anything to use?",
            answer: "Track Inventory is designed to be affordable, with flexible plans that suit different business needs, and even offers a free option to get started."
        },
        {
            question: "Do I need an account to use the app?",
            answer: "Yes, you'll need to sign up with your email to track and maintain your records."
        }, {
            question: "Can I track both new and used products?",
            answer: "Yes, Track Inventory allows you to manage sales and stock of both new and used products seamlessly."
        },
        {
            question: "Is my data safe?",
            answer: "Yes, your data is securely stored with encryption to keep your business information protected."
        },
        {
            question: "Can I access Track Inventory on mobile?",
            answer: "Yes, Track Inventory works across devices so you can manage your stock anytime, anywhere."
        }

    ];

    const howItWorksSteps = [
        {
            title: "Create account",
            description: "To get started, users need to create an account by filling in the required information.",
            icon: "📸"
        },
        {
            title: "Business details",
            description: "Enter your business information such as name, type and other details to set up your profile.",
            icon: "⬆️"
        },
        {
            title: "Engage",
            description: "Engage with the platform by interacting and viewing relevant content.",
            icon: "💬"
        },
        {
            title: "Trial session",
            description: "Start a free trial session to explore all features.",
            icon: "🎁"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const blobVariants = {
        animate: {
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
            transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 overflow-x-hidden">
            <Header handleClick={handleClick} />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    variants={blobVariants}
                    animate="animate"
                />
                <motion.div
                    className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    variants={blobVariants}
                    animate="animate"
                    transition={{ delay: 2 }}
                />
                <motion.div
                    className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    variants={blobVariants}
                    animate="animate"
                    transition={{ delay: 4 }}
                />
            </div>

            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <motion.div
                    className="relative z-10 text-center text-white max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        {/* Apple App Store Button - replace href with direct app link when App Store ID is available */}
                        <a
                            href="https://apps.apple.com/search?term=Track%20Inventory"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.button
                                className="group bg-white/90 backdrop-blur-sm text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/95 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl border border-white/20"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="w-6 h-6"
                                        whileHover={{ scale: 1.05, rotate: 3 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        {/* Apple Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 384 512"
                                            className="w-6 h-6"
                                        >
                                            <path d="M318.7 268.7c-.2-36.7 16.3-64.4 50-84.8-18.7-26.7-46.7-41.3-85.3-44-35.9-2.5-75.5 21.3-89.1 21.3-14.1 0-47.8-20.4-74.2-19.9-38.2.6-70.6 22.1-89.4 56.2-38.3 66.6-9.8 164.9 27.5 218.8 18.2 26.6 39.8 56.3 68.2 55.1 27.5-1.1 38.1-17.7 71.5-17.7 33.1 0 42.8 17.7 71.9 17.2 29.8-.5 48.6-27.1 66.7-53.8 11.6-17.1 16.4-26 25.7-45.7-67.6-25.7-63.5-101.3-63.5-102.5zM252.5 80.3c26.7-32.4 24.3-61.7 23.6-72.3-23 1.3-49.5 15.4-64.9 33.7-16.8 19.9-28.2 47.7-24.9 75.6 26.3 2 52.7-13.3 66.2-37z" />
                                        </svg>
                                    </motion.div>
                                    <div className="text-left">
                                        <div className="text-xs opacity-70">Download on the</div>
                                        <div className="text-sm font-bold">App Store</div>
                                    </div>
                                </div>
                            </motion.button>
                        </a>

                        {/* Google Play Store Button */}
                        <motion.button
                            className="group bg-white/90 backdrop-blur-sm text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/95 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl border border-white/20"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-7 h-7"
                                    whileHover={{ scale: 1.05, rotate: 3 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    {/* Official Google Play Badge Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7">
                                        <path fill="#FFD400" d="M325.3 234.3l-192-192L426.7 256z" />
                                        <path fill="#FF3333" d="M132.7 42.3l144 144L132.7 330.3z" />
                                        <path fill="#48FF48" d="M276.7 186.3l144 144-288 165.4z" />
                                        <path fill="#00C3FF" d="M132.7 330.3v139.4l144-144z" />
                                    </svg>
                                </motion.div>
                                <Link to={"https://play.google.com/store/apps/details?id=com.sahil90413.trackinventory&hl=es_419"} target="_blank">
                                <div className="text-left">
                                    <div className="text-xs opacity-70">GET IT ON</div>
                                    <div className="text-sm font-bold">Google Play</div>
                                </div>
                                </Link>
                            </div>
                        </motion.button>
                    </motion.div>

                </motion.div>
            </section>

            <section id="introduction" className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white relative scroll-mt-24">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-8 sm:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 sm:mb-6">
                            Introduction to Track Inventory
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-8">
                            Smarter way to Inventory Management
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                                Every Moment
                                <motion.span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <br />
                                    Earns You More.
                                </motion.span>
                            </h3>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                                We are here to serve you with the best solution in the market built to solve the everyday challenges that shopkeepers face in managing their business.Track Inventory provides the simplest way to record and monitor sales and purchases of both new and used products.
                                With Track Inventory you gain complete control over your stock. Whether you manage a small shop, a warehouse, or retail operations
                            </p>
                            <motion.button
                                className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(219, 39, 119, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="flex items-center gap-2">
                                    Interact with Track Inventory
                                    <motion.svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </motion.svg>
                                </span>
                            </motion.button>
                        </motion.div>
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl p-8 transform shadow-2xl"
                                whileHover={{ rotate: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-xl">
                                    <div className="space-y-4">
                                        {[
                                            { icon: "📱", title: "Real-Time Inventory Tracking", desc: "Track record" },
                                            { icon: "🏆", title: "Supplier & Purchase Order Management", desc: "Order management" },
                                            { icon: "🎁", title: "	Supplier & Purchase Order Management", desc: "Easy to manage" },
                                        ].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-300"
                                                whileHover={{ x: 10 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <motion.div
                                                    className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center"
                                                    whileHover={{ scale: 1.1, rotate: 12 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <span className="text-2xl">{item.icon}</span>
                                                </motion.div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-10 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white relative scroll-mt-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-10 sm:mb-20"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-gray-500 text-base sm:text-lg">Follow these simple steps to get started and stand out.</p>
                    </motion.div>

                    <div className="relative border-l-4 border-pink-500 pl-6 space-y-14">
                        {howItWorksSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <div className="absolute -left-9 top-1 w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                                    {index + 1}
                                </div>

                                <div className="bg-gray-50 hover:bg-white transition rounded-xl p-6 shadow-md group border border-transparent hover:border-pink-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-3xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-l sm:text-2xl font-semibold text-gray-800 group-hover:text-pink-600 transition">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mt-3 pl-16">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faqs" className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-6 sm:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl sm:text-5xl font-bold text-gray-900">
                            FAQs
                        </h2>
                    </motion.div>

                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                                variants={itemVariants}
                                whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                            >
                                <motion.button
                                    className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-300 flex justify-between items-center group"
                                    onClick={() => toggleFaq(index)}
                                    whileHover={{ backgroundColor: "#f3f4f6" }}
                                >
                                    <span className="font-semibold text-gray-900 group-hover:text-purple-500 to-indigo-500 transition-colors duration-300">
                                        {faq.question}
                                    </span>
                                    <motion.span
                                        className="text-2xl text-gray-600 group-hover:text-indigo-600 transition-colors duration-300 inline-block"
                                        animate={{ rotate: activeFaq === index ? 45 : 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }} // Slow rotation
                                    >
                                        +
                                    </motion.span>
                                </motion.button>

                                <AnimatePresence>
                                    {activeFaq === index && (
                                        <motion.div
                                            className="overflow-hidden"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 py-4 bg-white border-t border-gray-200">
                                                <p className="text-[14px] sm:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
export default LandingPage