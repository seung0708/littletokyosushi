import Hero from "../../components/store/hero"
import Services from "../../components/store/services"
import PopularItems from "../../components/store/popularitems"


export default function HomePage() {
    return (
        <>
            <Hero />
            <Services />
            <PopularItems />
        </>
    )
}