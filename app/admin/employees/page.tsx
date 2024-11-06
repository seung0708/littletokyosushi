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

interface Employee {
  id: string; 
  first_name: string;
  last_name: string; 
  email: string; 
  employee_roles: {role:string}[];
  role?: string
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

    //const supabase = createClient();

    useEffect(() => {
      const fetchData = async () => {
        const { data: employeesData, error: fetchError } = await supabase
          .from('employees')
          .select('id, first_name, last_name, email, employee_roles(role)');
  
        if (fetchError) {
          console.error('Issue fetching employees', fetchError);
          return;
        }
  
        // Process the data to include the role directly on the employee object
        const employeesWithRoles = employeesData?.map((employee: any) => ({
          ...employee,
          role: employee.employee_roles?.[0]?.role ?? 'Unknown' // Default to 'Unknown' if no role
        }));
  
        setEmployees(employeesWithRoles || []);
      };
      fetchData();
    },[])

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