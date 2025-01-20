import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient()
    const { email, name } = await req.json()
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[1]

    try {
        const { data: { user: existingUser }, error: existingUserError } = await supabase.auth.getUser()
        console.log('signin anonymously post route', existingUser, existingUserError)

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
                 return NextResponse.json({ error: error.message }, { status: 400 })
             }
     
             if (!user) {
                 return NextResponse.json({ error: 'No user created' }, { status: 400 })
             }
     
             const { data: customerData, error: customerError } = await supabase
                 .from('customers')
                 .insert({
                     id: user.id,
                     email: email,
                     first_name: first_name,
                     last_name: last_name
                 })
                 .select()
                 .single()

             if (customerError) {
                console.error('Error creating customer:', customerError);
                return NextResponse.json({ error: customerError.message }, { status: 400 })
             }
     
             // Return user with customer data
             return NextResponse.json({
                ...user,
                customer: customerData
             })
        }
        
        if (existingUser?.is_anonymous) {
            // Fetch customer data for existing anonymous user
            const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .select('*')
                .eq('id', existingUser.id)
                .single()

            if (customerError) {
                console.error('Error fetching customer:', customerError);
                return NextResponse.json({ error: customerError.message }, { status: 400 })
            }

            return NextResponse.json({
                ...existingUser,
                customer: customerData
            })
        }
      
    } catch (error) {
        console.error('Error signing in anonymously:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}