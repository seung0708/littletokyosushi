import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('Signout post handler called')
  const supabase = await createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()
 
  if (user) {
    await supabase.auth.signOut()
  }
  return NextResponse.json(user);
}