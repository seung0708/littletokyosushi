import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Cart } from '@/types/definitions';


export async function GET(request: Request, { params}: { params: { id: string } }) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', params.id);
    if (error) {
        console.error('Error fetching cart items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }
    return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { cart_items } = await request.json();
    //console.log(cart_items);
    const newItemRequest = cart_items[cart_items.length - 1]; 
    //console.log(newItemRequest);
    try {            
        let result;
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', params.id)
            .eq('menu_item_id', newItemRequest.menu_item_id)
            .single();
        
        if (existingItem) {
            const { data: modifiers, error: modifierError } = await supabase
                .from('cart_item_modifiers')
                .select('*')
                .eq('cart_items_id', existingItem.id);

            const { data: modifierOptions, error: modifierOptionError } = await supabase
                .from('cart_item_modifier_options')
                .select('*')
                .in('cart_item_modifiers_id', modifiers?.map((mod: any) => mod.id) || []);

            
            const newModifiers = newItemRequest.modifiers || [];

            const areModifiersEqual = newModifiers.every((newMod: any) => {
                const existingModifier = modifiers?.find((mod: any) => mod.modifier_id === newMod.id);
                if (!existingModifier) return false;

                const existingOptions = modifierOptions?.filter(
                    (option: any) => option.cart_item_modifiers_id === existingModifier.id
                );
                const areOptionsEqual = newMod.modifier_options.every((newOption: any) => {
                    return existingOptions?.some((existingOption: any) => existingOption.modifier_option_id === newOption.id);
                });
    
                return areOptionsEqual;
            });
    
            if (areModifiersEqual) {
                
                const { data: updatedItem, error: updateError } = await supabase
                    .from('cart_items')
                    .update({
                        quantity: existingItem.quantity + newItemRequest.quantity,
                        total_price: existingItem.total_price + newItemRequest.total_price,
                    })
                    .eq('id', existingItem.id)
                    .select();
                
                result = updatedItem;
            } else {
            
                const { data: createNewItem, error: newItemError } = await supabase
                    .from('cart_items')
                    .insert({
                        cart_id: params.id,
                        menu_item_id: newItemRequest.menu_item_id,
                        quantity: newItemRequest.quantity,
                        base_price: newItemRequest.base_price,
                        total_price: newItemRequest.total_price,
                    })
                    .select();
                const {data: createNewModifiers, error: newModifierError} = await supabase
                    .from('cart_item_modifiers')
                    .insert(newModifiers.map((mod: any) => ({
                        cart_items_id: createNewItem?.[0].id,
                        modifier_id: mod.id,
                    })))
                    .select();
                
                const {data: createNewModifierOptions, error: newModifierOptionError} = await supabase
                    .from('cart_item_modifier_options')
                    .insert(newModifiers.flatMap((mod: any, index: number) => mod.modifier_options.map((opt: any) => ({
                        cart_item_modifiers_id: createNewModifiers?.[index].id,
                        modifier_option_id: opt.id,
                        modifier_id: mod.id
                    }))))
                    .select();
                console.log(createNewItem, createNewModifiers, createNewModifierOptions);
                const cartItemsWithModifiers = createNewItem?.map((cartItem: any) => {
                    
                    const cartItemModifiersForItem = createNewModifiers?.filter((modifier: any) => 
                        modifier.cart_items_id === cartItem.id
                    );
                    const modifiersWithOptions = cartItemModifiersForItem?.map((modifier: any) => ({
                        ...modifier,
                        modifier_options: createNewModifierOptions?.filter((option: any) =>
                            option.cart_item_modifiers_id === modifier.id
                        ),
                    }));
                    //console.log(modifiersWithOptions);
                    return {
                        ...cartItem,
                        modifiers: modifiersWithOptions,
                    };
                });

                result = cartItemsWithModifiers;
                //console.log(result);
            }
        }
        else {
            const { data: createNewItem, error: newItemError } = await supabase
                .from('cart_items')
                .insert({
                    cart_id: params.id,
                    menu_item_id: newItemRequest.menu_item_id,
                    quantity: newItemRequest.quantity,
                    base_price: newItemRequest.base_price,
                    total_price: newItemRequest.total_price,
                })
                .select();
            const {data: createNewModifiers, error: newModifierError} = await supabase
                .from('cart_item_modifiers')
                .insert(newItemRequest.modifiers.map((mod: any) => ({
                    cart_items_id: createNewItem?.[0].id,
                    modifier_id: mod.id,
                })))
                .select();
            
            const {data: createNewModifierOptions, error: newModifierOptionError} = await supabase
                .from('cart_item_modifier_options')
                .insert(newItemRequest.modifiers.flatMap((mod: any, index: number) => mod.modifier_options.map((opt: any) => ({
                    cart_item_modifiers_id: createNewModifiers?.[index].id,
                    modifier_option_id: opt.id,
                    modifier_id: mod.id
                }))))
                .select();

            result = {
                ...createNewItem?.[0],
                modifiers: createNewModifiers?.map((modifier: any) => ({
                    ...modifier,
                    modifier_options: createNewModifierOptions?.filter((option: any) =>
                        option.cart_item_modifiers_id === modifier.id
                    ),
                })),
            }
            console.log(result);
        }
            
        const cartItem = result;
        console.log(cartItem);

        return NextResponse.json(cartItem);

    } catch (error) {
        console.error('Error in PATCH cart:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}