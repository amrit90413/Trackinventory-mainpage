import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
        },
        {
            question: "Does Track Inventory support multiple users?",
            answer: "Yes, you can add team members and manage permissions to collaborate on inventory management."
        },
        {
            question: "Can I export reports?",
            answer: "Yes, Track Inventory lets you generate and export sales and stock reports for better insights."
        }
    ];

    return (
        <>
            <Header />
            <div className="pt-24 min-h-screen bg-gray-50 text-gray-900">
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
            </div>
            <Footer />
        </>
    );
}

export default FaqPage;