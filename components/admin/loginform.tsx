'use client';
import {login} from '@/app/admin/auth/actions';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { loginFormSchema } from '../lib/validations';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';


export const LoginForm: React.FC = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "", 
        password: ""
      }
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    const formData = new FormData();
    formData.set('email', data.email); 
    formData.set('password', data.password); 

    const response = await login(formData);

    console.log(response)

  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>    
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm mx-auto p-6">
          <div className='flex flex-col space-y-1.5 p-6'>    
            <h3 className='text-2xl font-semibold leading-none tracking-tight'>Login</h3>
            <p className='text-sm text-muted-foreground'>Enter your email below to login to your account.</p>
          </div>
          <div className="p-6 pt-0 grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
