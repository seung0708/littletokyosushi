import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findMatchingCartItem, createNewCartItemWithModifiers,  updateExistingCartItem } from '@/utils/cart';
import { Database } from "@/types/database.types";

type Cart = Database['public']['Tables']['carts']['Row'] & {
    cart_items: (Database["public"]["Tables"]["cart_items"]["Row"] & {
        menu_items: Database["public"]["Tables"]["menu_items"]["Row"];
        cart_item_modifiers: (Database["public"]["Tables"]["cart_item_modifiers"]["Row"] & {
          modifiers: Database["public"]["Tables"]["modifiers"]["Row"];
          cart_item_modifier_options: (Database["public"]["Tables"]["cart_item_modifier_options"]["Row"] & {
            modifier_options: Database["public"]["Tables"]["modifier_options"]["Row"];
          })[];
        })[];
    })[]; 
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
    
    const { id: cartId } = params;
    const supabase = await createClient();

    const {data: dbCart, error} = await supabase
    .from('carts')
    .select(`id, customer_id, 
        cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
        cart_item_modifiers(id, modifiers(*), 
            cart_item_modifier_options(id, modifier_id, modifier_options(*))))`)
    .eq('id', cartId)
    .order('created_at', { referencedTable: 'cart_items' })
    .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching cart items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }

    if (!dbCart) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
 
    return NextResponse.json(dbCart);
}

export async function PATCH(request: Request,  { params }: { params: { id: string } }) {
    const {id} = params;
    const supabase = await createClient();
    try {
        const { customerId, cartItems } = await request.json()
        
        if(!cartItems) return NextResponse.json({ message: 'Cart items not found' });
        const newItems = cartItems[cartItems.length - 1]
        
        const { data: dbCart } = await supabase
            .from('carts')
            .select(`id, customer_id, 
                cart_items(id, cart_id, menu_item_id, quantity, base_price, total_price, special_instructions,
                    cart_item_modifiers(id, cart_items_id, modifier_id,
                cart_item_modifier_options(id, cart_item_modifiers_id, modifier_option_id, modifier_id, modifier_option_price))))`)
            .eq('id', id)
            .single() as { data: Cart | null };
        console.log(dbCart)
        if (!dbCart?.customer_id && customerId) {
            await supabase
                .from('carts')
                .update({ customer_id: customerId })
                .eq('id', id)
        }

        const existingCartItem = findMatchingCartItem(dbCart?.cart_items || [], newItems);
        
        if (existingCartItem) {
            // If we found an exact match (same item and same modifiers), update quantity
            await updateExistingCartItem(supabase, existingCartItem, newItems);
        } else {
            // If no match found (either different item or different modifiers), create new
            await createNewCartItemWithModifiers(supabase, dbCart?.id || '', newItems);
        }
        
        return NextResponse.json(
            { 
                message: 'Cart updated successfully',
                status: 200,
                cartId: dbCart?.id
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


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { itemId } = await request.json();
    const supabase = await createClient();
    try {
        const { data: dbCart, error: cartError } = await supabase
            .from('carts')
            .select(`id, customer_id, 
                cart_items(id, base_price, total_price, quantity, special_instructions, menu_items(id, name, price, image_urls), 
                cart_item_modifiers(id, modifiers(id, name), 
                    cart_item_modifier_options(id, modifier_id, modifier_options(id, name, price))))`)
            .eq('id', id)
            .single();
        

        if (cartError && cartError.code !== 'PGRST116') {
            console.error('Error fetching cart items:', cartError);
            return NextResponse.json(
                { error: 'Failed to fetch cart items' },
                { status: 500 }
            );
        }

        const cartItem = dbCart?.cart_items.find((cartItem) => cartItem.id === itemId);

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