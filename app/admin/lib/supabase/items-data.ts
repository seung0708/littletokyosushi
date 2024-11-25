'use server';
import { Category, Product } from "@/types/definitions";
import { supabase } from "@/utils/supabase/server";

const ITEMS_PER_PAGE = 8;
export async function fetchFilteredItems(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const { data, error } = await supabase.rpc('get_items', {
            query, 
            items_per_page: ITEMS_PER_PAGE, 
            offset_val: offset
        })
        //console.log( data, error)
        return data;

    } catch (error) {
        console.error(error)
    }
} 

export async function fetchMenuItemsPages(query: string)  {
    const {data, error} = await supabase.rpc('get_items_count', {query})
    const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE);
    return totalPages;
    
}