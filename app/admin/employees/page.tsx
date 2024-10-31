import Link from "next/link";


import { PlusCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/utils/supabase/server";
import { useEffect, useState } from "react";

const EmployeesPage: React.FC = async () => {
    const supabase = createClient();
    const {data, error} = await supabase.from('employees').select('email, first_name, last_name, role')
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
                    {data?.map(employee => (
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
                          <div className="mt-1"> {/* Adjust the margin here as needed */}
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