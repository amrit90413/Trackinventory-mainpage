import Header from "../components/Header"
import Footer from "../components/Footer"
import { motion } from "framer-motion"

const PrivacyPolicy = () => {
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
				<motion.div
					className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 rounded-full blur-3xl"
					animate={{
						x: [0, 30, -20, 0],
						y: [0, -50, 20, 0],
						scale: [1, 1.1, 0.9, 1]
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>
				<motion.div
					className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl"
					animate={{
						x: [0, -40, 30, 0],
						y: [0, 60, -30, 0],
						scale: [1, 0.9, 1.1, 1]
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 5
					}}
				/>
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
				</div>
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
								PRIVACY POLICY
							</motion.h1>
							<motion.div variants={containerVariants} className="space-y-8">
								<motion.div
									variants={itemVariants}
									className="prose prose-base sm:prose-lg md:prose-xl prose-invert max-w-none p-6 sm:p-8 lg:p-12 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
								>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										This privacy policy applies to the TrackInventory app (hereby referred to as the "Application") for mobile devices that was created by Amritpal Singh (hereby referred to as the "Service Provider") as a Free service. This service is intended for use “AS IS”.
									</motion.p>

									{/* 1 Purpose of Application */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">1</span>
										Purpose of the Application
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										The TrackInventory Application is designed specifically for business users to help manage and track stock or inventory. It is not intended for personal or consumer use, and it is not targeted at children or general audiences.
									</motion.p>

									{/* 2 Information Collection and Use */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">2</span>
										Information Collection and Use
									</motion.h2>
									<motion.ul variants={fadeInUp} className="list-disc ml-6 text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										<li>Your device’s Internet Protocol address (IP)</li>
										<li>Visited pages, visit duration, date/time</li>
										<li>Your device's operating system</li>
										<li>May collect email address for improved services</li>
									</motion.ul>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										The Service Provider may use this information to contact you with updates, notices, or promotions. No precise location data is collected.
									</motion.p>

									{/* 3 Third Party Access */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">3</span>
										Third-Party Access
									</motion.h2>
									<motion.ul variants={fadeInUp} className="list-disc ml-6 text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										<li>Aggregated anonymized data may be transmitted externally</li>
										<li>May disclose data if required by law</li>
										<li>To protect rights, safety, or investigate fraud</li>
										<li>With trusted providers adhering to this policy</li>
									</motion.ul>

									{/* 4 Opt-Out Rights */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">4</span>
										Opt-Out Rights
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										You can stop information collection at any time by uninstalling the application.
									</motion.p>

									{/* 5 Data Retention */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">5</span>
										Data Retention Policy
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										User data is stored as long as necessary for use of the Application and a reasonable time thereafter. For data deletion requests, contact smartstock33@gmail.com
									</motion.p>

									{/* 6 Children */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">6</span>
										Children
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										This application is not intended for children under 13. If a child submits personal information, contact smartstock33@gmail.com.
									</motion.p>

									{/* 7 Security */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">7</span>
										Security
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										The Service Provider applies physical, electronic, and procedural safeguards to protect data confidentiality.
									</motion.p>

									{/* 8 Changes */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">8</span>
										Changes
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										Privacy Policy may update without notice. Continued use equals consent.
									</motion.p>

									{/* 9 Consent */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">9</span>
										Your Consent
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										Using the Application means you consent to information processing under this policy.
									</motion.p>

									{/* 10 Contact */}
									<motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">10</span>
										Contact Information
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 text-sm sm:text-base md:text-lg">
										If you have any privacy concerns, contact us at
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
export default PrivacyPolicy
