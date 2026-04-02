'use client';
import Image from "next/image"
import Link from "next/link"
import {Button} from '@/components/ui/button'

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    fill
                    className="object-cover" 
                    src={'/assets/images/hero-sushi.jpg'}
                    alt="Little Tokyo Sushi hero image"
                    style={{ objectPosition: '70% center' }}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
            </div>
            {/* CTA Button */}
            <div className="relative z-10 flex min-h-screen items-center">
                <div className="mx-auto w-full mx-w-7xl px-6 py-24 md:px-12 lg:px-16">
                    <div className="max-w-2xl sapce-y-8 ">
                        <h1 className="text-5xl font-medium leading-tight tracking-tight text-white md:text-6xl lg:text-7xl text-balance">
                            LITTLE TOKYO SUSHI
                        </h1>
                        <p className="max-w-lg text-lg leading-relaxed text-white/70 mt-4">
                            The only sushi takeout restaurant serving a variety of sushi and rolls
                        </p>
                        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                            <Button 
                                asChild
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-white hover:bg-white/10 px-8 py-6 text-base font-medium"
                            >
                                <Link
                                    href='/menu' 
                                    className=""
                                >
                                    Order Now
                                </Link>
                            </Button>
                        </div>
                        
                    </div>
                </div>
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
                    <div className="flex flex-col items-center gap-2 text-white/80">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 5v14" />
                            <path d="m19 12-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero
