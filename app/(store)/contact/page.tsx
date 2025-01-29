import ContactForm from "@/components/store/contact-form";

const Page: React.FC = () => {
    return (
        <section id="contact" className="flex items-center bg-black text-white min-h-screen">
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center">Contact Us</h2>
                <p className="mb-8 lg:mb-16 font-light text-center sm:text-xl">Feel free to send us a message and we will get back to you as quickly as possible</p>
                <ContactForm />
            </div>
        </section>
    )
}

export default Page;