import { useCart, CartItem } from "../../app/context/cartContext"

const CartItems = ({ cartItems }: { cartItems: CartItem[] }) => {
    const { removeItemFromCart} = useCart();
    return (
        <div>CartItems</div>
    )
}

export default CartItems