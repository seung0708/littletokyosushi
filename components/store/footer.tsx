import Copyright from "./ui/footer/copyright";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">
                    {/* Map Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] relative rounded-xl overflow-hidden shadow-xl">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.9751547887363!2d-118.24102862366448!3d34.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c639a6f4292d%3A0xb09d24bdb187f50c!2sLittle%20Tokyo%20Sushi!5e0!3m2!1sen!2sus!4v1738266014311!5m2!1sen!2sus"
                                className="absolute inset-0 w-full h-full rounded-xl"
                                style={{border: 0}}
                                allowFullScreen={false}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
                            {/* Contact Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Address</h3>
                                    <address className="not-italic text-gray-300 space-y-2 text-lg">
                                        <p>333 S Alameda St, Ste 100-I</p>
                                        <p>Los Angeles, CA 90013</p>
                                    </address>
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Contact</h3>
                                    <p>
                                        <a 
                                            href="tel:213-617-0343" 
                                            className="text-gray-300 hover:text-white text-lg transition-all duration-200 hover:text-red-400"
                                        >
                                            213-617-0343
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div>
                                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Hours</h3>
                                <div className="space-y-3 text-gray-300 text-lg">
                                    <p className="flex justify-between items-center">
                                        <span>Mon-Sat</span>
                                        <span>10:30 AM - 7:30 PM</span>
                                    </p>
                                    <p className="flex justify-between items-center">
                                        <span>Sun</span>
                                        <span>10:30 AM - 7:00 PM</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <Copyright />
                </div>
            </div>
        </footer>
    );
}