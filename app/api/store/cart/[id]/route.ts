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
    .eq('id', params.id)
    .single();
    console.log('dbCart:', dbCart);
    console.log('dbCart cart_items:', dbCart?.cart_items);
    console.log('dbCart cart_item_modifiers:', dbCart?.cart_items.map((cartItem: any) => cartItem.cart_item_modifiers));

    const cart: Cart = {
        id: dbCart?.id,
        customer_id: dbCart?.customer_id,
        completed_at: dbCart?.completed_at,
        cart_items:  dbCart?.cart_items.map((cartItem: any) => ({
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
                modifier_id: cartItemModifier.modifiers?.id,
                name: cartItemModifier.modifiers?.name,
                cart_item_modifier_options: cartItemModifier.cart_item_modifier_options?.map((cartItemModifierOption: any) => ({
                    id: cartItemModifierOption.id,
                    modifier_id: cartItemModifierOption.modifier_id,
                    modifier_option_id: cartItemModifierOption.modifier_options?.id,
                    name: cartItemModifierOption.modifier_options?.name,
                    price: cartItemModifierOption.modifier_options?.price,
                })) || [],
            })) || [],
        })) || [],
    };
    //console.log('cart:', cart, error);
    
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
        const newItems = cart_items[cart_items.length - 1]
        //console.log('newItems:', newItems)
        const { id } = params

        const supabase = createClient();

        const { data: dbCart, error } = await supabase
            .from('carts')
            .select(`id, customer_id, completed_at, 
                cart_items(id, cart_id, base_price, total_price, quantity, menu_item_id, special_instructions, 
                cart_item_modifiers(id, cart_items_id, modifier_id,
                cart_item_modifier_options(id, cart_item_modifiers_id, modifier_option_id, modifier_id))))`)
            .eq('id', id)
            .single();

        //console.log('dbCart:', dbCart);
        const existingCartItem = dbCart?.cart_items.find((cartItem: any) => cartItem)
        //console.log('existingCartItem:', existingCartItem);
        if (existingCartItem) {
            if ((existingCartItem.menu_item_id === newItems.menu_item_id) && existingCartItem.cart_item_modifiers.length > 0 && newItems.cart_item_modifiers.length > 0) {
                const existingModifierOptions = existingCartItem.cart_item_modifiers.map((existingModifier: any) => existingModifier.cart_item_modifier_options.map((existingModifierOption: any) => existingModifierOption))
                const newModifierOptions = newItems.cart_item_modifiers.map((newModifier: any) => newModifier.modifier_options.map((newModifierOption: any) => newModifierOption))
                let isSameModifierOption = false;
                for (let i = 0; i < existingModifierOptions.length; i++) {
                    isSameModifierOption = newModifierOptions[i]?.every((newOption: any, j: number) => {
                        return existingModifierOptions[i][j]?.modifier_option_id === newOption?.modifier_option_id;
                    });
                
                }
                console.log('isSameModifierOption:', isSameModifierOption);

                if (isSameModifierOption) {
                    const { data, error } = await supabase
                        .from('cart_items')
                        .update({
                            quantity: existingCartItem.quantity + newItems.quantity,
                            total_price: existingCartItem.total_price + newItems.total_price,
                            special_instructions: newItems.special_instructions || existingCartItem.special_instructions
                        })
                        .eq('id', existingCartItem.id)
                        .select('id, quantity, total_price, special_instructions')

                    console.log('same modifier options:', data);
                } else {
                    const {data: cartItem, error} = await supabase
                        .from('cart_items')
                        .insert({
                            cart_id: existingCartItem.cart_id,
                            base_price: newItems.base_price,
                            total_price: newItems.total_price,
                            quantity: newItems.quantity,
                            menu_item_id: newItems.menu_item_id,
                            special_instructions: newItems.special_instructions || '',
                        })
                        .select()

                        console.log('new cart item:', cartItem);

                    const { data: cartItemModifier, error: cartItemModifierError } = await supabase
                        .from('cart_item_modifiers')
                        .insert(
                            newItems.cart_item_modifiers.map((cartItemModifier: any) => ({
                                cart_items_id: cartItem?.[0].id,
                                modifier_id: cartItemModifier.modifier_id,
                            }))
                        )
                        .select()

                    console.log('new cart item modifier:', cartItemModifier);

                    const { data: cartItemModifierOption, error: cartItemModifierOptionError } = await supabase
                        .from('cart_item_modifier_options')
                        .insert(
                            newItems.cart_item_modifiers.flatMap((newItemModifier: any, index: number) => 
                                newItemModifier.modifier_options.map((newItemModifierOption: any) => ({
                                    cart_item_modifiers_id: cartItemModifier?.[index]?.id,
                                    modifier_option_id: newItemModifierOption.modifier_option_id,
                                    modifier_option_price: newItemModifierOption.price,
                                    modifier_id: newItemModifier.modifier_id
                                }))
                            )
                        )
                        .select()

                    //console.log('new cart item modifier option:', cartItemModifierOption);
                }
            } else {
                const { data, error } = await supabase
                    .from('cart_items')
                    .insert({
                        cart_id: dbCart?.id,
                        base_price: newItems.base_price,
                        total_price: newItems.total_price,
                        quantity: newItems.quantity,
                        menu_item_id: newItems.menu_item_id,
                        special_instructions: newItems.special_instructions || '',
                        cart_item_modifiers: newItems.cart_item_modifiers.map((cartItemModifier: any) => ({
                            cart_items_id: existingCartItem.id,
                            modifier_id: cartItemModifier.modifier_id,
                            cart_item_modifier_options: cartItemModifier.modifier_options.map((cartItemModifierOption: any) => ({
                                cart_item_modifiers_id: cartItemModifier.id,
                                modifier_option_id: cartItemModifierOption.id,
                                modifier_option_price: cartItemModifierOption.price,
                                modifier_id: cartItemModifierOption.modifier_id,
                            })),
                        })),
                    })    

                //console.log('new cart item:', data);
            }
                
        }

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