import Image from "next/image";

const About: React.FC = () => {
    return (
        <section id='about' className="relative py-12 sm:py-16 md:py-20 bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                            About us
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                            Located inside the Little Tokyo Marketplace in DTLA Little Tokyo, 
                            we are a small family-owned sushi takeout restaurant serving quality 
                            sushi and rolls everyday
                        </p>
                    </div>
                    
                    <div className="order-first md:order-last">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                            <Image 
                                src={'/assets/images/Store Front.jpg'} 
                                fill
                                className="object-cover object-center"
                                sizes="(min-width: 1024px) 50vw, 100vw"
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