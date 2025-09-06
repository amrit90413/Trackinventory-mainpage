import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react";

const FaqPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

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

    <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
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
                            <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
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
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

            </motion.div>
        </div>
    </section>
}
export default FaqPage