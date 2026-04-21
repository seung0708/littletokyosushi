import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Experience authentic Japanese cuisine at Little Tokyo Sushi.",
}

const Page: React.FC = () => {
    return (
        <section className="py-48 text-white">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                            src={"/assets/images/sushi-making.jpg"}
                            alt="Sushi chef preparing fresh rolls"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/50">
                                Our Story
                            </p>
                            <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl text-balance">
                                Crafted with care, made for you
                            </h2>
                        </div>

                        <div className="space-y-4 text-white/70">
                            <p className="leading-relaxed">
                                We are a small sushi counter in the Little Tokyo Sushi Market and have grown into a community favorite. Every day, our team arrives early to prepare fresh sushi using traditional techniques and the finest ingredients.
                            </p>
                            <p className="leading-relaxed">
                                We believe everyone deserves access to quality sushi without the wait and breaking the bank. 
                                That's why we package our rolls fresh throughout the day, ready for you 
                                to grab and enjoy wherever life takes you.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 border-t border-background/10 pt-8">
                            <div>
                                <p className="text-3xl font-medium">5+</p>
                                <p className="mt-1 text-sm text-white/50">Years serving</p>
                            </div>
                            <div>
                                <p className="text-3xl font-medium">50+</p>
                                <p className="mt-1 text-sm text-white/50">Menu items</p>
                            </div>
                            <div>
                                <p className="text-3xl font-medium">1000+</p>
                                <p className="mt-1 text-sm text-white/50">Weekly orders</p>
                            </div>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Page;