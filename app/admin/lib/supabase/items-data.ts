import { supabase } from "@/utils/supabase/client";


export async function fetchMenuItemsPages()  {
    const {data, error} = await supabase.from('menu_items').select('*', {count: 'exact'})
    console.log(data,error )
}