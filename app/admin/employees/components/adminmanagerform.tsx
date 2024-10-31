import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminManagerFormProps {
    formData: {
        firstName: string;
        lastName: string; 
        email: string;
        password: string; 
    };
    onSubmit: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdminManagerForm: React.FC<AdminManagerFormProps> = ({formData, onSubmit, onChange}) => (
    <div>    
      <div className="p-6 pt-0 grid gap-4">
        <form onSubmit={onSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="firstName"> First Name</Label>
                <Input className='mb-3' id="first_name" name="firstName" value={formData.firstName} type="text" placeholder="Enter First Name" onChange={onChange}required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="lastName"> Last Name</Label>
                <Input className='mb-3' id="last_name" name="lastName" type="text" placeholder="Enter First Name" value={formData.lastName} onChange={onChange} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input className='mb-3' id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={onChange} required />
            </div>
            <div className="grid gap-2">
                <Label className='' htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" value={formData.password} onChange={onChange} />
            </div>
            <Button type='submit'  className="mt-3 w-full">Add Employee</Button>
        </form>
        </div>
    </div>
);

export default AdminManagerForm;
