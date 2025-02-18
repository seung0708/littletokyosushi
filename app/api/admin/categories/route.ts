import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function GET() {
    const supabase = await createClient();
    try {
        const {data, error} = await supabase
            .from('categories')
            .select('*');
        if (error) throw new Error(error.message);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
    }
}