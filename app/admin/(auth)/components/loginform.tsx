'use client';

import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, loginWithEmail } from '@/lib/auth/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const { userData, session } = await loginWithEmail(email, password);
        
        if (session) {
            router.push('/dashboard');
            setError(null); // Clear any previous error
        }
    } catch (err) {
      setError("The email address or password you entered doesn't match any account.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    await forgotPassword(email);
  }

  return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm mx-auto p-6">
        {error  && (
          <p>{error}</p>
        )}
          <div className='flex flex-col space-y-1.5 p-6'>    
            <h3 className='text-2xl font-semibold leading-none tracking-tight'>Login</h3>
            <p className='text-sm text-muted-foreground'>Enter your email below to login to your account.</p>
          </div>
          <div className="p-6 pt-0 grid gap-4">
            <form onSubmit={handleEmailLogin}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input className='mb-3' id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label className='' htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type='submit'  className="mt-3 w-full">Login</Button>
            </form>
            <Button onClick={handleForgotPassword}>Forgot Password?</Button>
          </div>
        </div>
      </div>
  );
};
