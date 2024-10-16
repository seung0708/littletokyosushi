import Image from "next/image"
import Link from "next/link"
const Hero: React.FC = () => {
    return (
        <section id="hero" className="relative bg-gray-950 text-white">
            <div aria-hidden='true' className="absolute inset-0 overflow-hidden">
                <img className="h-full w-full object-cover object-center" src={'/assets/images/hero1.png'}/>
            </div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">LITTLE TOKYO SUSHI</h1>
                <p className="mt-4 text-xl">The only sushi takeout restaurant serving a variety of sushi and rolls</p>
                <a href='/menu' className="mt-8 inline-block rounded-md border border-transparent bg-red-500 px-8 py-3 text-base font-bold hover:bg-red-300">Order Now</a>
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