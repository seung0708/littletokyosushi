import Image from "next/image"
import Link from "next/link"

const Hero: React.FC = () => {
    return (
        <section id="hero" className="relative bg-black text-white">
            <div aria-hidden='true' className="absolute inset-0 overflow-hidden">
                <img className="h-full w-full object-cover object-center" src={'/assets/images/hero1.png'}/>
            </div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-32 md:py-48 lg:px-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">LITTLE TOKYO SUSHI</h1>
                <p className="w-full mt-3 sm:mt-4 text-sm sm:text-md md:text-lg lg:text-xl">The only sushi takeout restaurant serving a variety of sushi and rolls</p>
                <a href='/menu' className="mt-6 sm:mt-8 inline-block rounded-md bg-red-500 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-bold hover:bg-red-300 transition-colors">Order Now</a>
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
