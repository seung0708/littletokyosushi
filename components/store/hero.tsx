import Image from "next/image"
import Link from "next/link"

const Hero: React.FC = () => {
    return (
        <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    fill
                    className="h-full w-full object-cover object-center transform scale-[1.02] motion-safe:animate-subtle-zoom" 
                    src={'/assets/images/hero1.png'}
                    alt="Little Tokyo Sushi hero image"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
            <div className="relative h-full flex items-center">
                <div className="mx-auto max-w-3xl flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg motion-safe:animate-fade-in">
                        LITTLE TOKYO SUSHI
                    </h1>
                    <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl motion-safe:animate-fade-in-delay">
                        The only sushi takeout restaurant serving a variety of sushi and rolls
                    </p>
                    <a 
                        href='/menu' 
                        className="mt-8 sm:mt-10 inline-flex items-center px-8 py-3 text-base sm:text-lg font-semibold text-white bg-red-600 rounded-full hover:bg-red-500 transition-all duration-300 hover:scale-105 motion-safe:animate-fade-in-delay-2"
                    >
                        Order Now
                    </a>
                </div>
            </div>
            
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white bg-opacity-10 backdrop-blur-sm p-3 sm:p-4">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">Order Through</h2>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            <Link
                                href="https://www.ubereats.com/store/little-tokyo-sushi-la/iMFBaXJFQmCLzATUJipi0w"
                                target="_blank"
                                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                            >
                                <Image src="/assets/images/ubereats.svg" alt="UberEats" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 filter brightness-0 invert" />
                            </Link>
                            <Link
                                href="https://www.grubhub.com/restaurant/little-tokyo-sushi-s-alameda-st-333-s-alameda-st-ste-100-i-los-angeles/2795333"
                                target="_blank"
                                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                            >
                                <Image src="/assets/images/grubhub.svg" alt="GrubHub" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 filter brightness-0 invert" />
                            </Link>
                            <Link 
                                href="https://www.doordash.com/store/little-tokyo-sushi-los-angeles-1890156" 
                                target="_blank"
                                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                            >
                                <Image src="/assets/images/doordash.svg" alt="DoorDash" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 filter brightness-0 invert" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="rounded-xl bg-white bg-opacity-10 backdrop-blur-sm p-3 sm:p-4">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">Reviews</h2>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <Link 
                                href="https://www.yelp.com/biz/little-tokyo-sushi-los-angeles?osq=Sushi+Little+Tokyo" 
                                target="_blank"
                                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                            >
                                <Image src="/assets/images/yelp.svg" alt="Yelp" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 filter brightness-0 invert" />
                            </Link>
                            <Link 
                                href="https://g.co/kgs/GdRq5QV" 
                                target="_blank"
                                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                            >
                                <Image src="/assets/images/google.svg" alt="Google Reviews" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 filter brightness-0 invert" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
