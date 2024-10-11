import Image from "next/image";

const About: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
                <h2 className="text-4xl mb-6">About us</h2>
                <p className="text-xl">Located inside the Little Tokyo Marketplace, we are a small family-owned sushi takeout restaurant serving quality sushi and rolls everyday</p>
            </div>
            <div className="flex justify-center">
                <Image src={'/assets/images/Store Front.jpg'}  width={500} height={300} alt="store image"/>
            </div>
        </section>
    )
}

export default About;