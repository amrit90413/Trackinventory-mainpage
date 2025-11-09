import Header from "../components/Header"
import Footer from "../components/Footer"
import { motion } from "framer-motion"

const TermsOfServices = () => {
	const containerVariants = {
		hidden: { opacity: 0, y: 12 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5
			}
		}
	}

	const fadeInUp = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut"
			}
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
			<div className="absolute inset-0">
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
				</div>
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/30 via-transparent to-blue-900/30"></div>
				<div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-slate-800/20 via-transparent to-indigo-800/20"></div>
			</div>

			<div className="relative z-10">
				<Header />
				<main className="pt-32 sm:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
					<div className="max-w-4xl mx-auto">
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="space-y-8"
						>
							<motion.h1
								className="text-bold text-white text-4xl mb-8 transition-all duration-500 hover:text-indigo-400 hover:tracking-widest"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1 }}
							>
								<h1 className="text-bold text-white text-4xl mb-8 transition-all duration-700 hover:text-indigo-400 hover:tracking-widest">
									TERMS OF SERVICE
								</h1>
							</motion.h1>

							<motion.div variants={containerVariants} className="space-y-8">
								<motion.div
									variants={itemVariants}
									className="prose prose-base sm:prose-lg md:prose-xl prose-invert max-w-none p-6 sm:p-8 lg:p-12 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
								>

									{/* 1 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">1</span>
										Acceptance of Terms
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 text-sm sm:text-base md:text-lg">
										By downloading, accessing, or using TrackInventory (the “Service”), you agree to be bound by these Terms and our Privacy Policy. If you do not agree, discontinue use immediately.
									</motion.p>

									{/* 2 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">2</span>
										License & Intellectual Property
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										You are granted a limited, non-exclusive, non-transferable, revocable license to use the Application. You may not reverse-engineer, copy, modify, distribute, or create derivative works. All rights remain owned by the Service Provider.
									</motion.p>

									{/* 3 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">3</span>
										Personal Data & Security
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										The Application stores and processes personal and business data required to provide functionality. You are responsible for device security, passwords, and preventing unauthorized access. Jailbroken or rooted devices may cause malfunction and are not supported.
									</motion.p>

									{/* 4 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">4</span>
										Internet & Data Charges
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										Some functions require an active internet connection. You accept responsibility for any carrier charges, including data roaming. The Service Provider is not responsible for network outages or slow connectivity.
									</motion.p>

									{/* 5 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">5</span>
										Device Responsibility
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										You are responsible for ensuring your device remains charged, functional, and maintained. The Service Provider is not liable for access loss due to device failure.
									</motion.p>

									{/* 6 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">6</span>
										Data Accuracy
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										Inventory records may depend on user input and third-party systems. The Service Provider is not liable for inaccurate data or losses resulting from reliance on such information.
									</motion.p>

									{/* 7 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">7</span>
										Updates & Modifications
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										Operating system updates may affect performance. You agree to accept updates to continue using the Service. Features may be changed, added, or removed without notice.
									</motion.p>

									{/* 8 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">8</span>
										Termination
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										The Service Provider may suspend or terminate your access if you violate these Terms, misuse the Service, or if the Application is discontinued.
									</motion.p>

									{/* 9 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">9</span>
										Limitation of Liability
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										The Service is provided “as-is.” To the maximum extent permitted by law, the Service Provider is not responsible for indirect, incidental, or consequential damages.
									</motion.p>

									{/* 10 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">10</span>
										Changes to These Terms
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 text-sm sm:text-base md:text-lg">
										These Terms may be updated periodically. Continued use after updates constitutes acceptance. Last updated: November 08, 2025.
									</motion.p>

									{/* 11 */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">11</span>
										Contact Us
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 text-sm sm:text-base md:text-lg">
										Questions about these Terms? Contact us at
										<motion.span
											className="ml-2 font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-base inline-block"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											smartstock33@gmail.com
										</motion.span>
									</motion.p>

								</motion.div>
							</motion.div>
						</motion.div>
					</div>
				</main>
				<Footer />
			</div>
		</div>
	)
}
export default TermsOfServices