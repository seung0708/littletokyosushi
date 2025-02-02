import ContactForm from "@/components/store/contact-form";

const Page: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="w-full bg-black pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                        <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-300">
                            We'd love to hear from you
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                               border border-white/10 rounded-xl p-8 shadow-2xl">
                    <div className="grid grid-cols-1 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold tracking-tight">Send us a Message</h2>
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-red-600/50 to-transparent"></div>
                            </div>
                            <p className="text-gray-300">
                                Feel free to reach out to us with any questions or concerns. We'll get back to you as quickly as possible.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 p-4 rounded-lg bg-black/20 border border-white/5">
                                <h3 className="font-semibold text-red-400">Business Hours</h3>
                                <p className="text-sm text-gray-300">
                                    Monday - Sunday<br />
                                    11:00 AM - 8:00 PM
                                </p>
                            </div>
                            <div className="space-y-2 p-4 rounded-lg bg-black/20 border border-white/5">
                                <h3 className="font-semibold text-red-400">Contact Info</h3>
                                <p className="text-sm text-gray-300">
                                    333 S Alameda St<br />
                                    Los Angeles, CA 90013<br />
                                    (213) 625-0071
                                </p>
                            </div>
                        </div>
                    </div>

                    <ContactForm />
                </div>
            </div>
        </div>
    )
}

export default Page;