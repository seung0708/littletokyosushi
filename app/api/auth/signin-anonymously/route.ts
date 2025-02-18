import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {NextResponse} from "next/server";
import crypto from 'crypto'

export async function POST(req: Request) {
    const supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const serverSupabase = await createServerClient()
    const { email, name } = await req.json()
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[1]
    const guestPassword = crypto.randomBytes(32).toString('hex')

    try {
        // Check if customer exists
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('email', email)
            .single()
        if (customerError && customerError.code !== 'PGRST116') {
            console.error('Error fetching customer:', customerError)
            return NextResponse.json({ error: customerError.message }, { status: 400 })
        }

        // If customer exists, check their user account
        if (customer) {
            const { data: { user: existingUser }, error: usersError } = await supabase.auth.admin.getUserById(customer.id)

            if (usersError) {
                console.error('Error fetching user:', usersError)
                return NextResponse.json({ error: usersError.message }, { status: 400 })
            }
            
            // If user exists and is not anonymous, prevent sign in
            if (existingUser && !existingUser?.is_anonymous) {
                return NextResponse.json(
                   { error: "An account with this email already exists. Please sign in instead." },
                   { status: 400 }
                )
            }

            // If we have an existing anonymous user, sign them in with their stored password
            if (existingUser && existingUser?.is_anonymous) {
                const storedPassword = existingUser.user_metadata?.guest_password
                
                if (!storedPassword) {
                    const {error: updateUserError} = await supabase.auth.admin.updateUserById(
                        existingUser.id,
                        {
                            email: email,
                            password: guestPassword,
                            user_metadata: {
                                ...existingUser.user_metadata,
                                guest_password: guestPassword
                            }
                        }
                    )
                    
                    if (updateUserError) {
                        console.error('Error updating existing anonymous user:', updateUserError)
                        return NextResponse.json({ error: updateUserError.message }, { status: 400 })
                    }
                }

                const { data, error: signInError } = await serverSupabase.auth.signInWithPassword({
                    email: email,
                    password: storedPassword || guestPassword
                })
                
                if (signInError) {
                    console.error('Error signing in existing anonymous user:', signInError)
                    return NextResponse.json({ error: signInError.message }, { status: 400 })
                }

                return NextResponse.json({ user: data.user })
            }
        } else {
            const { data: { user: anonymousUser }, error: anonymousUserError } = await serverSupabase.auth.signInAnonymously({
              options: {
                data: {
                  email: email,
                  first_name: first_name,
                  last_name: last_name,
                  guest_password: guestPassword
                }
              }
            })

            if (anonymousUserError) {
                console.error('Error signing in anonymous user:', anonymousUserError)
                return NextResponse.json({ error: anonymousUserError.message }, { status: 400 })
            }
        
            // Create or update customer record
            const { error: customerUpdateError } = await supabase
                .from('customers')
                .upsert({
                    id: anonymousUser?.id,
                    email: email,
                    first_name: first_name,
                    last_name: last_name
                })
                .select()
                .single()

            if (customerUpdateError) {
                console.error('Error upserting customer:', customerUpdateError)
                return NextResponse.json({ error: customerUpdateError.message }, { status: 400 })
            }

            return NextResponse.json({ user: anonymousUser })
        }
    } catch (error) {
        console.error('Error in sign-in anonymously:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}