import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Cart, CartItem, CartItemModifier, CartItemModifierOption } from '@/types/cart';
import { compareModifierOptions, createNewCartItemWithModifiers, getModifiersArray, updateExistingCartItem } from '@/utils/cart';
import { cookies } from 'next/headers';

export async function GET() {
    const cartId = cookies().get('fullCartId')?.value;

    if (!cartId) {
        return NextResponse.json({ error: 'No cart ID found' }, { status: 404 });
    }

    const supabase = createClient();
    const {data: dbCart, error} = await supabase
    .from('carts')
    .select(`id, customer_id, completed_at, 
        cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
        cart_item_modifiers(id, modifiers(id, name), 
            cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
    .eq('id', cartId)
    .order('created_at', { referencedTable: 'cart_items' })
    .single();

    if (error) {
        console.error('Error fetching cart items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }

    if (!dbCart) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cart: Cart = {
        id: dbCart?.id.substring(0, 8),
        customer_id: dbCart?.customer_id?.substring(0, 8),
        completed_at: dbCart?.completed_at,
        cart_items: dbCart?.cart_items.map((cartItem: any) => ({
            id: cartItem?.id.substring(0, 8),
            base_price: cartItem?.base_price,
            special_instructions: cartItem?.special_instructions,
            total_price: cartItem?.total_price,
            quantity: cartItem?.quantity,
            menu_item_id: cartItem?.menu_items?.id,
            menu_item_name: cartItem?.menu_items?.name,
            menu_item_price: cartItem?.menu_items?.price,
            menu_item_image: cartItem?.menu_items?.image_urls[0],
            cart_item_modifiers: cartItem?.cart_item_modifiers?.map((cartItemModifier: any) => ({
                id: cartItemModifier?.id.substring(0, 8),
                modifier_id: cartItemModifier?.modifiers?.id,
                name: cartItemModifier?.modifiers?.name,
                cart_item_modifier_options: cartItemModifier?.cart_item_modifier_options?.map((cartItemModifierOption: any) => ({
                    id: cartItemModifierOption?.id.substring(0, 8),
                    modifier_id: cartItemModifierOption?.modifier_id,
                    modifier_option_id: cartItemModifierOption?.modifier_options?.id,
                    name: cartItemModifierOption?.modifier_options?.name,
                    price: cartItemModifierOption?.modifier_options?.price,
                })) || [],
            })) || [],
        })) || [],
    };
    
    return NextResponse.json(cart);
}

export async function PATCH(request: Request) {
    const cartId = cookies().get('fullCartId')?.value;
    try {
        const { customerId, cartItems } = await request.json()
        //console.log('customer_id:', customerId)
        const newItems = cartItems[cartItems.length - 1]
        console.log('newItems:', newItems)
        let isSameModifierOptions: boolean;
        const supabase = createClient();


        const { data: dbCart, error: cartError } = await supabase
            .from('carts')
            .select(`id, customer_id, completed_at, 
                cart_items(id, cart_id, menu_item_id, base_price, total_price, quantity, special_instructions,
                cart_item_modifiers(id, cart_items_id, modifier_id,
                cart_item_modifier_options(id, cart_item_modifiers_id, modifier_option_id, modifier_id, modifier_option_price))))`)
            .eq('id', cartId)
            .single();
        console.log('dbCart:', dbCart);
        
        if (cartError) {
            console.error('Error fetching cart items:', cartError);
            return NextResponse.json(
                { error: 'Failed to fetch cart items' },
                { status: 500 }
            );
        }
        
        const existingCartItem = dbCart?.cart_items.find((cartItem: any) => {
            if ( 'menu_item_id' in newItems) {
                return cartItem.menu_item_id === newItems.menu_item_id;
            } else if ('cart_item_id' in newItems) {
                return cartItem.id.substring(0, 8) === newItems.cart_item_id;
            }

        });
        console.log('existingCartItem:', existingCartItem);
        // if (existingCartItem) {
        //     if (existingCartItem.cart_item_modifiers.length > 0 && newItems.modifiers) {
        //         console.log('Adding items from menu to cart...');
        //         isSameModifierOptions = await compareModifierOptions(existingCartItem, newItems);
        //         console.log('isSameModifierOptions:', isSameModifierOptions);
        //         if(isSameModifierOptions) {
        //             await updateExistingCartItem(supabase, existingCartItem, newItems);
        //         } else {
        //             await createNewCartItemWithModifiers(supabase, existingCartItem, newItems);
        //         }
        //     } 
        //     if (existingCartItem.cart_item_modifiers.length > 0 && newItems.cart_item_modifiers) {
        //         await updateExistingCartItem(supabase, existingCartItem, newItems);
        //     } 

        // } 
        // //console.log('existingCartItem.menu_item_id !== newItems.menu_item_id:', existingCartItem.menu_item_id !== newItems.menu_item_id);
        // if (!existingCartItem) {
        //     const {data: cartItem, error} = await supabase
        //         .from('cart_items')
        //         .insert({
        //             cart_id: dbCart.id,
        //             base_price: newItems.base_price,
        //             total_price: newItems.total_price,
        //             quantity: newItems.quantity,
        //             menu_item_id: newItems.menu_item_id,
        //             special_instructions: newItems.special_instructions || '',
        //         })
        //         .select()

        //     //console.log('new cart item:', cartItem);

        //     if (getModifiersArray(newItems) && getModifiersArray(newItems).length > 0) {
        //         const { data: cartItemModifier, error: cartItemModifierError } = await supabase
        //             .from('cart_item_modifiers')
        //             .insert(
        //                 getModifiersArray(newItems).map((cartItemModifier: any) => ({
        //                     cart_items_id: cartItem?.[0].id,
        //                     modifier_id: cartItemModifier.modifier_id,
        //                 }))
        //             )
        //             .select()

        //         //console.log('new cart item modifier:', cartItemModifier);

        //         const {error: cartItemModifierOptionError } = await supabase
        //             .from('cart_item_modifier_options')
        //             .insert(
        //                 getModifiersArray(newItems).flatMap((newItemModifier: any, index: number) => 
        //                     newItemModifier.modifier_options.map((newItemModifierOption: any) => ({
        //                         cart_item_modifiers_id: cartItemModifier?.[index]?.id,
        //                         modifier_option_id: newItemModifierOption.modifier_option_id,
        //                         modifier_option_price: newItemModifierOption.price,
        //                         modifier_id: newItemModifier.modifier_id
        //                     }))
        //                 )
        //             )
        //     }
        // } else {
        //     await updateExistingCartItem(supabase, existingCartItem, newItems);
        // }
        return NextResponse.json(
            { 
                message: 'Cart updated successfully',
                status: 200
            }
        )

    } catch (error) {
        console.error('Error updating cart:', error)
        return NextResponse.json(
            { error: 'Error updating cart' },
            { status: 500 }
        )
    }
}


export async function DELETE(request: Request) {
    const cartId = cookies().get('fullCartId')?.value;
    const { itemId } = await request.json();
    const supabase = createClient();
    try {
        const { data: dbCart, error: cartError } = await supabase
            .from('carts')
            .select(`id, customer_id, completed_at, 
                cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
                cart_item_modifiers(id, modifiers(id, name), 
                    cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
            .eq('id', cartId)
            .single();

        if (cartError) {
            console.error('Error fetching cart items:', cartError);
            return NextResponse.json(
                { error: 'Failed to fetch cart items' },
                { status: 500 }
            );
        }
        console.log('dbCart:', dbCart);
        const cartItem = dbCart?.cart_items.find((cartItem: any) => cartItem.id.substring(0, 8) === itemId);
        console.log('cartItem:', cartItem);

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            );
        }

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItem.id);
        if (error) {
            console.error('Error deleting cart item:', error);
            return NextResponse.json(
                { error: 'Error deleting cart item' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return NextResponse.json(
            { error: 'Error deleting cart item' },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { 
            message: 'Cart item deleted successfully',
            status: 200
         }
    )
}