import Hero from "../../components/store/hero"
import Services from "../../components/store/services"
import About from "../../components/store/about"
import PopularItems from "../../components/store/popularitems"
import Contact from "../../components/store/contact"

export default function HomePage() {
    return (
        <>
            <Hero />
            <Services />
            <About />
            <PopularItems />
            <Contact />
        </>
    )
}