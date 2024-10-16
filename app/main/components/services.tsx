import Image from "next/image";

const Services: React.FC = () => {
    return (
        <section aria-labelledby="services-heading">
            <div className="py-24 sm:py-32">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0 ">
                    <div className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                        <div className="md:flex-shrink-0">
                            <div className="flow-root flex">
                                <img className="-my-1 mx-auto h-24 w-auto rounded-lg" src={'/assets/images/online-order.gif'} alt="" />
                            </div>
                        </div>
                        <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                            <h3 className="text-base font-medium">Order online or in person</h3>
                            <p className="mt-3 text-sm">Order online through our website or in person at our store's location</p>
                        </div>
                </div>
                <div className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                    <div className="md:flex-shrink-0">
                        <div className="flow-root">
                            <img className="-my-1 mx-auto h-24 w-auto rounded-lg" src={'/assets/images/food-delivery.gif'} alt="" />
                        </div>
                    </div>
                    <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                        <h3 className="text-base font-medium">Pickup or Delivery</h3>
                        <p className="mt-3 text-sm">Place an order for pick up or delivery through our delivery partners like UberEats, DoorDash, and Grubhub</p>
                    </div>
                </div>
                <div className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                    <div className="md:flex-shrink-0">
                        <div className="flow-root">
                            <img className="-my-1 mx-auto h-24 w-auto rounded-lg" src={'/assets/images/sushi.gif'} alt="" />
                        </div>
                    </div>
                    <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                        <h3 className="text-base font-medium">And enjoy!</h3>
                        <p className="mt-3 text-sm">Our delicious Sushi and Rolls made fresh everyday!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    )
}

export default Services;

{/* </div>
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
        </section> */}