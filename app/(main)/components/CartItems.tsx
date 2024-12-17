import { useCart, CartItem } from "../context/cartContext"

const CartItems = ({ cartItems }: { cartItems: CartItem[] }) => {
    const { removeItemFromCart} = useCart();
    return (
        <div>CartItems</div>
    )
}

export default CartItems