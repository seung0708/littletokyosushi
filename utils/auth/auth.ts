import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

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
        .from('employees')
        .select('*')
        .eq('id', user.id) // Match with auth_user_id
        .single();
    
    // Handle error if the user data could not be fetched
    if (fetchError && fetchError.code !== 'PGRST202') {
        throw new Error(fetchError.message);
    }

    return { userData, session: data.session }
}


export const signUpWithEmail = async (first_name: string, last_name: string, email: string, password: string, role: string) => {
    const { data: {user}, error: signupError } = await supabase.auth.signUp({ 
         email, 
         password,
         options: {
            data: {
                first_name, 
                last_name
            }
         }
     });

    if(signupError) {
        console.error('Error signing up: ', signupError.message)
    }

    await supabase.rpc('insert_into_employees_table', {
        id: user?.id,
        first_name,
        last_name,
        email: email
    });

    //console.log(role) 
    const {data, error: fetchError} = await supabase.from('roles').select('id').eq('name', role)

    console.log(data, fetchError)
    const roleId: number = data?.[0].id
    console.log(roleId)

    const {data: insertRole, error: errorRole} = await supabase.from('employee_roles').insert({employee_id: user?.id, role_id: roleId})

    console.log(insertRole, errorRole)

};

export const updateUserandUserRole = async (id: string, first_name: string, last_name: string, email: string) => {
    console.log(id, first_name, last_name, email)
    const {data, error: userError} = await supabase.from('users').insert({auth_id: id, first_name, last_name, email});

    console.log(data, userError)
}



export async function logout () {
    const { error } = await supabase.auth.signOut();
}
