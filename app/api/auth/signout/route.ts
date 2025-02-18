import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) await supabase.auth.signOut()

  const response = NextResponse.json({ status: 200 })

  // Remove auth cookies
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')

  return response
}