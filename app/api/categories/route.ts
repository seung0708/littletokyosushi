import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    const supabase = await createClient();
    try {
        const {data, error} = await supabase
            .from('categories')
            .select('*');
        if (error) throw new Error(error.message);
        console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
    }
}