import Hero from "../../components/store/hero"
import Services from "../../components/store/services"
import PopularItems from "../../components/store/popularitems"
import Footer from "@/components/store/footer"


export default function HomePage() {
    return (
        <>
            <Hero />
            <Services />
            <PopularItems />
            <Footer />
        </>
    )
}