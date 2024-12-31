export function getModifiersArray(newItems: any) {
    return newItems.modifiers || newItems.cart_item_modifiers || [];
}

export async function updateExistingCartItem(supabase: any, existingCartItem: any, newItems: any) {
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

export async function compareModifierOptions(existingCartItem: any, newItems: any) {
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

export async function createNewCartItemWithModifiers(supabase: any, existingCartItem: any, newItems: any) {
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