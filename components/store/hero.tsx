'use client';
import Image from "next/image"
import Link from "next/link"

const Hero: React.FC = () => {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    fill
                    className="h-full w-full object-cover object-center transform scale-[1.02] motion-safe:animate-subtle-zoom" 
                    src={'/assets/images/hero1.png'}
                    alt="Little Tokyo Sushi hero image"
                    style={{ height: '100%' }}
                    priority
                />
            </div>
            <div className="absolute inset-0" style={{ height: '100%' }}>
                <div className="h-full w-full bg-gradient-to-b from-black/60 to-black/40"></div>
            </div>
            <div className="relative min-h-[650px] sm:min-h-[700px] lg:min-h-[800px] flex flex-col">
                <div className="flex-1 flex items-center pt-20 sm:pt-24 lg:pt-28">
                    <div className="mx-auto max-w-4xl flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg motion-safe:animate-fade-in">
                            LITTLE TOKYO SUSHI
                        </h1>
                        <p className="mt-4 sm:mt-6 lg:mt-8 text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl motion-safe:animate-fade-in-delay font-medium">
                            The only sushi takeout restaurant serving a variety of sushi and rolls
                        </p>
                        <a 
                            href='/menu' 
                            className="mt-8 sm:mt-10 lg:mt-12 inline-flex items-center px-8 py-3.5 text-base sm:text-lg font-semibold text-white bg-red-600 rounded-full hover:bg-red-500 active:bg-red-700 transition-all duration-300 hover:scale-105 hover:shadow-lg motion-safe:animate-fade-in-delay-2"
                        >
                            Order Now
                        </a>
                    </div>
                </div>
                
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10 lg:pb-12">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                        <div className="rounded-xl bg-white/10 backdrop-blur-md shadow-lg p-4 sm:p-5 lg:p-6 hover:bg-white/15 transition-all duration-300">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-center text-white">Order Through</h2>
                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                <Link
                                    href="https://www.ubereats.com/store/little-tokyo-sushi-la/iMFBaXJFQmCLzATUJipi0w"
                                    target="_blank"
                                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105"
                                >
                                    <Image 
                                        src="/assets/images/ubereats.svg" 
                                        alt="Uber Eats" 
                                        width={32} 
                                        height={32} 
                                        className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 filter brightness-0 invert"
                                    />
                                </Link>
                                <Link
                                    href="https://www.grubhub.com/restaurant/little-tokyo-sushi-s-alameda-st-333-s-alameda-st-ste-100-i-los-angeles/2795333"
                                    target="_blank"
                                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105"
                                >
                                    <Image 
                                        src="/assets/images/grubhub.svg" 
                                        alt="GrubHub" 
                                        width={48} 
                                        height={48} 
                                        className="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                </Link>
                                <Link 
                                    href="https://www.doordash.com/store/little-tokyo-sushi-los-angeles-1890156" 
                                    target="_blank"
                                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105"
                                >
                                    <Image 
                                        src="/assets/images/doordash.svg" 
                                        alt="DoorDash" 
                                        width={48} 
                                        height={48} 
                                        className="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                </Link>
                            </div>
                        </div>
                        
                        <div className="rounded-xl bg-white/10 backdrop-blur-md shadow-lg p-4 sm:p-5 lg:p-6 hover:bg-white/15 transition-all duration-300">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-center text-white">Reviews</h2>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <Link 
                                    href="https://www.yelp.com/biz/little-tokyo-sushi-los-angeles?osq=Sushi+Little+Tokyo" 
                                    target="_blank"
                                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105"
                                >
                                    <Image 
                                        src="/assets/images/yelp.svg" 
                                        alt="Yelp" 
                                        width={48} 
                                        height={48} 
                                        className="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                </Link>
                                <Link 
                                    href="https://g.co/kgs/GdRq5QV" 
                                    target="_blank"
                                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105"
                                >
                                    <Image 
                                        src="/assets/images/google.svg" 
                                        alt="Google Reviews" 
                                        width={48} 
                                        height={48} 
                                        className="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero
