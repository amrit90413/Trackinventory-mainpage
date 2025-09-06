import { useForm } from "react-hook-form";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactUs() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
        alert("Message sent successfully!");
        reset();
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 sm:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
                <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-12">
                    <div className="text-white max-w-md text-center md:text-left">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-6">
                            Let’s Get in Touch
                        </h2>
                        <p className="text-[14px] sm:text-lg text-gray-300 leading-relaxed">
                            We'd love to hear from you! Whether you have a question about features,
                            pricing, or anything else our team is ready to help.
                        </p>
                    </div>
                    <div className="bg-white w-full md:w-1/2 p-6 sm:p-8 rounded-2xl shadow-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: "First Name is required" })}
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last Name is required" })}
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Enter a valid email address",
                                        },
                                    })}
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="How can we help you?"
                                    {...register("message")}
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-md hover:from-pink-600 hover:to-purple-700 transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
