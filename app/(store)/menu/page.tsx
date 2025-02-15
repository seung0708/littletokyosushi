
import ItemsContainer from "@/components/store/menu/items-container";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Menu",
    description: "Explore our menu and find the perfect dish for every occasion.",
}

const Page: React.FC = () => {
   

    return (
        <>
            <div className="w-full bg-black pt-20 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Our Menu</h1>
                        <div className="w-16 sm:w-24 h-1 bg-red-600 mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-base sm:text-lg text-gray-300 pb-4">
                            Discover our selection of authentic Japanese dishes
                        </p>
                    </div>
                </div>
            </div>
            <ItemsContainer />
        </>
    );
};

export default Page;