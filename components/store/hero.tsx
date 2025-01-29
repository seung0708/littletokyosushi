import Image from "next/image"
import Link from "next/link"
const Hero: React.FC = () => {
    return (
        <section id="hero" className="relative bg-black text-white">
            <div aria-hidden='true' className="absolute inset-0 overflow-hidden">
                <img className="h-full w-full object-cover object-center" src={'/assets/images/hero1.png'}/>
            </div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">LITTLE TOKYO SUSHI</h1>
                <p className="w-4/5 sm:w-full mt-4 text-md sm:text-lg md:text-xl">The only sushi takeout restaurant serving a variety of sushi and rolls</p>
                <a href='/menu' className="mt-8 inline-block rounded-md bg-red-500 px-8 py-3 text-base text-md sm:text-lg md:text-xl font-bold hover:bg-red-300">Order Now</a>
            </div>
        </section>
    )
}

export default Hero
