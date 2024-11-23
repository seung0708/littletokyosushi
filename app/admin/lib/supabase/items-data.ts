'use server';
import { Category } from "@/types/definitions";
import { supabase } from "@/utils/supabase/server";

const ITEMS_PER_PAGE = 8;
export async function fetchFilteredItems(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    query = 'salmon'
    try {
        const { data, error } = await supabase
        .from('menu_items')
        .select(`
            id, 
            name, 
            description, 
            category_id, 
            image_url, 
            price, 
            is_available, 
            special_instructions, 
            categories(id, name), 
            inventories(quantity_in_stock, low_stock_threshold, sync_status)
        `)
        .ilike(`name`, `%${query}`)
        .ilike(`description`, `%${query}%`)
        .ilike(`categories.name`, `%${query}%`)
        .range(offset, offset + ITEMS_PER_PAGE - 1)  // offset for pagination
        .order('id', { ascending: true });

        const items = data?.map(item => {
            const {categories, inventories, ...rest} = item;
            const formattedItems = {
                ...rest,
                category: item.categories as unknown as Category, // Cast it to 'unknown' then to 'Category'
                inventory: item.inventories
            }
            return formattedItems;
        }) || [];
        return items;

    } catch (error) {
        console.error(error)
    }
} 

export async function fetchMenuItemsPages(query: string)  {
    const {count} = await supabase
    .from('menu_items')
    .select(`
        id, 
        name, 
        description, 
        category_id, 
        image_url, 
        price, 
        is_available, 
        special_instructions, 
        categories(id, name), 
        inventories(id, quantity_in_stock, low_stock_threshold, sync_status)
    `,{ count: 'exact' })
    .ilike(`name`, `%${query}%`)
    .ilike(`description`,`%${query}%`)
    
    console.log(count)
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
    
}