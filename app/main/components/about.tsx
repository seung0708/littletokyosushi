import Image from "next/image";

const About: React.FC = () => {
    return (
        <section className="py-24 sm:py-32 bg-gray-950 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  sm:px-28">
                <div className="flex flex-col justify-center">
                    <h2 className="text-4xl mb-6">About us</h2>
                    <p className="text-xl">Located inside the Little Tokyo Marketplace, we are a small family-owned sushi takeout restaurant serving quality sushi and rolls everyday</p>
                </div>
                <div className="flex justify-center">
                    <img src={'/assets/images/Store Front.jpg'}  className="h-full" alt="store image"/>
                </div>
            </div>
        </section>
    )
}

export default About;