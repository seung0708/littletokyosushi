import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function GET(req: Request,{ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const supabase = await createClient();

    try {
        const {data, error} = await supabase
            .from('modifiers')
            .select(`
                id,
                name,
                min_selections,
                max_selections,
                is_required,
                modifier_options (
                    id,
                    modifier_id,
                    name,
                    price
                )
            `)
            .eq('menu_item_id', id);

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch modifiers' }, { status: 500 });
    }
}