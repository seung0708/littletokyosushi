import Image from "next/image";

const About: React.FC = () => {
    return (
        <section id='about' className="h-full bg-gray-950 text-white border-2 border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:px-28">
                <div className="mx-auto w-5/6 pb-4 sm:pb-0 flex flex-col justify-center">
                    <h2 className="text-3xl sm:text-5xl mb-6">About us</h2>
                    <p className="text-md sm:text-lg md:text-xl">Located inside the Little Tokyo Marketplace in DTLA Little Tokyo, we are a small family-owned sushi takeout restaurant serving quality sushi and rolls everyday</p>
                </div>
                <div className="flex justify-center order-first md:order-last">
                    <img src={'/assets/images/Store Front.jpg'}  className="h-full" alt="store image"/>
                </div>
            </div>
        </section>
    )
}

export default About;