'use client'

import { signUpWithEmail } from "@/utils/auth/auth";

import AdminManagerForm from "./adminmanagerform";
import StaffForm from "../staffform";
import FilterDropdown from "../../components/filterdropdown";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";



export default function EmployeeForm() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const addEmployee = (e: React.FormEvent) => {
        e.preventDefault();

    }

    const handleSelectionChange = (selectedItems: { value: string; label: string }[]) => {
        if (selectedItems.length > 0) {
            setSelectedRole(selectedItems[0].value); // Only handle the first selected role
        } else {
            setSelectedRole(null); // Clear selection if none
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
                trigger={
                    (
                        <Button variant='outline' size='sm' className="">
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Role
                            </span>
                            <ChevronDown />
                        </Button>
                    )
                } 
                items={dropdownItems} 
                onSelect={handleSelectionChange}
            />
            <div>
                {selectedRole === 'admin' || selectedRole === 'manager' ? <AdminManagerForm /> : null}
                {selectedRole === 'staff' ? <StaffForm /> : null}
            </div>
        </div>
    )
}