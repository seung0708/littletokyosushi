import Image from "next/image";

const Services: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto mb-20">
            <h2 className="text-center text-3xl sm:text-4xl mb-8">Our Services</h2>
            <div className="grid grid-col-1 sm:grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <img src={'/assets/images/online-shopping.png'} alt="online-shopping icon" className="w-20 sm:w-28" />
                    <h3 className="text-lg sm:text-xl">Order Online or In-person</h3>
                    <p className=" text-md sm:text-lg">You can order online or in person at our store's location</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                    <img src={'/assets/images/online-shopping.png'} alt="online-shopping icon" className="w-20 sm:w-28"/>
                    <h3 className="text-lg sm:text-xl">Order Online or In-person</h3>
                    <p className=" text-md sm:text-lg">You can order online or in person at our store's location</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                    <img src={'/assets/images/online-shopping.png'} alt="online-shopping icon" className="w-20 sm:w-28"/>
                    <h3 className="text-lg sm:text-xl">Order Online or In-person</h3>
                    <p className="text-md sm:text-lg">You can order online or in person at our store's location</p>
                </div>
            </div>
        </section>
    )
}

export default Services;