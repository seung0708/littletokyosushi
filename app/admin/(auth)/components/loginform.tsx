'use client';

import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithEmail } from '@/lib/auth/auth';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSignIn: (token: string) => void;
}


export const LoginForm: React.FC<LoginFormProps> = ({onSignIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password)
    const {data} = await loginWithEmail(email, password)
    console.log(data)
    if(data?.session) {
      onSignIn(data.session.access_token)
      router.push('/dashboard')
    }
    
  };

  return (
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
    </div>
  );
};
