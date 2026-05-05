
import ItemsContainer from "@/components/store/menu/items-container";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Menu",
    description: "Explore our menu and find the perfect dish for every occasion.",
}

const Page: React.FC = () => {
   

    return (
        <>
            <div className="bg-dark border-b border-[#222] pt-16">
                <div className="max-w-7xl mx-auto px-6 py-10 pb-0">
                    <p className="text-[11px] font-semibold text-accent tracking-[0.18em] uppercase mb-2.5">Takeout only</p>
                    <h1 className="font-serif font-normal text-white tracking-tight mb-8" style={{fontSize: 'clamp(36px, 5vw, 60px)'}}>Our Menu</h1>
                    {/* Category tabs */}
                    <div>

                    </div>
                </div>
            </div>
            <ItemsContainer />
        </>
    );
};

export default Page;