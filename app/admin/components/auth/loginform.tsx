'use client';

import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        // Replace with your authentication logic (API call, etc.)
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        // Example: store the token, mark user as authenticated
        localStorage.setItem('token', data.token);
        // Redirect to the dashboard or reload the page
        window.location.href = '/dashboard'; // or use router.push if using React Router or Next.js

    } catch (err) {
        setError('Invalid credentials');
    }
};

  return (
    <div className="p-6 pt-0 grid gap-4">
      <form onSubmit={handleLogin}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input className='mb-3' id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label className='' htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button  className="mt-3 w-full">Sign in</Button>
      </form>
    </div>
  );
};
