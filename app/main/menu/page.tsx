const MenuPage = () => {
    return (
        <section id="menu" className="max-w-7xl mx-auto mt-20 sm:mt-0">
            <div className="categories flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-5">
                <a className="text:lg bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full" href="#sushi">
                    Sushi
                </a>
                <a className="bg-red-500 hover:bg-red-700 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full">Rolls</a>
                <a className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full">Combos</a>
                <a className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full">Bowls</a>
                <a className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-4 py-1 rounded-full">Party Trays</a>
            </div>
            <div className="menu__items grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-colos-4 xl:gap-x-8">
                <div>
                    <a>
                        <img />
                    </a>
                    <div>
                        <h3></h3>
                        <p></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MenuPage