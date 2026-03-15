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
            <section id = "contact-us">
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 sm:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
                <div className="w-full max-w-6xl mx-auto flex md:flex-row items-start md:items-center">
                    <div className="text-white text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-6 text-center">
                            Let’s Get in Touch
                        </h2>
                        <p className="text-[14px] sm:text-lg text-gray-300 leading-relaxed">
                            We'd love to hear from you! Whether you have a question about features,
                            pricing, or anything else our team is ready to help.
                        </p>
                    </div>
                </div>
            </div>
            </section>
            <Footer />
        </>
    );
}
