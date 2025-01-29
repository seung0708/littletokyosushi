import Image from "next/image";

const Page: React.FC = () => {
    return (
        <section id='about' className="bg-black text-white min-h-screen flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:px-28">
                <div className="mx-auto w-5/6 pb-4 sm:pb-0 flex flex-col justify-center">
                    <h2 className="text-3xl text-red-500 sm:text-5xl mb-6">About us</h2>
                    <p className="text-md sm:text-lg md:text-xl">Located inside the Little Tokyo Marketplace in DTLA Little Tokyo, we are a small family-owned sushi takeout restaurant serving quality sushi and rolls everyday</p>
                </div>
                <div className="flex justify-center order-first md:order-last">
                    <Image src={'/assets/images/Store Front.jpg'} height={658} width={898} alt="store image" />
                </div>
            </div>
        </section>
    )
}

export default Page;