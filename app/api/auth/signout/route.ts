import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser() 
 
  if (user) {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } 

  return NextResponse.json({ message: 'Signed out successfully' });
}