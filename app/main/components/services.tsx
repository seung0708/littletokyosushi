import Image from "next/image";

const Services: React.FC = () => {
    return (
        <section className="max-w-4xl mx-auto">
            <h2 className="text-center lg:text-4xl mb-8">Our Services</h2>
            <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center text-center">
                    <Image src={'/assets/images/online-shopping.png'} alt="online-shopping icon" width={100} height={100}/>
                    <h3 className="text-xl">Order Online or In-person</h3>
                    <p className="text-lg">You can order online or in person at our store's location</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                    <Image src={'/assets/images/online-shopping.png'} alt="online-shopping icon" width={100} height={100}/>
                    <h3 className="text-xl">Order Online or In-person</h3>
                    <p className="text-lg">You can order online or in person at our store's location</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                    <Image src={'/assets/images/online-shopping.png'} alt="online-shopping icon" width={100} height={100}/>
                    <h3 className="text-xl">Order Online or In-person</h3>
                    <p className="text-lg">You can order online or in person at our store's location</p>
                </div>
            </div>
        </section>
    )
}

export default Services;