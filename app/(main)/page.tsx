import Hero from "./components/hero"
import Services from "./components/services"
import About from "./components/about"
import PopularItems from "./components/popularitems"
import Contact from "./components/contact"

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