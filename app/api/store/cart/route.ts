import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server"; 

interface Cart {
    id: number;
    customer_id: number | null;
    cart_items: {
        menu_item_id: number;
        base_price: number;
        total_price: number;
        quantity: number;
        modifiers: {
            id: number;
            name: string;
            min_selections: number;
            max_selections: number;
            is_required: boolean;
            modifier_options: {
                id: number;
                modifier_id: number;
                name: string;
                price: number;
            }[];
        }[];
    }[];
}

export async function POST(request: Request) {
    
    try {
        const supabase = createClient();
        const { customer_id, cart_items } = await request.json();
        const { data: cart, error: createCartError } = await supabase
            .from('carts')
            .insert({
                customer_id: customer_id || null
            })
            .select()
            .single();

        if (createCartError) {
            console.error('Error creating cart:', createCartError);
            return NextResponse.json(
                { error: 'Failed to create cart' },
                { status: 500 }
            );
        }

        const { data: cartItems, error: createCartItemsError } = await supabase
            .from('cart_items')
            .insert(
                cart_items.map((item: any) => ({
                    cart_id: cart.id,
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    base_price: item.base_price,
                    total_price: item.total_price
                }))
            )
            .select();
        
        if (createCartItemsError) {
            console.error('Error creating cart items:', createCartItemsError);
            return NextResponse.json(
                { error: 'Failed to create cart items' },
                { status: 500 }
            );
        }
        let modifiers = [];
        let modifierOptions = [];
        if (cart_items[0].modifiers && cart_items[0].modifiers.length > 0) {
            const { data: cartItemModifiers, error: createCartItemModifiersError } = await supabase
                .from('cart_item_modifiers')
                .insert(
                    cart_items[0].modifiers.map((modifier: any) => ({
                        cart_items_id: cartItems?.[0].id,
                        modifier_id: modifier.id,
                    }))
                )
                .select();

            if (createCartItemModifiersError) {
                console.error('Error creating cart item modifiers:', createCartItemModifiersError);
                return NextResponse.json(
                    { error: 'Failed to create cart item modifiers' },
                    { status: 500 }
                );
            }
            const {data: cartItemModifierOptions, error: createCartItemModifierOptionsError} = await supabase
                .from('cart_item_modifier_options')
                .insert(
                    cart_items[0].modifiers.flatMap((modifier: any) => 
                        modifier.modifier_options.map((option: any) => ({
                            cart_item_modifiers_id: cartItemModifiers?.[0]?.id,  // Use the first modifier ID (or adjust as needed)
                            modifier_option_id: option.id,
                        }))
                    )
                )
                .select();

            if (createCartItemModifierOptionsError) {
                console.error('Error creating cart item modifier options:', createCartItemModifierOptionsError);
                return NextResponse.json(
                    { error: 'Failed to create cart item modifier options' },
                    { status: 500 }
                );
            }
            modifiers = cartItemModifiers;
            modifierOptions = cartItemModifierOptions;
        }
         // Enhance cart items with modifiers and modifier options
         const cartItemsWithModifiers = cartItems?.map((cartItem: any) => {
            // Find the corresponding modifiers for this cart item
            const cartItemModifiersForItem = modifiers.filter((modifier: any) => 
                modifier.cart_items_id === cartItem.id
            );
            
            // Add the modifier options to the corresponding cart item
            const modifiersWithOptions = cartItemModifiersForItem.map((modifier: any) => ({
                ...modifier,
                modifier_options: modifierOptions.filter((option: any) =>
                    option.cart_item_modifiers_id === modifier.id
                ),
            }));

            return {
                ...cartItem,
                modifiers: modifiersWithOptions,
            };
        });

        const cartData: Cart = {
            id: cart.id,
            customer_id: cart.customer_id,
            cart_items: cartItemsWithModifiers || [],
        };
        
        return NextResponse.json(cartData);
    } catch (error) {
        console.error('Error in cart items API:', error);
        return NextResponse.json(    
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }    
}

