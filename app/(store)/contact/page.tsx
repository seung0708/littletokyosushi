import ContactForm from "@/components/store/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Little Tokyo Sushi for any inquiries or to place an order.",
}

const Page: React.FC = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto border-b border-[#555] pt-16">
                <div className="text-center md:text-left px-6 pt-10 pb-10">
                    <p className="text-[11px] font-semibold text-accent tracking-[0.18em] uppercase">Get in touch</p>
                    <h1 className="font-serif normal text-white tracking-tight" style={{fontSize: "clamp(36px, 5vw, 60px"}}>Contact Us</h1>
                </div>
            </div>
            <section className="bg-background py-16 px-6 pb-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
                    {/* Form */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-center md:text-left font-serif font-normal text-white text-[28px] tracking-tight mb-8">Send us a message</h2>
                        <form id="contact-form" className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-medium text-white/60" htmlFor="email">Email: </label>
                                <input id="email" type="email" placeholder="your@email.com" required className="w-full px-3.5 py-3 rounded-lg bg-black border border-[#2e2e2e] focus:border-accent text-white text-[15px] outline-none transition-colors placeholder:text-white/25" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-medium text-white/60" htmlFor="email">Subject</label>
                                <input id="subject" type="text" placeholder="What's this about?" required className="w-full px-3.5 py-3 rounded-lg bg-black border border-[#2e2e2e] focus:border-accent text-white text-[15px] outline-none transition-colors placeholder:text-white/25" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-medium text-white/60" htmlFor="message">Message</label>
                                <textarea id="message" rows={6} placeholder="Your message here..." required className="w-full px-3.5 py-3 rounded-lg bg-black border border-[#2e2e2e] focus:border-accent text-white text-[15px] outline-none transition-colors placeholder:text-white/25" />
                            </div>
                            <button type="submit" id="submit-btn" className="self-center px-7 py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-[15px] font-semibold outline-none transition-colors placeholder:text-white/25 resize-y">Send Message</button>
                        </form>
                        {/* Success / Fail message */}
                        <p id="success-msg" className="hidden mt-4 text-sm text-green-400">Message sent successfully!</p>
                    </div>
                    {/* Info Left Column */}
                    <div className="order-1 md:order-2 text-center md:text-left">
                        <h2 className="font-serif font-normal text-white text-[28px] tracking-tight mb-8">Find us</h2>
                        <div className="flex flex-col gap-7 mb-6">
                            <div>
                                <p className="text-[11px] font-semibold text-accent tracking-[0.14em] uppercase mb-3">Address</p>
                                <div className="text-sm text-white/70 leading-[1.7]">
                                    <p>333 S Alameda St, St 100-I</p>
                                    <p>Los Angeles, CA 90013</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-accent tracking-[0.14em] uppercase mb-3">Phone</p>
                                <a href="tel:213-617-0343" className="text-sm text-white/70 hover:text-accent transition-colors">(213) 617-0343</a>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-accent tracking-[0.14em] uppercase mb-3">Hours</p>
                                <div>
                                    <p className="text-sm text-white/70 leading-[1.7]">Mon - Sun: 8 AM - 6 pm</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-[200px] rounded-xl overflow-hidden border border-[#222]">
                            <iframe className="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.9751547887363!2d-118.24102862366448!3d34.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c639a6f4292d%3A0xb09d24bdb187f50c!2sLittle%20Tokyo%20Sushi!5e0!3m2!1sen!2sus!4v1738266014311!5m2!1sen!2sus" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Page;