import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user },  } = await supabase.auth.getUser()
  console.log(user);
  if (user) await supabase.auth.signOut()

  return NextResponse.json({ status: 200 })
}