'use client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { loginFormSchema } from '@/schema-validations/adminLogin';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export const LoginForm: React.FC = () => {
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof loginFormSchema>>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "", 
        password: ""
      }
  });

  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn)
    if(isLoggedIn) router.push('/dashboard')
  }, [isLoggedIn])

  const handleLogin = async (data: z.infer<typeof loginFormSchema>) => {
    const response = await fetch('http://admin.localhost:3000/api/auth/login', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(data)
    })

    const responseData = await response.json(); 
    console.log(responseData)
    if(!response.ok) {
      setError(responseData.error || 'Invalid email or password'); 
    } else {
      setIsLoggedIn(true)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>    
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm mx-auto p-6">
          <div className='flex flex-col space-y-1.5 p-6'>    
            <h3 className='text-2xl font-semibold leading-none tracking-tight'>Login</h3>
            <p className='text-sm text-muted-foreground'>Enter your email below to login to your account.</p>
          </div>
          <div className="p-6 pt-0 grid gap-4">
            <Form {...form}>
              <form onSubmit={form.control.handleSubmit(handleLogin)}>
              <FormField 
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder='Enter email...' 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.control._formState.errors.email && <p>{form.control._formState.errors.email.message}</p> }
              <FormField 
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder='Enter password...' 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-3 w-full">Login</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
  );
};
