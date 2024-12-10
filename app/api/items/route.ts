import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

async function fetchCategoryId(category: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .single();

    if (error) throw new Error(`Category fetch error: ${error.message}`);
    return data?.id;
}

async function uploadImageToStorage(base64Image: string, filename: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from("menu-items")
        .upload(filename, base64Image, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw new Error(`Image upload error: ${error.message}`);
    return data?.path;
}

export async function POST(req: Request) {
    const supabase = await createClient();
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const price = parseFloat(formData.get('price') as string);
        const image = formData.get('image') as File;

        if (!name || !description || !category || !price || !image) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert image to base64
        const imageBuffer = await image.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        
        // Get category ID
        const categoryId = await fetchCategoryId(category);
        
        // Upload image
        const imagePath = await uploadImageToStorage(base64Image, `${Date.now()}-${image.name}`);
        
        // Create menu item
        const { error } = await supabase
            .from('menu_items')
            .insert({
                name,
                description,
                category_id: categoryId,
                price,
                image_urls: [imagePath]
            });

        if (error) throw error;

        revalidatePath('/items');
        
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json(
            { error: 'Failed to create menu item' },
            { status: 500 }
        );
    }
}

const ITEMS_PER_PAGE = 8;

export async function GET(req: Request) {
    const supabase = await createClient();
    const {searchParams} = new URL(req.url); 
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1'); 
    const offset = (page - 1) * ITEMS_PER_PAGE;
    try {
        const [items, count] = await Promise.all([
            supabase.rpc('get_items', {
                query,
                items_per_page: ITEMS_PER_PAGE,
                offset_val: offset,
            }),
            supabase.rpc('get_items_count', { query }),
        ]);
        if(items.error) throw items.error;
        if(count.error) throw count.error;
        const totalPages = Math.ceil(Number(count.data) / ITEMS_PER_PAGE);
        
        return NextResponse.json({
            items: items.data,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}