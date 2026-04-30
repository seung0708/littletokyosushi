import ContactForm from "@/components/store/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Little Tokyo Sushi for any inquiries or to place an order.",
}

const Page: React.FC = () => {
    return (
        <>
            <div className="border-b border-[#222] pt-16">
                <div className="max-w-7xl mx-auto px-6 pt-10 pb-10">
                    <p className="text-[11px] font-semibold text-accent tracking-[0.18em] uppercase">Get in touch</p>
                    <h1 className="font-serif normal text-white tracking-tight" style={{fontSize: "clamp(36px, 5vw, 60px"}}>Contact Us</h1>
                </div>
            </div>
            <section>
                <div>
                    {/* Form */}
                    <div>
                        <h2></h2>
                        <form>
                            <div>
                                <label>Email: </label>
                                <input />
                            </div>
                            <button>Send Message</button>
                        </form>
                        {/* Success / Fail message */}
                        <p></p>
                    </div>
                    {/* Info Left Column */}
                    <div>
                        <h2></h2>
                        <div>
                            <div>
                                <p>Address</p>
                                <div>
                                    <p></p>
                                    <p></p>
                                </div>
                            </div>
                            <div>
                                <p>Phone</p>
                                <p>(213) 617-0343</p>
                            </div>
                            <div>
                                <p>Hours</p>
                                <div>
                                    <p>Mon - Sun: 8 AM - 6 pm</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <iframe className="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.9751547887363!2d-118.24102862366448!3d34.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c639a6f4292d%3A0xb09d24bdb187f50c!2sLittle%20Tokyo%20Sushi!5e0!3m2!1sen!2sus!4v1738266014311!5m2!1sen!2sus" allowfullscreen="false" loading="lazy"></iframe>
                    
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Page;