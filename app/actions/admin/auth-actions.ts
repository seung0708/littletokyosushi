'use server'

import { revalidatePath } from "next/cache";
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

export const loginAction = async (formData: FormData) => {

    const data = {
        email: formData.get('email') as string, 
        password: formData.get('password') as string
    }

    const supabase = createClient(); 

    const {error} = await supabase.auth.signInWithPassword(data);

    if(error) {
        console.error(error);
    }

    revalidatePath('/', 'layout')
    redirect('/');
};


export async function logout () {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut();
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  }