import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Cart, CartItem, CartItemModifier, CartItemModifierOption } from '@/types/cart';

export async function GET(request: Request, { params}: { params: { id: string } }) {
    console.log('Getting cart items...');
    const supabase = createClient();
    const {data: dbCart, error} = await supabase
    .from('carts')
    .select(`id, customer_id, completed_at, 
        cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
        cart_item_modifiers(id, modifiers(id, name), 
            cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
    .eq('id', params.id)
    .order('created_at', { referencedTable: 'cart_items' })
    .single();

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
            menu_item_id: cartItem.menu_items.id,
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

function getModifiersArray(newItems: any) {
    return newItems.modifiers || newItems.cart_item_modifiers || [];
}

async function updateExistingCartItem(supabase: any, existingCartItem: any, newItems: any) {
    let updatedQuantity = 0;
    if ('cart_item_id' in newItems) { 
        updatedQuantity += newItems.quantity;
    } 
    if ('menu_item_id' in newItems) { 
        console.log('existingCartItem.quantity', existingCartItem.quantity);
        console.log('newItems.quantity', newItems.quantity);
        updatedQuantity += existingCartItem.quantity + newItems.quantity;
    }

    const { data, error } = await supabase
        .from('cart_items')
        .update({
            quantity: updatedQuantity,
            total_price: newItems.total_price,
            special_instructions: newItems.special_instructions || existingCartItem.special_instructions
        })
        .eq('id', existingCartItem.id)
        .select('id, quantity, total_price, special_instructions');

    console.log('updated existing cart item:', data);
    return { data, error };
}

async function compareModifierOptions(existingCartItem: any, newItems: any) {
    const existingModifierOptions = existingCartItem.cart_item_modifiers.map((existingModifier: any) => 
        existingModifier.cart_item_modifier_options.map((option: any) => option)
    );
    
    const newModifierOptions = getModifiersArray(newItems).map((newModifier: any) => 
        newModifier.modifier_options.map((option: any) => option)
    );

    console.log('existingModifierOptions:', existingModifierOptions);
    console.log('newModifierOptions:', newModifierOptions);

    return existingModifierOptions.every((existingOptions: any, i: number) =>
        existingOptions.every((existingOption: any, j: number) =>
            existingOption.modifier_option_id === newModifierOptions[i]?.[j]?.modifier_option_id
        )
    );
}

async function createNewCartItemWithModifiers(supabase: any, existingCartItem: any, newItems: any) {
    // Create cart item
    const { data: cartItem, error } = await supabase
        .from('cart_items')
        .insert({
            cart_id: existingCartItem.cart_id,
            base_price: newItems.base_price,
            total_price: newItems.total_price,
            quantity: newItems.quantity,
            menu_item_id: newItems.menu_item_id,
            special_instructions: newItems.special_instructions || '',
        })
        .select();

    if (error || !cartItem) {
        console.error('Error creating cart item:', error);
        return { error };
    }

    // Create modifiers
    const { data: cartItemModifier, error: modifierError } = await supabase
        .from('cart_item_modifiers')
        .insert(
            getModifiersArray(newItems).map((modifier: any) => ({
                cart_items_id: cartItem[0].id,
                modifier_id: modifier.modifier_id,
            }))
        )
        .select();

    if (modifierError) {
        console.error('Error creating modifiers:', modifierError);
        return { error: modifierError };
    }

    // Create modifier options
    const { data: cartItemModifierOptions, error: optionError } = await supabase
        .from('cart_item_modifier_options')
        .insert(
            getModifiersArray(newItems).flatMap((modifier: any, index: number) => 
                modifier.modifier_options.map((option: any) => ({
                    cart_item_modifiers_id: cartItemModifier[index].id,
                    modifier_option_id: option.modifier_option_id,
                    modifier_option_price: option.price,
                    modifier_id: modifier.modifier_id
                }))
            )
        )
        .select();
    
    console.log('created new cart item with modifiers:', cartItem);
    return { data: cartItem, error: optionError };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { cart_items } = await request.json()
        const newItems = cart_items[cart_items.length - 1]
        console.log('newItems:', newItems)
        const { id } = params
        let isSameModifierOptions: boolean;
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
        const existingCartItem = dbCart?.cart_items.find((cartItem: any) => {
            if ( 'menu_item_id' in newItems) {
                return cartItem.menu_item_id === newItems.menu_item_id;
            } else if ('cart_item_id' in newItems) {
                return cartItem.id === newItems.cart_item_id;
            }

        });
        console.log('existingCartItem:', existingCartItem);
        
        if (existingCartItem) {
            if (existingCartItem.cart_item_modifiers.length > 0 && newItems.modifiers) {
                console.log('Adding items from menu to cart...');
                isSameModifierOptions = await compareModifierOptions(existingCartItem, newItems);
                console.log('isSameModifierOptions:', isSameModifierOptions);
                if(isSameModifierOptions) {
                    await updateExistingCartItem(supabase, existingCartItem, newItems);
                } else {
                    await createNewCartItemWithModifiers(supabase, existingCartItem, newItems);
                }
            } 
            if (existingCartItem.cart_item_modifiers.length > 0 && newItems.cart_item_modifiers) {
                await updateExistingCartItem(supabase, existingCartItem, newItems);
            } 

        } 
        //console.log('existingCartItem.menu_item_id !== newItems.menu_item_id:', existingCartItem.menu_item_id !== newItems.menu_item_id);
        if (!existingCartItem) {
            const {data: cartItem, error} = await supabase
                .from('cart_items')
                .insert({
                    cart_id: dbCart?.id,
                    base_price: newItems.base_price,
                    total_price: newItems.total_price,
                    quantity: newItems.quantity,
                    menu_item_id: newItems.menu_item_id,
                    special_instructions: newItems.special_instructions || '',
                })
                .select()

            //console.log('new cart item:', cartItem);

            if (getModifiersArray(newItems) && getModifiersArray(newItems).length > 0) {
                const { data: cartItemModifier, error: cartItemModifierError } = await supabase
                    .from('cart_item_modifiers')
                    .insert(
                        getModifiersArray(newItems).map((cartItemModifier: any) => ({
                            cart_items_id: cartItem?.[0].id,
                            modifier_id: cartItemModifier.modifier_id,
                        }))
                    )
                    .select()

                //console.log('new cart item modifier:', cartItemModifier);

                const {error: cartItemModifierOptionError } = await supabase
                    .from('cart_item_modifier_options')
                    .insert(
                        getModifiersArray(newItems).flatMap((newItemModifier: any, index: number) => 
                            newItemModifier.modifier_options.map((newItemModifierOption: any) => ({
                                cart_item_modifiers_id: cartItemModifier?.[index]?.id,
                                modifier_option_id: newItemModifierOption.modifier_option_id,
                                modifier_option_price: newItemModifierOption.price,
                                modifier_id: newItemModifier.modifier_id
                            }))
                        )
                    )
            }
        } else {
            await updateExistingCartItem(supabase, existingCartItem, newItems);
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;
    const cartItem = await request.json();
    console.log('cartItem:', cartItem);

    try {
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