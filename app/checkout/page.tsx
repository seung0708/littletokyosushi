import CheckoutSteps from "./CheckoutSteps"

const CheckoutPage: React.FC = () => {
  return (
    <div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt">
          <CheckoutSteps />
        </div>
      </div>
    )
}

export default CheckoutPage