import { supabase } from "@/utils/supabase/client";


const ITEMS_PER_PAGE = 8;
export async function fetchFilteredItems(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const {data, error} = await supabase.rpc('get_items', {
            query, 
            items_per_page: ITEMS_PER_PAGE, 
            offset_val: offset
        })
        console.log(data,error)
        return data;
    } catch (error) {
        console.error(error)
    }
} 

export async function fetchMenuItemsPages(query: string)  {
    const {data} = await supabase.from('menu_items').select('*', {count: 'exact'})
    console.log(data)
    const totalPages = Math.ceil(Number(data));
    return totalPages;
    
}