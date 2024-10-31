import { redirect } from "next/navigation";
import { supabase } from "../../utils/supabase/client";
import { revalidatePath } from "next/cache";


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

export const signUpWithEmail = async (first_name: string, last_name: string, email:string, password: string, role: string) => {
    console.log(email, password)
   
}

export async function logout () {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      redirect('/error')
    } 
    revalidatePath('/', 'layout')
}

export async function forgotPassword(email: string) {
   return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://admin.localhost:3000/update-password'
   });

}

export async function updateUserPassword(password: string) {
    return await supabase.auth.updateUser({ password });
}