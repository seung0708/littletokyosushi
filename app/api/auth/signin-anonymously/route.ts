import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient()
    const { email, name } = await req.json()
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[1]
    console.log(first_name, last_name)
    try {

        const { data: customer, error } = await supabase.from('customers').insert({
            email: email,
            first_name: first_name,
            last_name: last_name
        })
        .single()
        if (error) throw error;
   

        return NextResponse.json('success')
    } catch (error) {
        console.error('Error signing in anonymously:', error);
        return NextResponse.json('error')
    }
}