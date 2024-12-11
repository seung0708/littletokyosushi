import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

async function fetchCategoryId(supabase: any, category: string) {
    const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .single();

    if (error) throw error;
    return data.id;
}

async function uploadImageToStorage(supabase: any, base64Image: string, filename: string) {
    const { data, error } = await supabase.storage
        .from("menu-items")
        .upload(filename, base64Image, {
            contentType: 'image/jpeg'
        });

    if (error) throw error;
    return data.path;
}

export async function POST(req: Request) {
    const supabase = await createClient();
    
    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('auth_id', user.id)
            .single();

        if (employeeError || !employeeData) {
            console.log('No employee record found:', employeeError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check admin role using employee ID
        const { data: roleData, error: roleError } = await supabase
            .from('employees')
            .select(`
                employee_roles (
                    roles (
                        name
                    )
                )
            `)
            .eq('id', employeeData.id)
            .single();

        const hasAdminRole = roleData?.employee_roles?.some(
            (er: any) => er.roles?.name === 'admin'
        );

        if (roleError || !hasAdminRole) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
        const categoryId = await fetchCategoryId(supabase, category);

        // Upload image
        const imagePath = await uploadImageToStorage(supabase, base64Image, `${Date.now()}-${image.name}`);

        // Insert menu item
        const { error: insertError } = await supabase
            .from('menu_items')
            .insert({
                name,
                description,
                category_id: categoryId,
                price,
                image_url: imagePath
            });

        if (insertError) throw insertError;

        revalidatePath('/items');
        return NextResponse.json({ message: 'Menu item created successfully' });

    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            { error: 'Failed to create menu item' },
            { status: 500 }
        );
    }
}

const ITEMS_PER_PAGE = 8;
export async function GET(request: Request) {
    const supabase = await createClient();

    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('auth_id', user.id)
            .single();

        if (employeeError || !employeeData) {
            console.log('No employee record found:', employeeError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check admin role using employee ID
        const { data: roleData, error: roleError } = await supabase
            .from('employees')
            .select(`
                employee_roles (
                    roles (
                        name
                    )
                )
            `)
            .eq('id', employeeData.id)
            .single();

        const hasAdminRole = roleData?.employee_roles?.some(
            (er: any) => er.roles?.name === 'admin'
        );

        if (roleError || !hasAdminRole) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {searchParams} = new URL(request.url); 
        const query = searchParams.get('query') || '';
        const page = parseInt(searchParams.get('page') || '1'); 
        const offset = (page - 1) * ITEMS_PER_PAGE;

        const [itemsResult, countResult] = await Promise.all([
            supabase.rpc('get_items', {
                query: query,
                items_per_page: ITEMS_PER_PAGE,
                offset_val: offset
            }),
            supabase.rpc('get_items_count', {
                query: query
            })
        ]);

        if(itemsResult.error) throw itemsResult.error;
        if(countResult.error) throw countResult.error;

        const totalPages = Math.ceil(Number(countResult.data) / ITEMS_PER_PAGE);
        
        return NextResponse.json({
            items: itemsResult.data,
            totalPages
        });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}