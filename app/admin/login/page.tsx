import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {login} from './actions';

export default function Page() {
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>    
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm mx-auto p-6">
          <div className='flex flex-col space-y-1.5 p-6'>    
            <h3 className='text-2xl font-semibold leading-none tracking-tight'>Login</h3>
            <p className='text-sm text-muted-foreground'>Enter your email below to login to your account.</p>
          </div>
          <div className="p-6 pt-0 grid gap-4">
            <form>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input className='mb-3' type="email" name="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label className='' htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required/>
              </div>
              <Button formAction={login}className="mt-3 w-full">Login</Button>
            </form>
          </div>
        </div>
      </div>
    )
}