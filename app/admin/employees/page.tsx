import { ListFilter, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator,DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
const EmployeesPage: React.FC = () => {
    return(
        <Tabs defaultValue="week">
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">Employees</CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden sm:table-cell">ID</TableHead>
                        <TableHead className="hidden md:table-cell">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-accent">
                        <TableCell>
                          <div className="font-medium">Joselyn Sanchez</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            5MKQ6J3E6JJ80
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          Staff
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    )
}

export default EmployeesPage;