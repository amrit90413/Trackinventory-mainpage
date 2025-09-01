import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import FaqPage from "./faqPage"
import { useLocation } from "react-router-dom";

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
            answer: "Track Inventory is a student engagement app that rewards you for going to school sports and arts events, taking pics, and showing school spirit."
        },
        {
            question: "How do I earn points?",
            answer: "You earn points by uploading photos and videos from events and unlocking streaks to boost your rewards!"
        },
        {
            question: "What can I redeem points for?",
            answer: "Points can be redeemed for school-branded merch like shirts, sweatpants, shorts, and other gear - all free or discounted, just by showing up and participating."
        },
        {
            question: "Who can use Track Inventory?",
            answer: "Currently, it's for high school students at participating schools. If your school isn't involved yet, let us know and we will work to bring this transformative experience to your campus."
        },
        {
            question: "What kind of photos should I upload?",
            answer: "Anything fun and appropriate from the event - action shots, crowd hype, halftime moments, team support, etc. Just keep it respectful and school-friendly."
        },
        {
            question: "How is content moderated?",
            answer: "All uploads are reviewed by your school's admin team or event moderators. Inappropriate or off-topic content may be removed and is subject to disciplinary action by the terms of your administration."
        },
        {
            question: "Can I see other students' posts?",
            answer: "Yes! There's a media feed where you can scroll through pics and videos from schools across your city and like your favorites."
        },
        {
            question: "Does it cost anything to use?",
            answer: "Nope, Track Inventory is totally free to use. Just show up, participate, and start racking up points."
        },
        {
            question: "Do I need an account to use the app?",
            answer: "Yes, you'll need to sign up with your school email to track your points and redeem rewards."
        },
        {
            question: "How do I redeem rewards?",
            answer: "Once you've earned enough points, just head to the \"Store\" page and unlock your reward. You'll get instructions on how and when to pick it up at school."
        },
        {
            question: "What if I forget to check in at an event?",
            answer: "No worries, you will still receive points, but remember, marking your attendance boosts engagement for everyone."
        },
        {
            question: "Can I report something inappropriate?",
            answer: "Yep, you can flag any post you think breaks the guidelines, and our team or your school admins will review it."
        }
    ];

    const howItWorksSteps = [
        {
            title: "Capture",
            description: "Show out at events and capture the moments that matter.",
            icon: "📸"
        },
        {
            title: "Upload",
            description: "Post your clips and Fliks to climb the leaderboard.",
            icon: "⬆️"
        },
        {
            title: "Engage",
            description: "Interact and view content from fans and schools across your city.",
            icon: "💬"
        },
        {
            title: "Earn Rewards",
            description: "Rack up points and unlock limited time clothing drops.",
            icon: "🏆"
        },
        {
            title: "Redeem",
            description: "Use your points to claim exclusive merchandise and sportswear.",
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

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
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
                        className="mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1
                            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight gradient"
                            variants={itemVariants}
                        >
                            Your Moments<br />
                            <motion.span
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                Live Here
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            className="text-xl sm:text-2xl mb-8 text-gray-300"
                            variants={itemVariants}
                        >
                            To access shady side events and sports
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
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
                            Where Every Game is a Story.
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
                                Track Inventory is your all-access pass to the most exciting moments in
                                high school sports and arts. Snap pics, share highlights, and earn
                                points for showing off your school spirit. Connect and compete with
                                friends, support your school, and unlock exclusive gear throughout
                                the year.
                            </p>
                            <motion.button
                                className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300" onClick={() => window.location.href = "/contact-us"}
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
                                            { icon: "📱", title: "Capture Moments", desc: "Share your school spirit" },
                                            { icon: "🏆", title: "Earn Points", desc: "Rack up rewards" },
                                            { icon: "🎁", title: "Redeem Rewards", desc: "Get exclusive merch" },
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