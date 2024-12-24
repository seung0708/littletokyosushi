import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract the token_hash and type (signup) from the URL query parameters
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  
  // Define the next page to redirect to after verification (default to /)
  const next = searchParams.get('next') ?? '/';

  // Check if the token_hash and type (signup) are present in the query
  if (token_hash && type) {
    const supabase = await createClient();

    // Verify the OTP (email confirmation token) using Supabase's verifyOtp function
    const { error } = await supabase.auth.verifyOtp({
      type, // 'signup' for signup verification
      token_hash,
    });

    if (!error) {
      // If the verification is successful, redirect the user to the next page (e.g., login page)
      redirect(next);
    }
  }

  // If something went wrong (missing token or error verifying OTP), redirect to an error page
  redirect('/error');
}
