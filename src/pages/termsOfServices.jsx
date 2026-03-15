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
								transition={{
									duration: 1,
								}}
							>
							<h1 className="text-bold text-white text-4xl mb-8 transition-all duration-700 hover:text-indigo-400 hover:tracking-widest">
								TERMS OF SERVICE
							</h1>
							</motion.h1>
							{/* Content Section */}
							<motion.div
								variants={containerVariants}
								className="space-y-8"
							>
								<motion.div
									variants={itemVariants}
									className="prose prose-base sm:prose-lg md:prose-xl prose-invert max-w-none p-6 sm:p-8 lg:p-12 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
								>
									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											1
										</span>
										Acceptance of Terms
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										By accessing or using Smart Zone (the "Service"), you agree to be bound by these Terms of Service and our
										<strong className="text-white"> Privacy Policy</strong>. If you do not agree, do not use the Service.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											2
										</span>
										Eligibility
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										The Service is intended for high school students and authorized school personnel at participating schools. You
										must have permission to create an account and participate.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											3
										</span>
										User Conduct
									</motion.h2>
									<motion.ul variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 space-y-3 text-sm sm:text-base md:text-lg">
										<li>Share only appropriate, respectful, and school-safe content.</li>
										<li>Do not harass, bully, impersonate, or violate the rights of others.</li>
										<li>Follow your school's code of conduct and all applicable laws.</li>
									</motion.ul>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											4
										</span>
										Content Rights
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										You retain ownership of content you post. By submitting content, you grant Smart Zone a non-exclusive,
										worldwide, royalty-free license to use, reproduce, and display that content solely to operate and improve the
										Service. Moderators may remove content that violates these Terms.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											5
										</span>
										Prohibited Uses
									</motion.h2>
									<motion.ul variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 space-y-3 text-sm sm:text-base md:text-lg">
										<li>Uploading illegal, hateful, explicit, or infringing content</li>
										<li>Attempting to bypass security or disrupt the Service</li>
										<li>Collecting or sharing others' personal data without consent</li>
									</motion.ul>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											6
										</span>
										Termination
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										We may suspend or terminate access to the Service for behavior that violates these Terms or school policies.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											7
										</span>
										Disclaimers
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free
										operation.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											8
										</span>
										Limitation of Liability
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										To the maximum extent permitted by law, Smart Zone and its affiliates are not liable for any indirect, incidental,
										special, or consequential damages arising from your use of the Service.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											9
										</span>
										Changes to These Terms
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
										We may update these Terms from time to time. Continued use of the Service after changes become effective
										constitutes acceptance of the revised Terms.
									</motion.p>

									<motion.h2
										variants={fadeInUp}
										className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center"
									>
										<span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black mr-3 sm:mr-4">
											10
										</span>
										Contact Us
									</motion.h2>
									<motion.p variants={fadeInUp} className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg">
										Questions about these Terms? Contact us at{" "}
										<span className="font-bold text-white bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
											support@smartzone.app
										</span>
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