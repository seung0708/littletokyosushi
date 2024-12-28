import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Cart, CartItem, CartItemModifier, CartItemModifierOption } from '@/types/cart';

export async function GET(request: Request, { params}: { params: { id: string } }) {
    console.log('Getting cart items...');
    const supabase = createClient();
    const {data: dbCart, error} = await supabase
    .from('carts')
    .select(`id, customer_id, completed_at, 
        cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(name, price, image_urls), 
        cart_item_modifiers(id, modifiers(id, name), 
            cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
    .eq('id', params.id);
    console.log('dbCart:', dbCart);

    const cart: Cart[] = dbCart?.map((cart: any) => ({
        id: cart.id,
        customer_id: cart.customer_id,
        completed_at: cart.completed_at,
        cart_items: cart.cart_items.map((cartItem: any) => ({
            id: cartItem.id,
            base_price: cartItem.base_price,
            special_instructions: cartItem.special_instructions,
            total_price: cartItem.total_price,
            quantity: cartItem.quantity,
            menu_item_name: cartItem.menu_items.name,
            menu_item_price: cartItem.menu_items.price,
            menu_item_image: cartItem.menu_items.image_urls[0],
            cart_item_modifiers: cartItem.cart_item_modifiers.map((cartItemModifier: any) => ({
                id: cartItemModifier.id,
                name: cartItemModifier.modifiers.name,
                cart_item_modifier_options: cartItemModifier.cart_item_modifier_options.map((cartItemModifierOption: any) => ({
                    id: cartItemModifierOption.id,
                    modifier_id: cartItemModifierOption.modifier_id,
                    name: cartItemModifierOption.modifier_options.name,
                    price: cartItemModifierOption.modifier_options.price,
                })),
            })),
        })),
    })) || [];
    console.log('cart:', cart, error);
    
    if (error) {
        console.error('Error fetching cart items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }
    return NextResponse.json(cart);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { cart_items } = await request.json()
        const { id } = params

        const supabase = createClient();
        
        // Update each cart item
        const updatePromises = cart_items.map(async (item: any) => {
            const { data: existingItem, error: fetchError } = await supabase
                .from('cart_items')
                .select()
                .eq('cart_id', item.cart_id)
                .eq('id', item.id)
                .single()

            if (fetchError) {
                throw new Error(`Failed to fetch cart item: ${fetchError.message}`)
            }

            const { error: updateError } = await supabase
                .from('cart_items')
                .update({
                    quantity: item.quantity,
                    total_price: item.total_price,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingItem.id)

            if (updateError) {
                throw new Error(`Failed to update cart item: ${updateError.message}`)
            }
        })

        await Promise.all(updatePromises)

        // Fetch and return updated cart items
        const { data: updatedCart, error: fetchError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', id)

        if (fetchError) {
            throw new Error(`Failed to fetch updated cart: ${fetchError.message}`)
        }

        return NextResponse.json(updatedCart)

    } catch (error) {
        console.error('Error updating cart:', error)
        return NextResponse.json(
            { error: 'Error updating cart' },
            { status: 500 }
        )
    }
}