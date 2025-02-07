import Image from "next/image";

const About: React.FC = () => {
    return (
        <section id='about' className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                    <div className="flex flex-col justify-center space-y-4 sm:space-y-6 max-w-xl mx-auto md:mx-0">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                            About us
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                            Located inside the Little Tokyo Marketplace in DTLA Little Tokyo, 
                            we are a small family-owned sushi takeout restaurant serving quality 
                            sushi and rolls everyday
                        </p>
                    </div>
                    
                    <div className="order-first md:order-last">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-xl">
                            <Image 
                                src={'/assets/images/Store Front.jpg'} 
                                fill
                                className="object-cover object-center hover:scale-105 transition-transform duration-300"
                                sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
                                priority
                                alt="Little Tokyo Sushi storefront" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;