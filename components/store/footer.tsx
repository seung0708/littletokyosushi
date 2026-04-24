import Copyright from "./ui/footer/copyright";

export default function Footer() {
    return (
        <footer className="bg-background text-white">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    
                {/* Top row */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">

                    {/* Left: brand + map */}
                    <div className="flex flex-col gap-8 lg:w-1/2">
                        <div>
                            <p className="text-2xl font-semibold tracking-tight">Little Tokyo Sushi</p>
                            <p className="text-gray-400 mt-1 text-sm">Fresh sushi, takeout only · Los Angeles, CA</p>
                        </div>
                        <div className="w-full h-[360px] relative rounded-xl overflow-hidden shadow-xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.9751547887363!2d-118.24102862366448!3d34.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c639a6f4292d%3A0xb09d24bdb187f50c!2sLittle%20Tokyo%20Sushi!5e0!3m2!1sen!2sus!4v1738266014311!5m2!1sen!2sus"
                                className="absolute inset-0 w-full h-full rounded-xl"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right: info grid */}
                    <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* Address */}
                        <div>
                        <h3 className="text-base font-semibold uppercase tracking-widest text-gray-400 mb-4">Address</h3>
                        <address className="not-italic text-white text-sm leading-relaxed space-y-1">
                            <p>333 S Alameda St</p>
                            <p>Ste 100-I</p>
                            <p>Los Angeles, CA 90013</p>
                        </address>
                        </div>

                        {/* Phone */}
                        <div>
                        <h3 className="text-base font-semibold uppercase tracking-widest text-gray-400 mb-4">Phone</h3>
                        <a
                            href="tel:213-617-0343"
                            className="text-white text-sm hover:text-red-400 transition-colors duration-200"
                        >
                            (213) 617-0343
                        </a>
                        </div>

                        {/* Hours */}
                        <div>
                        <h3 className="text-base font-semibold uppercase tracking-widest text-gray-400 mb-4">Business Hours</h3>
                        <ul className="text-sm text-white space-y-1.5">
                            {[
                            ['Mon', '8 AM - 6 PM'],
                            ['Tue', '8 AM - 6 PM'],
                            ['Wed', '8 AM - 6 PM'],
                            ['Thu', '8 AM - 6 PM'],
                            ['Fri', '8 AM - 6 PM'],
                            ['Sat', '8 AM - 6 PM'],
                            ['Sun', '8 AM - 6 PM'],
                            ].map(([day, hours]) => (
                            <li key={day} className="flex justify-between gap-4">
                                <span className="text-gray-400">{day}</span>
                                <span>{hours}</span>
                            </li>
                            ))}
                        </ul>
                        </div>

                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-500 text-xs">
                    <p>&copy; 2026 Little Tokyo Sushi. All rights reserved.</p>
                
                </div>

            </div>
        </footer>
    );
}