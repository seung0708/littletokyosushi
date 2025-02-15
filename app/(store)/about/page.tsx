import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Experience authentic Japanese cuisine at Little Tokyo Sushi.",
}

const Page: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="w-full bg-black pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                        <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-300">
                            Discover our story and passion for authentic Japanese cuisine
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-red-600/50 to-transparent"></div>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Located inside the Little Tokyo Marketplace in DTLA Little Tokyo, we are a small family-owned 
                                sushi takeout restaurant serving quality sushi and rolls everyday.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl font-bold tracking-tight">Our Location</h2>
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-red-600/50 to-transparent"></div>
                            </div>
                            <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                          border border-white/10 rounded-xl p-6">
                                <p className="text-lg text-gray-300 mb-4">
                                    Find us at Little Tokyo Marketplace
                                </p>
                                <address className="text-gray-400 not-italic">
                                    333 S Alameda St <br />
                                    Los Angeles, CA 90013
                                </address>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl 
                                      border border-white/10 transform hover:scale-[1.02] transition-transform duration-500">
                            <Image 
                                src='/assets/images/Store Front.jpg' 
                                height={658} 
                                width={898} 
                                alt="Little Tokyo Sushi storefront" 
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;