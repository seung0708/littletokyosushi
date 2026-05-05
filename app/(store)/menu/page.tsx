
import ItemsContainer from "@/components/store/menu/items-container";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Menu",
    description: "Explore our menu and find the perfect dish for every occasion.",
}

const Page: React.FC = () => {
   
    return (
        <ItemsContainer />
    );
};

export default Page;