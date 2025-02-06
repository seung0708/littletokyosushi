export function getModifiersArray(newItems: any) {
    return newItems.modifiers || newItems.cart_item_modifiers || [];
}

export async function updateExistingCartItem(supabase: any, existingCartItem: any, newItems: any) {
    let updatedQuantity = existingCartItem.quantity;
    
    // If updating from cart page (has cart_item_id)
    if ('cart_item_id' in newItems) { 
        updatedQuantity = newItems.quantity;
    } 
    // If adding from menu page (has menu_item_id)
    else if ('menu_item_id' in newItems) { 
        updatedQuantity += newItems.quantity;
    }

    console.log('Updating quantity:', {
        existingQuantity: existingCartItem.quantity,
        newQuantity: newItems.quantity,
        updatedQuantity
    });

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

export function findMatchingCartItem(cartItems: any[], newItem: any) {
    return cartItems.find((cartItem: any) => {
        // If updating from cart page (has cart_item_id)
        if ('cart_item_id' in newItem) {
            return cartItem.id === newItem.cart_item_id;
        }

        // If adding from menu page (has menu_item_id)
        // First check if it's the same menu item
        const isSameMenuItem = cartItem.menu_item_id === newItem.menu_item_id;
        
        if (!isSameMenuItem) return false;

        // If there are no modifiers on either item, it's a match
        const existingModifiers = cartItem.cart_item_modifiers || [];
        const newModifiers = getModifiersArray(newItem);

        if (existingModifiers.length === 0 && newModifiers.length === 0) return true;

        // If one has modifiers and the other doesn't, not a match
        if (existingModifiers.length === 0 || newModifiers.length === 0) return false;

        // Compare modifiers and their options
        return existingModifiers.every((existingModifier: any) => {
            // Find matching modifier in new item
            const matchingNewModifier = newModifiers.find((newModifier: any) => {
                return newModifier.modifier_id === existingModifier.modifier_id
            });
            
            if (!matchingNewModifier) return false;

            // Compare modifier options
            const existingOptions = existingModifier.cart_item_modifier_options || [];
            const newOptions = matchingNewModifier.modifier_options || [];  

            // If different number of options, not a match
            if (existingOptions.length !== newOptions.length) return false;

            // Check if all options match
            return existingOptions.every((existingOption: any) => 
                newOptions.some((newOption: any) => 
                    existingOption.modifier_option_id === newOption.modifier_option_id
                )
            );
        });
    });
}

export async function createNewCartItemWithModifiers(supabase: any, cartId: string, newItems: any) {
    console.log('newItems', newItems);
    // Create cart item
    const { data: cartItem, error } = await supabase
        .from('cart_items')
        .insert({
            cart_id: cartId,
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
                modifier.cart_item_modifier_options.map((option: any) => ({
                    cart_item_modifiers_id: cartItemModifier[index].id,
                    modifier_option_id: option.modifier_option_id,
                    modifier_option_price: option.price,
                    modifier_id: modifier.modifier_id
                }))
            )
        )
        .select();
    
    
    return { data: cartItem, error: optionError };
}