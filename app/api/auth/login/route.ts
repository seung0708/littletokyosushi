import { loginFormSchema } from '@/schema-validations/adminLogin';
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) { 
  console.log('Login POST')
  const body = await req.json(); 

  const result = loginFormSchema.safeParse(body)

  if(!result.success) {
    return NextResponse.json({error: result.error.errors}, {status: 400})
  }

  const {email, password} = result.data; 

  const supabase = await createClient()

  const{ data: {user}, error } = await supabase.auth.signInWithPassword({
    email, 
    password
  })
  if (error) {
    return NextResponse.json({error: error.message}, {status: 400})
  }

  return NextResponse.json(user);
}