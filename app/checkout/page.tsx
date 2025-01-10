import CheckoutSteps from "./CheckoutSteps"

const CheckoutPage: React.FC = () => {
  return (
    <div>
        <div className="bg-blackrelative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:px-8 lg:pt">
          <CheckoutSteps />
        </div>
      </div>
    )
}

export default CheckoutPage