import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function GET(req: Request,{ params }: { params: { id: string } }) {
    const id = params.id
    const supabase = await createClient();
    try {
        const {data, error} = await supabase
            .from('modifiers')
            .select('*, modifier_options(*)')
            .eq('menu_item_id', id);
        if (error) throw new Error(error.message);
        console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
    }
}