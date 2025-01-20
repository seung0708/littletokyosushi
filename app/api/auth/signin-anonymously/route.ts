import { createClient } from '@supabase/supabase-js';
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, 
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
    const { email, name } = await req.json()
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[1]
    //console.log(email, name, first_name, last_name)

    try {

        const {data: customer, error: customerError} = await supabase
            .from('customers')
            .select('*')
            .eq('email', email)
            .single()
        //console.log(customer, customerError)
        if (customer) {
            const { data: {users}, error: usersError} = await supabase.auth.admin.listUsers();
            const existingUser = users.find(user => user.is_anonymous === true && user.user_metadata.email === email);
            //console.log(existingUser, usersError)
            if (existingUser) {
                const { data: { user: signInUser }, error: signInError } = await supabase.auth.signInWithPassword({
                    email: email, 
                    password: process.env.GUEST_DEFAULT_PASSWORD!
                }) 
                console.log(signInUser)
                if (!signInUser) {
                    const { error: updateError } = await supabase.auth.admin.updateUserById(
                        existingUser.id, {
                            password: process.env.GUEST_DEFAULT_PASSWORD!,
                        }
                    );

                    const { data: { user: retrySignInUser }, error: retrySignInError } = await supabase.auth.signInWithPassword({
                        email: email, 
                        password: process.env.GUEST_DEFAULT_PASSWORD!
                    })

                    return NextResponse.json(retrySignInUser, { status: 200 })
                }

                return NextResponse.json(signInUser, { status: 200 })
            }
        }

        // const { data: { user: existingUser }, error: existingUserError } = await supabaseAdmin.auth.getUser()
        // //console.log(existingUser, existingUserError)

        // if (!existingUser) {
        //     const { data: { user }, error } = await supabaseAdmin.auth.signInAnonymously({
        //         options: {
        //              data: {
        //                  email: email,
        //                  first_name: first_name,
        //                  last_name: last_name
        //              }
        //          }
        //      })
        //      if (error) {
        //          console.error('Error signing in anonymously:', error);
        //          return NextResponse.json({ error: error.message }, { status: 400 })
        //      }
     
        //      if (!user) {
        //          return NextResponse.json({ error: 'No user created' }, { status: 400 })
        //      }
     
        //      const { data: customerData, error: customerError } = await supabase
        //          .from('customers')
        //          .insert({
        //              id: user.id,
        //              email: email,
        //              first_name: first_name,
        //              last_name: last_name
        //          })
        //          .select()
        //          .single()

        //      if (customerError) {
        //         console.error('Error creating customer:', customerError);
        //         return NextResponse.json({ error: customerError.message }, { status: 400 })
        //      }
     
        //      // Return user with customer data
        //      return NextResponse.json({
        //         ...user,
        //         customer: customerData
        //      })
        // }
        
        // if (existingUser) {
        //     // Fetch customer data for existing anonymous user
        //     const { data: customerData, error: customerError } = await supabase
        //         .from('customers')
        //         .select('*')
        //         .eq('id', existingUser.id)
        //         .single()

        //     if (customerError) {
        //         console.error('Error fetching customer:', customerError);
        //         return NextResponse.json({ error: customerError.message }, { status: 400 })
        //     }

        //     return NextResponse.json({
        //         ...existingUser,
        //         customer: customerData
        //     })
        // }
      
    } catch (error) {
        // console.error('Error signing in anonymously:', error);
        // return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}