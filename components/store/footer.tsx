import Image from "next/image";
import Link from "next/link";
import Copyright from "./ui/footer/copyright";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    {/* Map Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px] relative rounded-lg overflow-hidden shadow-lg">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.9751547887363!2d-118.24102862366448!3d34.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c639a6f4292d%3A0xb09d24bdb187f50c!2sLittle%20Tokyo%20Sushi!5e0!3m2!1sen!2sus!4v1738266014311!5m2!1sen!2sus"
                                className="absolute inset-0 w-full h-full rounded-lg"
                                style={{border: 0}}
                                allowFullScreen={false}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Address</h3>
                                    <address className="not-italic text-gray-300 space-y-1">
                                        <p>333 S Alameda St, Ste 100-I</p>
                                        <p>Los Angeles, CA 90013</p>
                                    </address>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Contact</h3>
                                    <p>
                                        <a 
                                            href="tel:213-617-0343" 
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            213-617-0343
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Hours</h3>
                                <div className="space-y-2 text-gray-300">
                                    <p className="flex justify-between">
                                        <span>Mon-Sat</span>
                                        <span>10:30 AM - 7:30 PM</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Sun</span>
                                        <span>10:30 AM - 7:00 PM</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <Copyright />
                </div>
            </div>
        </footer>
    );
}