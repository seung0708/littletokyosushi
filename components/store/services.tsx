import Image from 'next/image';
import React from 'react';

const Services: React.FC = () => {
    return (
        <section aria-labelledby="services-heading" className="w-full">
            <div className="bg-gray-900 text-white py-12 sm:py-24">
                <div className="px-4 sm:px-6 md:px-8 w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 gap-y-8 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8">
                        <div className="text-center sm:text-left lg:text-center">
                            <div className="flex justify-center sm:justify-start lg:justify-center">
                                <div className="flow-root">
                                    <div className="flex items-center justify-center">
                                    <Image 
                                        className="-my-1 rounded-full" 
                                        src={'/assets/images/online-order.gif'} 
                                        height={75}
                                        width={75}
                                        alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                            <h3 className="text-lg font-semibold">Easy Ordering</h3>
                                <p className="mt-2 text-sm text-gray-300">
                                    Simple and convenient online ordering system for a seamless experience.
                                </p>
                            </div>
                        </div>

                        <div className="text-center sm:text-left lg:text-center">
                            <div className="flex justify-center sm:justify-start lg:justify-center">
                                <div className="flow-root">
                                    <div className="flex items-center justify-center">
                                    <Image 
                                        className="-my-1 rounded-full" 
                                        src={'/assets/images/badge.gif'} 
                                        height={75}
                                        width={75}
                                        alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold">Quality Guaranteed</h3>
                                <p className="mt-2 text-sm text-gray-300">
                                    Fresh ingredients and expert preparation for the best sushi experience.
                                </p>
                            </div>
                        </div>

                        <div className="text-center sm:text-left lg:text-center">
                            <div className="flex justify-center sm:justify-start lg:justify-center">
                                <div className="flow-root">
                                    <div className="flex items-center justify-center">
                                    <Image 
                                        className="-my-1 rounded-full" 
                                        src={'/assets/images/fireworks.gif'} 
                                        height={75}
                                        width={75}
                                        alt="Party tray icon" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold">Party Trays</h3>
                                <p className="mt-2 text-sm text-gray-300">
                                    Beautiful Sushi and Roll platters perfect for parties and special occasions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Services;
