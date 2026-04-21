import ContactForm from "@/components/store/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Little Tokyo Sushi for any inquiries or to place an order.",
}

const Page: React.FC = () => {
    return (
        <div className="py-12 min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                               border border-white/10 rounded-xl p-8 shadow-2xl">
                    <div className="grid grid-cols-1 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold tracking-tight">Send us a Message</h2>
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-red-600/50 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}

export default Page;