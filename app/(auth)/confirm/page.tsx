'use client';
import { type EmailOtpType } from '@supabase/supabase-js';
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Confirm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const verified = searchParams.get('verified');
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = searchParams.get('next');

    useEffect(() => {
        if(tokenHash && type) {
            const verifyEmail = async () => {
                const supabase = createClient();
                const { error } = await supabase.auth.verifyOtp({
                    type: type as EmailOtpType,
                    token_hash: tokenHash,
                });
                if (!error) {
                    router.replace(next ?? '/');
                } else {
                    router.replace('/error');
                }
            };
            verifyEmail();
        } else {
            router.push('/auth/error');
        }
    }, [tokenHash, type, next, router]);
    return (
        <div>
          <p>Verifying your email...</p>
        </div>
    );
}