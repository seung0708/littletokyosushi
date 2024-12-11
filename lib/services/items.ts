import { Product } from "@/types/definitions";
import { createClient } from '@/lib/supabase/client';

const ITEMS_PER_PAGE = 8;

export async function getItems(
  currentPage: number = 1,
  searchQuery: string = '',
  category: string = ''
): Promise<{ items: Product[], error: any }> {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const supabase = createClient();

    // Log auth state
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.email);

    let query = supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          category_name
        ),
        inventories (
          quantity_in_stock,
          low_stock_threshold
        )
      `)
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    // Add search filter if provided
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    // Add category filter if provided
    if (category) {
      query = query.eq('category_id', category);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Error fetching items:', error);
      return { items: [], error };
    }

    // Transform the data to match the Product type
    const transformedItems = items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      is_available: item.is_available,
      special_instructions: item.special_instructions,
      image_urls: item.image_urls,
      category_name: item.categories?.category_name,
      quantity_in_stock: item.inventories?.[0]?.quantity_in_stock || 0,
      low_stock_threshold: item.inventories?.[0]?.low_stock_threshold || 0,
      sync_status: item.inventories?.[0]?.sync_status || false
    }));

    return { items: transformedItems, error: null };
  } catch (error) {
    console.error('Error in getItems:', error);
    return { items: [], error };
  }
}

export async function getTotalItems(
  query: string
): Promise<number> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('Error getting total items:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getTotalItems:', error);
    return 0;
  }
}

export async function getItem(id: string): Promise<{ item: Product | null, error: any }> {
  try {
    const supabase = createClient();

    // Try direct query to verify access
    const { data: item, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          category_name
        ),
        inventories (
          quantity_in_stock,
          low_stock_threshold
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      return { item: null, error };
    }

    // Transform the data to match the Product type
    const transformedItem: Product = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      is_available: item.is_available,
      special_instructions: item.special_instructions,
      image_urls: item.image_urls,
      category_name: item.categories?.category_name,
      quantity_in_stock: item.inventories?.[0]?.quantity_in_stock || 0,
      low_stock_threshold: item.inventories?.[0]?.low_stock_threshold || 0,
      sync_status: item.inventories?.[0]?.sync_status || false
    };

    return { item: transformedItem, error: null };
  } catch (error) {
    console.error('Error in getItem:', error);
    return { item: null, error };
  }
}