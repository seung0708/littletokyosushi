import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('Signout post handler called')
  const supabase = await createClient()

  try {
    const {error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Unexpected error during signout:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }

}