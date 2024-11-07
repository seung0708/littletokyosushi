'use client'

import Link from "next/link";


import { PlusCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Users from '@/types/users';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Users[]>([]);

    //const supabase = createClient();

    useEffect(() => {
      const fetchData = async () => {
        const { data: usersData, error: fetchError } = await supabase
          .from('users')
          .select(`
            id, 
            first_name, 
            last_name, 
            email, 
            user_role (
              role_id,
              roles (
                name
              )
            )
          `);
    
        if (fetchError) {
          console.error('Error fetching users with roles', fetchError);
          return;
        }
    
        // Process the data to include roles directly on the employee object
        const employeesWithRoles = usersData?.map((user: any) => {
          const roles = user.user_role?.map((userRole: any) => userRole.roles?.name) || ['Unknown']; // Default to 'Unknown' if no roles
          return {
            ...user,
            role: roles.join(', ') // Join multiple roles if a user has more than one role
          };
        });
    
        setEmployees(employeesWithRoles || []);
      };
    
      fetchData();
    }, []);
    
    

    return(
        <Tabs defaultValue="week">
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader>
                  <div className="flex items-center justify-between"> 
                    Employees
                    <Link href='employees/add-employee'>
                      <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Employees</span>
                      </Button>
                  </Link>
                  </div>       
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell">Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {employees?.map(employee => (
                        <TableRow className="bg-accent">
                          <TableCell className="hidden sm:table-cell">
                            <div className="font-medium">{`${employee.first_name} ${employee.last_name}`}</div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {employee.email}
                          </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                          <div className="mt-1"> 
                          {employee.role}
                          </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    )
}

export default EmployeesPage;