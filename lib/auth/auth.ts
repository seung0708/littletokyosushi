import { redirect } from "next/navigation";
import { supabase } from "../supabase/client";
import { revalidatePath } from "next/cache";

export const loginWithEmail = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({email, password});
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
    redirect('/login')
}

export async function logout () {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      redirect('/error')
    } 
    redirect('/admin')
  }