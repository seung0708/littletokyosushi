import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const ITEMS_PER_PAGE = 8;

// Helper functions
async function fetchCategoryId(supabase: any, category: string) {
    const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .single();

    if (error) throw error;
    return data.id;
}

async function uploadImageToStorage(supabase: any, file: ArrayBuffer, filename: string, contentType: string) {
    const { data, error } = await supabase.storage
        .from("menu-items")
        .upload(filename, file, {
            contentType: contentType
        });

    if (error) throw error;
    return data.path;
}

// GET handler for both list and single item
export async function GET(
    request: Request,
    { params }: { params: { id: string } } = { params: { id: '' } }
) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth check - User:', user?.email);
        
        if (!user) {
            console.log('No user found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('id', user.id)
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

        // If ID is provided, fetch single item
        if (id) {
            console.log('Fetching single item with ID:', id);
            const { data: item, error } = await supabase
                .from('menu_items')
                .select(`
                    *,
                    categories (
                        name
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching item:', error);
                return NextResponse.json(
                    { error: 'Failed to fetch item' },
                    { status: 500 }
                );
            }

            // Transform the data to match the Product type
            const transformedItem = {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category_id: item.category_id,
                is_available: item.is_available,
                special_instructions: item.special_instructions || '',
                image_urls: item.image_urls || [],
                category_name: item.categories?.name || '',
                quantity_in_stock: 0,
                low_stock_threshold: 0,
                sync_status: false
            };

            return NextResponse.json({ item: transformedItem });
        }

        // Otherwise, fetch list of items
        const query = searchParams.get('query') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * ITEMS_PER_PAGE;

        let queryBuilder = supabase
            .from('menu_items')
            .select(`
                *,
                categories (
                    name
                )
            `);

        if (query) {
            queryBuilder = queryBuilder.ilike('name', `%${query}%`);
        }

        const { data: items, error: itemsError } = await queryBuilder
            .range(offset, offset + ITEMS_PER_PAGE - 1)
            .order('name', { ascending: true });

        if (itemsError) {
            console.error('Error fetching items:', itemsError);
            return NextResponse.json(
                { error: 'Failed to fetch items' },
                { status: 500 }
            );
        }

        // Get total count for pagination
        let countQuery = supabase
            .from('menu_items')
            .select('id', { count: 'exact' });

        if (query) {
            countQuery = countQuery.ilike('name', `%${query}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Error counting items:', countError);
            return NextResponse.json(
                { error: 'Failed to count items' },
                { status: 500 }
            );
        }

        const transformedItems = items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            is_available: item.is_available,
            special_instructions: item.special_instructions || '',
            image_urls: item.image_urls || [],
            category_name: item.categories?.name || '',
            quantity_in_stock: 0,
            low_stock_threshold: 0,
            sync_status: false
        }));

        return NextResponse.json({
            items: transformedItems,
            totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
        });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json(
            { error: 'Failed to fetch items' },
            { status: 500 }
        );
    }
}

// POST handler
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
            .eq('id', user.id)
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
        const images = formData.getAll('images') as File[];

        if (!name || !description || !category || !price || !images.length) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get category ID
        const categoryId = await fetchCategoryId(supabase, category);

        // Upload all images and collect their paths
        const imagePaths = await Promise.all(
            images.map(async (image) => {
                const buffer = await image.arrayBuffer();
                return uploadImageToStorage(supabase, buffer, image.name, image.type);
            })
        );

        // Insert menu item with image_urls as a JSONB array
        const { error: insertError } = await supabase
            .from('menu_items')
            .insert({
                name,
                description,
                category_id: categoryId,
                price,
                image_urls: imagePaths // Supabase will handle the JSONB conversion
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

export async function PATCH(
    request: Request
) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    
    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth check - User:', user?.email);
        
        if (!user) {
            console.log('No user found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('id', user.id)
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

        const body = await request.json();

        // Update menu item
        const { error: menuItemError } = await supabase
            .from('menu_items')
            .update({
                name: body.name,
                description: body.description,
                price: body.price,
                is_available: body.is_available,
                special_instructions: body.special_instructions,
            })
            .eq('id', id);

        if (menuItemError) {
            console.error('Error updating item:', menuItemError);
            throw menuItemError;
        }

        revalidatePath('/items');
        return NextResponse.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error in PATCH handler:', error);
        return NextResponse.json(
            { error: 'Failed to update item' },
            { status: 500 }
        );
    }
}


export async function DELETE(
    request: Request
) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    
    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth check - User:', user?.email);
        
        if (!user) {
            console.log('No user found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('id', user.id)
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

        // Delete menu item
        const { error: deleteError } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting item:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete item' },
                { status: 500 }
            );
        }
        revalidatePath('/items');
        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json(
            { error: 'Failed to delete item' },
            { status: 500 }
        );
    }
}