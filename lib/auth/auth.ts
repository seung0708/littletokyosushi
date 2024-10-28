import { redirect } from "next/navigation";
import { supabase } from "../supabase/client";
import { revalidatePath } from "next/cache";
import exp from "constants";

export const loginWithEmail = async (email: string, password: string) => {
     // Attempt to sign in the user with email and password
     const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        
    });
    console.log(error)
    // If there's an error during sign-in, throw it for handling in the calling function
    if (error) {
        throw new Error(error.message); // Return the error message
    }

    // Access user from the returned data
    const user = data.user;
    console.log(user)
    // If no user is found after sign-in, return null
    if (!user) {
        return { session: null }; // Explicitly return null session
    }

    // Check if user exists in the users table
    const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id) // Match with auth_user_id
        .single();

    // Handle error if the user data could not be fetched
    if (fetchError && fetchError.code !== 'PGRST202') {
        throw new Error(fetchError.message);
    }

    return { userData, session: data.session }
}

export const signUpWithEmail = async (email:string, password: string, role: string) => {
    console.log(email, password, role)
    const {data, error} = await supabase.auth.signUp({email, password})
    console.log(data, error)

    const {error: roleError} = await supabase.from('auth.users').update({role}).eq('id', data?.user?.id)

    if(roleError) {
        console.log(roleError)
    }

    if(error) redirect('/')

    revalidatePath('/', 'layout')
}

export async function logout () {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      redirect('/error')
    } 
    revalidatePath('/', 'layout')
}

export async function forgotPassword(email: string) {
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://example.co/update-password',
    })
      
}