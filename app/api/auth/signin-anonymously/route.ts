import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient()
    const { email, name } = await req.json()
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[1]
    
    try {

        const { data: { user: existingUser }, error: existingUserError } = await supabase.auth.getUser()
        console.log(existingUser, existingUserError)

        if (!existingUser) {
            const { data: { user }, error } = await supabase.auth.signInAnonymously({
                options: {
                     data: {
                         email: email,
                         first_name: first_name,
                         last_name: last_name
                     }
                 }
             })
             if (error) {
                 console.error('Error signing in anonymously:', error);
                 return NextResponse.json('error')
             }
     
             if (!user) {
                 return NextResponse.json('error')
             }
     
             const { data: customerData, error: customerError } = await supabase
                 .from('customers')
                 .insert({
                     id: user.id,
                     email: email,
                     first_name: first_name,
                     last_name: last_name
                 })
     
             return NextResponse.json(user)
        }
        
        if (existingUser?.is_anonymous) {
            return NextResponse.json(existingUser)
        }

      
    } catch (error) {
        console.error('Error signing in anonymously:', error);
        return NextResponse.json('error')
    }
}