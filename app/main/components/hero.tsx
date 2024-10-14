import Image from "next/image"
import Link from "next/link"
const Hero: React.FC = () => {
    return (
        <section id="hero" className="relative isolate bg-hero-image1 bg-center bg-no-repeat sm:bg-cover px-6 py-0 lg:px-8 mb-0 sm:mb-20">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="relative z-10 mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                    <h1 className="text-balance font-bold tracking-tight text-4xl sm:text-6xl">LITTLE TOKYO SUSHI</h1>
                    <p className="mt-6 text-xl leading-8">The only sushi takeout restaurant serving a variety of sushi and rolls</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a href='#' className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:oultine-red-500">Order Now</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero

{/* <div className="w-full flex justify-center items-center mb-6 md:mb-0">
<Image 
    className="object-cover w-full max-w-xs md:max-w-sm lg:max-w-md" // Smaller image sizes for different breakpoints
    src={'/assets/images/sushi 1.png'} 
    width={400} 
    height={100} 
    alt="sushi hero image 1" 
/>
</div>
<div className="w-full md:w-1/2 mt-4 md:mt-0">
<h2 className="text-3xl md:text-4xl lg:text-5xl">SUSHI</h2>
<h2 className="text-3xl md:text-4xl lg:text-5xl mt-2">MADE</h2>
<h2 className="text-3xl md:text-4xl lg:text-5xl mt-2">FRESH DAILY</h2>
<p className="mt-4 text-base md:text-lg">At Little Tokyo Sushi, we pride ourselves in making all of our sushi with high-quality fish and ingredients.</p>
<Link href='/menu'>
    <button className="mt-8 p-3 bg-red-500 text-white rounded-lg">Order Now</button>
</Link>
</div> */}