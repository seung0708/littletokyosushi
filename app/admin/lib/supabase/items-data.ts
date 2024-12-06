import { createClient } from "@/lib/supabase/server";

const supabase = createClient();

const ITEMS_PER_PAGE = 8;
export async function fetchFilteredItems(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const { data, error } = await supabase.rpc('get_items', {
            query, 
            items_per_page: ITEMS_PER_PAGE, 
            offset_val: offset
        })
        //console.log(data, error)
        return data;

    } catch (error) {
        console.error(error)
    }
} 

export async function fetchMenuItemsPages(query: string)  {
    const {data, error} = await supabase.rpc('get_items_count', {query})
    //console.log(data, error)
    const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE);
    return totalPages;
    
}

export const fetchCategoryId = async (category: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .single();
  
    if (error) throw new Error(`Category fetch error: ${error.message}`);
    return data?.id;
  };
  
  export const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('menu-items')
      .upload(file.name, file);
  
    if (error) throw new Error(`Image upload error: ${error.message}`);
    return data?.path;
  };
  
  export const insertMenuItem = async (menuItem: {
    name: string;
    description: string;
    category_id: number;
    price: number;
    image_urls: string[];
  }) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select(); // Include select to return inserted data
  
    if (error) throw new Error(`Item insert error: ${error.message}`);
    return data;
  };