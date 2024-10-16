const CartPage: React.FC = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Shopping Cart</h1>
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                    <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                    <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                        <li className="flex py-6 sm:py-10">
                            <div className="flex-shrink-0">
                                <img src="https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-01.jpg" alt="Front of men&#039;s Basic Tee in sienna." className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                    <div>
                                        <div className="flex justify-between">
                                            <h3 className="text-sm">
                                                <a href="#" className="font-medium text-white hover:text-red-500">Basic Tee</a>
                                            </h3>
                                        </div>
                                        <div className="mt-1 flex text-sm">
                                            <p className="text-white">Sienna</p>
                                            <p className="ml-4 border-l border-gray-200 pl-4 text-white">Large</p>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-white">$32.00</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                        <label htmlFor="quantity-0" className="sr-only">Quantity, Basic Tee</label>
                                        <select id="quantity-0" name="quantity-0" className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                        </select>
                                        <div className="absolute right-0 top-0">
                                            <button type="button" className="-m-2 inline-flex p-2 text-white hover:text-red-500">
                                                <span className="sr-only">Remove</span>
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                    <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                                    </svg>
                                    <span>In stock</span>
                                </p> */}
                            </div>
                        </li>
                        <li className="flex py-6 sm:py-10">
                            <div className="flex-shrink-0">
                                <img src="https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-02.jpg" alt="Front of men&#039;s Basic Tee in black." className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                    <div>
                                        <div className="flex justify-between">
                                            <h3 className="text-sm">
                                                <a href="#" className="font-medium text-white hover:text-red-500">Basic Tee</a>
                                            </h3>
                                        </div>
                                        <div className="mt-1 flex text-sm">
                                            <p className="text-white">Black</p>
                                            <p className="ml-4 border-l border-gray-200 pl-4 text-white">Large</p>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-white">$32.00</p>
                                    </div>

                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                        <label htmlFor="quantity-1" className="sr-only">Quantity, Basic Tee</label>
                                        <select id="quantity-1" name="quantity-1" className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                        </select>

                                        <div className="absolute right-0 top-0">
                                            <button type="button" className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500">
                                                <span className="sr-only">Remove</span>
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                    <svg className="h-5 w-5 flex-shrink-0 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
                                    </svg>
                                    <span>Ships in 3–4 weeks</span>
                                </p> */}
                            </div>
                        </li>
                        <li className="flex py-6 sm:py-10">
                            <div className="flex-shrink-0">
                                <img src="https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-03.jpg" alt="Insulated bottle with white base and black snap lid." className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                    <div>
                                        <div className="flex justify-between">
                                            <h3 className="text-sm">
                                                <a href="#" className="font-medium text-white hover:text-red-500">Nomad Tumbler</a>
                                            </h3>
                                        </div>
                                        <div className="mt-1 flex text-sm">
                                            <p className="text-white">White</p>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-white">$35.00</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                        <label htmlFor="quantity-2" className="sr-only">Quantity, Nomad Tumbler</label>
                                        <select id="quantity-2" name="quantity-2" className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                        </select>
                                        <div className="absolute right-0 top-0">
                                            <button type="button" className="-m-2 inline-flex p-2 text-white hover:text-red-500">
                                            <span className="sr-only">Remove</span>
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                    <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                                    </svg>
                                    <span>In stock</span>
                                </p> */}
                            </div>
                        </li>
                    </ul>
                </section>
                <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="flex items-center text-sm text-gray-600">
                                <span>Delivery estimate</span>
                                <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500">
                                    <span className="sr-only">Learn more about how shipping is calculated</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="flex text-sm text-gray-600">
                                <span>Tax estimate</span>
                                <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500">
                                    <span className="sr-only">Learn more about how tax is calculated</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">$8.32</dd>
                        </div>    
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">Order total</dt>
                            <dd className="text-base font-medium text-gray-900">$112.32</dd>
                        </div>
                    </dl>
                    <div className="mt-6">
                        <button type="submit" className="w-full rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50">Checkout</button>
                    </div>
                </section>
            </form>
        </div>
    )

}

export default CartPage