'use client'

import { signUpWithEmail } from "@/utils/auth/auth";

import FilterDropdown from "../../ui/filterdropdown";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";



export default function EmployeeForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [formData, setFormData] = useState({
        firstName: '', 
        lastName: '',
        email: '',
        password: ''
    })

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, 
            [name]:value
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {firstName, lastName, email, password} = formData; 
        
        await signUpWithEmail(firstName, lastName, email, password, selectedRole); 
    
    }

    const handleSelectionChange = (selectedItems: { value: string; label: string }[]) => {
        if (selectedItems.length > 0) {
            setSelectedRole(selectedItems[0].value); // Only handle the first selected role
        } else {
            setSelectedRole(''); // Clear selection if none
        }
    };

    const dropdownItems = [
        {value: 'admin', label:'Admin'},
        {value: 'manager', label:'Manager'},
        {value: 'staff', label:'Staff'}
    ]

    

    return (
        <div className="space-y-8">
            <FilterDropdown 
            trigger={(
               <Button variant='outline' size='sm' className="">
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Role
                    </span>
                    <ChevronDown />
                </Button>
            )} 
            items={dropdownItems} 
            onSelect={handleSelectionChange}
            />
            <div className="p-6 pt-0 grid gap-4">
                <form onSubmit={handleSubmit}>      
                    <div className="grid gap-2">
                        <Label htmlFor="firstName"> First Name</Label>
                        <Input className='mb-3' id="first_name" name="firstName" value={formData.firstName} type="text" placeholder="Enter First Name" onChange={handleChange}required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName"> Last Name</Label>
                        <Input className='mb-3' id="last_name" name="lastName" type="text" placeholder="Enter Last Name" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input className='mb-3' id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label className='' htmlFor="password">Password</Label>
                        <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <Button type='submit'  className="mt-3 w-full">Add Employee</Button>
                </form>
        </div>
    </div>
    )
}