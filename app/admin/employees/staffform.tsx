import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// StaffForm.tsx
const StaffForm = () => (
    <div className="p-6 pt-0 grid gap-4">
    <form onSubmit={() => {}}>
        <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input className='mb-3' id="name" type="text" placeholder="Enter Full Name here" required />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input className='mb-3' id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
            <Label className='' htmlFor="password">Passcode</Label>
            <Input id="password" type="password" required />
        </div>
        <Button type='submit'  className="mt-3 w-full">Add Employee</Button>
    </form>
    </div>
);

export default StaffForm;